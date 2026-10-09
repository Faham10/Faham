import { Router } from "express";
import { env } from "../config/env.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { Message } from "../models/Message.js";
import { ShowroomProfile } from "../models/ShowroomProfile.js";
import { Vehicle } from "../models/Vehicle.js";
import {
  messageIdSchema,
  messageStatusSchema,
  profileSchema,
  replySchema,
  vehicleIdSchema,
  vehicleSchema
} from "../utils/schemas.js";

const router = Router();
router.use(requireAdmin);

router.get("/messages", asyncHandler(async (request, response) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(200).lean();
  response.json({ messages });
}));

router.get("/vehicles", asyncHandler(async (request, response) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 }).lean();
  response.json({ vehicles });
}));

router.patch("/messages/:id", validate(messageStatusSchema), asyncHandler(async (request, response) => {
  const message = await Message.findByIdAndUpdate(
    request.validated.params.id,
    { status: request.validated.body.status },
    { new: true, runValidators: true }
  );
  if (!message) return response.status(404).json({ error: "Enquiry not found." });
  return response.json({ message });
}));

router.post("/messages/:id/reply", validate(replySchema), asyncHandler(async (request, response) => {
  const routeStartedAt = Date.now();
  const timings = {
    databaseLookupMs: null,
    emailSendMs: null,
    databaseSaveMs: null
  };
  let outcome = "error";

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey || !env.SMTP_FROM) {
      outcome = "resend_not_configured";
      return response.status(503).json({ error: "Configure Resend and sender settings before sending replies." });
    }

    const lookupStartedAt = Date.now();
    let message;
    try {
      message = await Message.findById(request.validated.params.id);
    } finally {
      timings.databaseLookupMs = Date.now() - lookupStartedAt;
    }
    if (!message) {
      outcome = "not_found";
      return response.status(404).json({ error: "Enquiry not found." });
    }

    const emailStartedAt = Date.now();
    let resendResponse;
    try {
      resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: env.SMTP_FROM,
          to: message.email,
          reply_to: env.SMTP_FROM,
          subject: `Re: ${message.subject}`,
          text: `Hello ${message.name},\n\n${request.validated.body.reply}\n\nAURALUXE MOTORS`
        }),
        signal: AbortSignal.timeout(30000)
      });
    } finally {
      timings.emailSendMs = Date.now() - emailStartedAt;
    }
    if (!resendResponse.ok) {
      outcome = "email_provider_rejected";
      console.warn("admin.reply.email_provider_error", JSON.stringify({ status: resendResponse.status }));
      return response.status(502).json({
        error: "The email provider could not accept the reply. Check the verified sender configuration."
      });
    }

    message.reply = request.validated.body.reply;
    message.status = "replied";
    message.repliedAt = new Date();
    const saveStartedAt = Date.now();
    try {
      await message.save();
    } finally {
      timings.databaseSaveMs = Date.now() - saveStartedAt;
    }
    outcome = "success";
    return response.json({ message: "Your reply has been sent.", enquiry: message });
  } catch (error) {
    outcome = "error";
    throw error;
  } finally {
    console.info("admin.reply.timing", JSON.stringify({
      outcome,
      ...timings,
      totalMs: Date.now() - routeStartedAt
    }));
  }
}));

router.delete("/messages/:id", validate(messageIdSchema), asyncHandler(async (request, response) => {
  const message = await Message.findByIdAndDelete(request.validated.params.id);
  if (!message) return response.status(404).json({ error: "Enquiry not found." });
  return response.status(204).end();
}));

router.post("/vehicles", validate(vehicleSchema), asyncHandler(async (request, response) => {
  const vehicle = await Vehicle.create(request.validated.body);
  response.status(201).json({ vehicle });
}));

router.put("/vehicles/:id", validate(vehicleIdSchema.merge(vehicleSchema)), asyncHandler(async (request, response) => {
  const { id } = request.validated.params;
  const vehicle = await Vehicle.findByIdAndUpdate(id, request.validated.body, {
    new: true,
    runValidators: true
  });
  if (!vehicle) return response.status(404).json({ error: "Vehicle not found." });
  return response.json({ vehicle });
}));

router.delete("/vehicles/:id", validate(vehicleIdSchema), asyncHandler(async (request, response) => {
  const vehicle = await Vehicle.findByIdAndDelete(request.validated.params.id);
  if (!vehicle) return response.status(404).json({ error: "Vehicle not found." });
  return response.status(204).end();
}));

router.put("/profile", validate(profileSchema), asyncHandler(async (request, response) => {
  const profile = await ShowroomProfile.findOneAndUpdate(
    { key: "main" },
    { ...request.validated.body, key: "main" },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  response.json({ profile });
}));

export default router;

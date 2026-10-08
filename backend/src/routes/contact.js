import { Router } from "express";
import { Message } from "../models/Message.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { contactSchema } from "../utils/schemas.js";

const router = Router();

router.post("/", validate(contactSchema), asyncHandler(async (request, response) => {
  const message = await Message.create(request.validated.body);
  response.status(201).json({
    message: "Thank you. Your enquiry has been sent to our showroom.",
    id: message.id
  });
}));

export default router;

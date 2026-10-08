import { Router } from "express";
import { Vehicle } from "../models/Vehicle.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(async (request, response) => {
  const filter = { status: "available" };
  const { q, make, bodyStyle } = request.query;

  if (typeof make === "string" && make.trim()) filter.make = new RegExp(`^${escapeRegex(make.trim())}$`, "i");
  if (typeof bodyStyle === "string" && bodyStyle.trim()) {
    filter.bodyStyle = new RegExp(`^${escapeRegex(bodyStyle.trim())}$`, "i");
  }
  if (typeof q === "string" && q.trim()) {
    const query = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ make: query }, { model: query }, { bodyStyle: query }, { description: query }];
  }

  const vehicles = await Vehicle.find(filter).sort({ featured: -1, createdAt: -1 }).limit(60).lean();
  response.json({ vehicles });
}));

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;

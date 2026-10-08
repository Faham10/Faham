import { Router } from "express";
import { Vehicle } from "../models/Vehicle.js";
import { ShowroomProfile } from "../models/ShowroomProfile.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(async (request, response) => {
  const [profile, vehicles] = await Promise.all([
    ShowroomProfile.findOne({ key: "main" }).lean(),
    Vehicle.find({ status: "available" }).sort({ featured: -1, createdAt: -1 }).limit(60).lean()
  ]);
  response.json({ profile, vehicles });
}));

export default router;

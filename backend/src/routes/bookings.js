import { Router } from "express";
import mongoose from "mongoose";
import { Message } from "../models/Message.js";
import { Vehicle } from "../models/Vehicle.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { bookingSchema } from "../utils/schemas.js";

const router = Router();

router.post("/", validate(bookingSchema), asyncHandler(async (request, response) => {
  const { name, email, phone, preferredDate, message, vehicle } = request.validated.body;
  let requestedVehicle = vehicle;

  if (vehicle.id && mongoose.isValidObjectId(vehicle.id)) {
    const currentVehicle = await Vehicle.findOne({ _id: vehicle.id, status: "available" }).lean();
    if (!currentVehicle) {
      return response.status(409).json({ error: "This car is no longer available. Please refresh the collection and choose another." });
    }
    requestedVehicle = {
      id: currentVehicle._id.toString(),
      make: currentVehicle.make,
      model: currentVehicle.model,
      year: currentVehicle.year,
      price: currentVehicle.price,
      mileage: currentVehicle.mileage,
      transmission: currentVehicle.transmission,
      fuel: currentVehicle.fuel,
      bodyStyle: currentVehicle.bodyStyle,
      image: currentVehicle.image
    };
  }

  const vehicleName = `${requestedVehicle.year ? `${requestedVehicle.year} ` : ""}${requestedVehicle.make} ${requestedVehicle.model}`;
  const body = [
    `Booking request for ${vehicleName}.`,
    `Preferred date: ${preferredDate}.`,
    message ? `Customer notes: ${message}` : ""
  ].filter(Boolean).join("\n\n");

  const enquiry = await Message.create({
    name,
    email,
    phone,
    subject: `Booking request: ${vehicleName}`,
    body,
    type: "booking",
    vehicle: requestedVehicle,
    preferredDate
  });

  return response.status(201).json({
    message: "Your booking request has been sent to the showroom team.",
    id: enquiry.id
  });
}));

export default router;

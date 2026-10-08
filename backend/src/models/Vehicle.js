import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true, maxlength: 60 },
    model: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: Number, required: true, min: 1900, max: 2100 },
    price: { type: Number, required: true, min: 0 },
    mileage: { type: Number, required: true, min: 0 },
    transmission: { type: String, required: true, trim: true, maxlength: 40 },
    fuel: { type: String, required: true, trim: true, maxlength: 40 },
    bodyStyle: { type: String, required: true, trim: true, maxlength: 40 },
    exterior: { type: String, trim: true, maxlength: 50, default: "" },
    description: { type: String, required: true, trim: true, maxlength: 1500 },
    image: { type: String, required: true, trim: true, maxlength: 500 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["available", "reserved", "sold"], default: "available" }
  },
  { timestamps: true }
);

vehicleSchema.index({ make: 1, model: 1 });
vehicleSchema.index({ status: 1, featured: -1, createdAt: -1 });

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);

import mongoose from "mongoose";

const showroomProfileSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "main" },
    brand: { type: String, required: true, maxlength: 80 },
    tagline: { type: String, required: true, maxlength: 160 },
    description: { type: String, required: true, maxlength: 2000 },
    location: { type: String, required: true, maxlength: 120 },
    phone: { type: String, required: true, maxlength: 40 },
    email: { type: String, required: true, maxlength: 254 },
    heroImage: { type: String, required: true, maxlength: 500 },
    services: [{ type: String, trim: true, maxlength: 100 }]
  },
  { timestamps: true }
);

export const ShowroomProfile = mongoose.model("ShowroomProfile", showroomProfileSchema);

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 40, default: "" },
    subject: { type: String, trim: true, maxlength: 120, default: "Showroom enquiry" },
    body: { type: String, required: true, trim: true, maxlength: 3000 },
    type: { type: String, enum: ["enquiry", "booking"], default: "enquiry" },
    vehicle: {
      id: { type: String, trim: true, default: "" },
      make: { type: String, trim: true, default: "" },
      model: { type: String, trim: true, default: "" },
      year: { type: Number, default: null },
      price: { type: Number, default: null },
      mileage: { type: Number, default: null },
      transmission: { type: String, trim: true, default: "" },
      fuel: { type: String, trim: true, default: "" },
      bodyStyle: { type: String, trim: true, default: "" },
      image: { type: String, trim: true, default: "" }
    },
    preferredDate: { type: String, default: "" },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    reply: { type: String, trim: true, maxlength: 3000, default: "" },
    repliedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

messageSchema.index({ status: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);

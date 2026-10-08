import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid record ID");
const trimmedText = (min, max, label) =>
  z.string().trim().min(min, `${label} is required`).max(max, `${label} is too long`);

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(200)
  })
});

export const contactSchema = z.object({
  body: z.object({
    name: trimmedText(2, 100, "Name"),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40).optional().default(""),
    subject: z.string().trim().max(120).optional().default("Showroom enquiry"),
    body: trimmedText(10, 3000, "Message")
  })
});

export const bookingSchema = z.object({
  body: z.object({
    name: trimmedText(2, 100, "Name"),
    email: z.string().trim().email().max(254),
    phone: trimmedText(5, 40, "Phone number"),
    preferredDate: z.string().date().refine((date) => date >= new Date().toISOString().slice(0, 10), "Choose today or a future date"),
    message: z.string().trim().max(1000).optional().default(""),
    vehicle: z.object({
      id: z.string().trim().max(100).optional().default(""),
      make: trimmedText(1, 60, "Make"),
      model: trimmedText(1, 80, "Model"),
      year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),
      price: z.coerce.number().nonnegative().optional(),
      mileage: z.coerce.number().nonnegative().optional(),
      transmission: z.string().trim().max(40).optional().default(""),
      fuel: z.string().trim().max(40).optional().default(""),
      bodyStyle: z.string().trim().max(40).optional().default(""),
      image: z.string().trim().max(500).optional().default("")
    })
  })
});

export const vehicleSchema = z.object({
  body: z.object({
    make: trimmedText(1, 60, "Make"),
    model: trimmedText(1, 80, "Model"),
    year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 2),
    price: z.coerce.number().nonnegative(),
    mileage: z.coerce.number().nonnegative(),
    transmission: trimmedText(1, 40, "Transmission"),
    fuel: trimmedText(1, 40, "Fuel type"),
    bodyStyle: trimmedText(1, 40, "Body style"),
    exterior: z.string().trim().max(50).optional().default(""),
    description: trimmedText(10, 1500, "Description"),
    image: z.string().trim().min(1).max(500),
    featured: z.coerce.boolean().optional().default(false),
    status: z.enum(["available", "reserved", "sold"]).optional().default("available")
  })
});

export const vehicleIdSchema = z.object({
  params: z.object({ id: objectId })
});

export const messageIdSchema = z.object({
  params: z.object({ id: objectId })
});

export const messageStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(["new", "read", "replied"]) })
});

export const replySchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ reply: trimmedText(2, 3000, "Reply") })
});

export const profileSchema = z.object({
  body: z.object({
    brand: trimmedText(2, 80, "Brand"),
    tagline: trimmedText(5, 160, "Tagline"),
    description: trimmedText(20, 2000, "Description"),
    location: trimmedText(2, 120, "Location"),
    phone: trimmedText(3, 40, "Phone"),
    email: z.string().trim().email().max(254),
    heroImage: z.string().trim().min(1).max(500),
    services: z.array(trimmedText(2, 100, "Service")).max(12)
  })
});

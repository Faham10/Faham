import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../utils/schemas.js";

const router = Router();
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Please try again in 15 minutes." }
});

router.post("/login", loginLimit, validate(loginSchema), asyncHandler(async (request, response) => {
  const { email, password } = request.validated.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  const validPassword = admin && await bcrypt.compare(password, admin.passwordHash);

  if (!validPassword) {
    return response.status(401).json({ error: "Email or password is incorrect." });
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    subject: admin.id,
    expiresIn: env.JWT_EXPIRES_IN
  });

  return response.json({ token, admin: { email: admin.email } });
}));

export default router;

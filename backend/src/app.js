import cors from "cors";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import bookingsRouter from "./routes/bookings.js";
import contactRouter from "./routes/contact.js";
import portfolioRouter from "./routes/portfolio.js";
import vehiclesRouter from "./routes/vehicles.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json({ limit: "20kb" }));
app.use("/api/contact", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many enquiries. Please try again later." }
}));
app.use("/api/bookings", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many booking requests. Please try again later." }
}));

app.get("/api/health", (request, response) => response.json({ status: "ok" }));
app.use("/api/portfolio", portfolioRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/contact", contactRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use((request, response) => response.status(404).json({ error: "Route not found." }));
app.use(errorHandler);

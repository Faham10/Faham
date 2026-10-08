import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAdmin(request, response, next) {
  const [scheme, token] = request.headers.authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ error: "Administrator sign-in is required." });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload !== "object" || payload.role !== "admin" || !payload.sub) {
      return response.status(401).json({ error: "Your session is invalid. Please sign in again." });
    }
    request.adminId = payload.sub;
    return next();
  } catch {
    return response.status(401).json({ error: "Your session has expired. Please sign in again." });
  }
}

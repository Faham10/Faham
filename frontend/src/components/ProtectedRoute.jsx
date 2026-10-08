import { Navigate, Outlet } from "react-router-dom";
import { getAdminSession } from "../lib/adminSession.js";

export default function ProtectedRoute() {
  return getAdminSession() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

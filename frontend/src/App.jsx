import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicLayout from "./components/PublicLayout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminMessagesPage from "./pages/AdminMessagesPage.jsx";
import AdminProfilePage from "./pages/AdminProfilePage.jsx";
import AdminVehiclesPage from "./pages/AdminVehiclesPage.jsx";
import ComparePage from "./pages/ComparePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import VehiclesPage from "./pages/VehiclesPage.jsx";

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="vehicles" element={<VehiclesPage />} />
      <Route path="compare" element={<ComparePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Route>
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<AdminMessagesPage />} />
        <Route path="vehicles" element={<AdminVehiclesPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

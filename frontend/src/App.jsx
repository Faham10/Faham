import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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

const publicPageMetadata = {
  "/": {
    title: "AURALUXE MOTORS — Find Your Dream Car",
    description: "Explore exceptional cars, compare the collection, and arrange a personal viewing with AURALUXE MOTORS."
  },
  "/vehicles": {
    title: "Available Cars | AURALUXE MOTORS",
    description: "Browse available vehicles, filter by make or body style, and review listing details from AURALUXE MOTORS."
  },
  "/compare": {
    title: "Compare Cars | AURALUXE MOTORS",
    description: "Compare up to three available vehicles by price, mileage, body style, and listed specifications."
  },
  "/about": {
    title: "About AURALUXE MOTORS | Our Showroom",
    description: "Learn about AURALUXE MOTORS and our digital showroom for exploring vehicles, comparing details, and requesting a viewing."
  },
  "/contact": {
    title: "Contact AURALUXE MOTORS | Enquiries & Viewings",
    description: "Contact AURALUXE MOTORS to ask about a vehicle, send an enquiry, or request a viewing."
  }
};

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const metadata = publicPageMetadata[path];
    if (!metadata) return;

    document.title = metadata.title;
    const description = document.head.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", metadata.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://aura-luxe-motors.vercel.app${path}`);
  }, [pathname]);

  return null;
}

export default function App() {
  return <>
    <RouteMetadata />
    <Routes>
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
    </Routes>
  </>;
}

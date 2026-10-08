import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import { api } from "../lib/api.js";
import { originalInventory } from "../lib/showroomContent.js";

export default function PublicLayout() {
  const [portfolio, setPortfolio] = useState({ profile: null, vehicles: [] });
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    api("/portfolio")
      .then(setPortfolio)
      .catch((error) => {
        toast.error(`Live vehicle data could not be loaded: ${error.message}`);
        setPortfolio({ profile: null, vehicles: originalInventory });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="legacy-site">
      <Navbar profile={portfolio.profile} vehicles={portfolio.vehicles} />
      <main><Outlet context={{ ...portfolio, loading }} /></main>
      <Footer profile={portfolio.profile} />
    </div>
  );
}

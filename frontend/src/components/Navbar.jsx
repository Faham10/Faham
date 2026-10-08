import { ArrowUpRight, CarFront, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getShowroomBrand } from "../lib/showroomContent.js";

const links = [
  ["Home", "/"],
  ["Showroom", "/vehicles"],
  ["Compare", "/compare"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export default function Navbar({ profile }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const brand = getShowroomBrand(profile?.brand);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header legacy-header">
      <div className="site-header-inner">
        <Link className="brand-lockup legacy-brand" to="/" aria-label={`${brand}, home`} onClick={closeMenu}>
          <span className="brand-mark"><img src="/auraluxe-mark.svg" alt="" /></span>
          <span className="brand-copy"><span>{brand}</span><small>PRESTIGE AUTOMOTIVE</small></span>
        </Link>
        <nav className={`nav-links legacy-nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <NavLink key={label} to={href} end={href === "/"} onClick={closeMenu} className={({ isActive }) => isActive ? "is-active" : undefined}>{label}</NavLink>
          ))}
          <Link className="legacy-mobile-drive" to="/contact" onClick={closeMenu}>Book VIP viewing <ArrowUpRight size={15} /></Link>
        </nav>
        <div className="legacy-nav-tools">
          <button type="button" className="legacy-nav-icon" aria-label="Search showroom inventory" onClick={() => { navigate("/vehicles"); closeMenu(); }}>
            <Search size={16} />
          </button>
          <button type="button" className="legacy-nav-drive" onClick={() => { navigate("/contact"); closeMenu(); }}>
            <CarFront size={15} /> <span>Book a viewing</span> <ArrowUpRight size={14} />
          </button>
          <button type="button" className="mobile-menu-toggle icon-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

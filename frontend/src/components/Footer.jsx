import { Link } from "react-router-dom";
import { getShowroomBrand } from "../lib/showroomContent.js";

export default function Footer({ profile }) {
  const brand = getShowroomBrand(profile?.brand);
  return (
    <footer className="site-footer auraluxe-footer">
      <div className="footer-bottom">
        <Link className="footer-brand" to="/" aria-label={`${brand}, home`}><span className="footer-brand-mark"><img src="/auraluxe-mark.svg" alt="" /></span><span>{brand}<small>PRESTIGE AUTOMOTIVE</small></span></Link>
        <nav aria-label="Footer navigation"><Link to="/about">Our story</Link><Link to="/vehicles">Showroom</Link><Link to="/compare">Compare</Link><Link to="/contact">Contact</Link></nav>
        <span className="footer-copyright">© {new Date().getFullYear()} {brand}</span>
      </div>
    </footer>
  );
}

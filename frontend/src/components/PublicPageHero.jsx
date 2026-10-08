import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PublicPageHero({ eyebrow, title, accent, description, image, actionLabel, actionTo = "/vehicles" }) {
  return (
    <section className="vip-route-hero" style={{ "--route-hero-image": `url("${image}")` }}>
      <div className="vip-route-hero-content vip-container">
        <span className="vip-eyebrow">{eyebrow}</span>
        <h1>{title}<br /><em>{accent}</em></h1>
        <p>{description}</p>
        {actionLabel && <Link className="vip-button vip-button-blue" to={actionTo}>{actionLabel}<ArrowRight size={16} /></Link>}
      </div>
    </section>
  );
}

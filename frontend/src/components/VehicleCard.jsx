import { ArrowUpRight, Fuel, Gauge, Palette, Settings2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { formatMileage, formatPrice } from "../lib/format.js";
import ThreeDImage from "./ThreeDImage.jsx";

export default function VehicleCard({ vehicle, index = 0, onBook, onEnquire }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className="legacy-vehicle-card"
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06 }}
    >
      <ThreeDImage src={vehicle.image} alt={`${vehicle.year ?? ""} ${vehicle.make} ${vehicle.model}`} className="legacy-vehicle-image" reducedMotion={reducedMotion} />
      <div className="legacy-vehicle-copy">
        <span>{vehicle.year ? `${vehicle.year} · ` : ""}{vehicle.make}</span>
        <div className="legacy-vehicle-title"><h3>{vehicle.model}</h3><strong>{vehicle.price != null ? formatPrice(vehicle.price) : "Price on request"}</strong></div>
        <p>{vehicle.description}</p>
        <div className="legacy-spec-list">
          {vehicle.mileage != null && <span><Gauge size={14} />{formatMileage(vehicle.mileage)}</span>}
          {vehicle.transmission && <span><Settings2 size={14} />{vehicle.transmission}</span>}
          {vehicle.fuel && <span><Fuel size={14} />{vehicle.fuel}</span>}
          {vehicle.exterior && <span><Palette size={14} />{vehicle.exterior}</span>}
        </div>
        {vehicle.bodyStyle && <span className="legacy-body-style">{vehicle.bodyStyle}</span>}
        <div className="legacy-vehicle-actions">
          <button type="button" className="legacy-read-link" onClick={() => onEnquire(vehicle)}>Ask a question <ArrowUpRight size={15} /></button>
          <button type="button" className="legacy-book-button" onClick={() => onBook(vehicle)}>Request booking <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </motion.article>
  );
}

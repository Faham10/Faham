import { ArrowUpRight, CarFront, Fuel, Gauge, Palette, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero.jsx";
import { formatMileage, formatPrice } from "../lib/format.js";

export default function ComparePage() {
  const { vehicles } = useOutletContext();
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedVehicles = useMemo(() => selectedIds.map((id) => vehicles.find((vehicle) => vehicle._id === id)).filter(Boolean), [selectedIds, vehicles]);
  const comparisonRows = [
    ["Year", null, (vehicle) => vehicle.year ?? "Not listed"],
    ["Mileage", Gauge, (vehicle) => vehicle.mileage != null ? formatMileage(vehicle.mileage) : "Not listed"],
    ["Body style", CarFront, (vehicle) => vehicle.bodyStyle ?? "Not listed"],
    ["Transmission", Settings2, (vehicle) => vehicle.transmission ?? "Not listed"],
    ["Fuel", Fuel, (vehicle) => vehicle.fuel ?? "Not listed"],
    ["Exterior", Palette, (vehicle) => vehicle.exterior || "Not listed"]
  ];

  function updateSelection(event) {
    const id = event.target.value;
    if (!id || selectedIds.includes(id)) return;
    setSelectedIds((current) => current.length < 3 ? [...current, id] : current);
  }

  return (
    <>
      <PublicPageHero eyebrow="A CLEARER WAY TO CHOOSE" title="Compare the" accent="details." description="Put up to three available vehicles side by side and review the information listed by our showroom." image="/cars/audi.jpeg" actionLabel="Browse all vehicles" />
      <section className="vip-page-section">
        <div className="vip-container">
          <div className="vip-section-heading"><div><span className="vip-eyebrow">YOUR SHORTLIST</span><h2>Find your <em>perfect match.</em></h2><p>Compare up to three available vehicles using their live showroom details.</p></div></div>
          <div className="vip-compare-picker">
            <div><label className="vip-select-label" htmlFor="compare-vehicle">Add a vehicle to compare</label><span>{selectedVehicles.length} of 3 selected</span></div>
            <select id="compare-vehicle" className="vip-page-select" value="" onChange={updateSelection} disabled={!vehicles.length || selectedVehicles.length === 3}>
              <option value="">{selectedVehicles.length === 3 ? "Maximum of three vehicles selected" : "Choose from available vehicles"}</option>
              {vehicles.filter((vehicle) => !selectedIds.includes(vehicle._id)).map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.year ? `${vehicle.year} ` : ""}{vehicle.make} {vehicle.model}</option>)}
            </select>
          </div>
          {selectedVehicles.length ? (
            <div className={`vip-compare-cards ${selectedVehicles.length === 1 ? "is-single" : ""}`} style={{ "--compare-count": selectedVehicles.length }}>
              {selectedVehicles.map((vehicle, index) => (
                <article className="vip-compare-card" key={vehicle._id}>
                  <div className="vip-compare-card-top"><span>VEHICLE {String(index + 1).padStart(2, "0")}</span><button type="button" onClick={() => setSelectedIds((current) => current.filter((id) => id !== vehicle._id))} aria-label={`Remove ${vehicle.make} ${vehicle.model}`}><X size={16} /><span>Remove</span></button></div>
                  <img className="vip-compare-image" src={vehicle.image} alt={`${vehicle.year ?? ""} ${vehicle.make} ${vehicle.model}`} />
                  <div className="vip-compare-title"><div><span>{vehicle.year ?? "Year not listed"} · {vehicle.make}</span><h3>{vehicle.model}</h3></div><strong>{vehicle.price != null ? formatPrice(vehicle.price) : "Price on request"}</strong></div>
                  <div className="vip-compare-specs">
                    {comparisonRows.map(([label, Icon, format]) => (
                      <div key={label}><span>{Icon && <Icon size={15} />}{label}</span><strong>{format(vehicle)}</strong></div>
                    ))}
                  </div>
                  <Link className="vip-compare-enquire" to="/contact" state={{ vehicle }}>Ask about this vehicle <ArrowUpRight size={16} /></Link>
                </article>
              ))}
            </div>
          ) : <div className="vip-page-empty"><Fuel size={24} /><strong>Start your shortlist</strong><span>Select a vehicle above to compare its price, mileage, body style and more.</span></div>}
          {!vehicles.length && <p className="vip-page-notice">There are no live vehicle listings to compare at the moment. Please contact the showroom for help.</p>}
        </div>
      </section>
    </>
  );
}

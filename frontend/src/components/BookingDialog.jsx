import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api.js";
import { formatPrice } from "../lib/format.js";

export default function BookingDialog({ vehicle, onClose }) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vehicle) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [vehicle, submitting, onClose]);

  if (!vehicle) return null;

  const minimumDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form));
    setSubmitting(true);
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          preferredDate: details.preferredDate,
          message: details.message,
          vehicle: {
            id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            price: vehicle.price,
            mileage: vehicle.mileage,
            transmission: vehicle.transmission,
            fuel: vehicle.fuel,
            bodyStyle: vehicle.bodyStyle,
            image: vehicle.image
          }
        })
      });
      toast.success("Booking request sent. Our team will be in touch to confirm availability.");
      onClose();
    } catch (error) {
      toast.error(`Booking request could not be sent: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !submitting && onClose()}>
      <section className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button className="booking-close" type="button" aria-label="Close booking request" onClick={onClose} disabled={submitting}><X size={19} /></button>
        <div className="booking-vehicle-summary">
          <img src={vehicle.image} alt="" />
          <div>
            <span>AURALUXE MOTORS · BOOKING REQUEST</span>
            <h2 id="booking-title">{vehicle.year ? `${vehicle.year} ` : ""}{vehicle.make} {vehicle.model}</h2>
            <strong>{vehicle.price != null ? formatPrice(vehicle.price) : "Price on request"}</strong>
          </div>
        </div>
        <p className="booking-intro">Share your details and preferred date. Our team will check availability and contact you to confirm next steps.</p>
        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-form-row">
            <label>Your name<input name="name" autoComplete="name" minLength="2" maxLength="100" placeholder="Full name" required /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" minLength="5" maxLength="40" placeholder="+60 12 345 6789" required /></label>
          </div>
          <label>Email address<input name="email" type="email" autoComplete="email" maxLength="254" placeholder="you@example.com" required /></label>
          <label>Preferred visit / booking date<input name="preferredDate" type="date" min={minimumDate} required /></label>
          <label>Anything else we should know? <span>(optional)</span><textarea name="message" rows="3" maxLength="1000" placeholder="Tell us about your plans or questions..." /></label>
          <button className="legacy-button legacy-button-primary booking-submit" type="submit" disabled={submitting}>
            {submitting ? "Sending request..." : <>Send booking request <ArrowUpRight size={16} /></>}
          </button>
          <p className="booking-disclaimer">This is a request, not a confirmed reservation or payment. Availability is confirmed by the AURALUXE team.</p>
        </form>
      </section>
    </div>
  );
}

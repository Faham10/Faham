import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api.js";

export default function ContactForm({ profile, selectedVehicle, onClearVehicle }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setSubmitting(true);
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(data) });
      toast.success("Your message has been sent.");
      form.reset();
      onClearVehicle();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {selectedVehicle && (
        <div className="selected-vehicle">
          <div><span className="eyebrow">ENQUIRING ABOUT</span><strong>{selectedVehicle.year ? `${selectedVehicle.year} ` : ""}{selectedVehicle.make} {selectedVehicle.model}</strong></div>
          <button type="button" onClick={onClearVehicle} aria-label="Remove selected vehicle">×</button>
        </div>
      )}
      <input type="hidden" name="subject" value={selectedVehicle ? `Enquiry: ${selectedVehicle.year ? `${selectedVehicle.year} ` : ""}${selectedVehicle.make} ${selectedVehicle.model}` : "Showroom enquiry"} />
      <div className="form-row">
        <label>Your name<input name="name" autoComplete="name" placeholder="Enter your name" minLength="2" maxLength="100" required /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="Enter your email address" maxLength="254" required /></label>
      </div>
      <label>Phone number <span className="optional">(optional)</span><input name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" maxLength="40" /></label>
      <label>How can we help?<textarea name="body" rows="4" minLength="10" maxLength="3000" placeholder="Tell us about the car or viewing you have in mind..." required /></label>
      <button className="button button-gold button-submit" disabled={submitting} type="submit">
        {submitting ? <>Sending enquiry <LoaderCircle size={17} className="spin" /></> : <>Send an enquiry <ArrowUpRight size={17} /> </>}
      </button>
      <p className="form-note">A member of our concierge team will be in touch shortly.</p>
      {profile?.phone && <a className="contact-direct" href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>Prefer to call? {profile.phone}</a>}
    </form>
  );
}

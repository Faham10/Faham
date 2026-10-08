import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import ContactForm from "../components/ContactForm.jsx";

export default function ContactPage() {
  const { profile } = useOutletContext();
  const location = useLocation();
  const [selectedVehicle, setSelectedVehicle] = useState(location.state?.vehicle ?? null);
  const phoneDigits = profile?.phone?.replace(/\D/g, "");

  return (
    <section className="vip-contact-page" style={{ "--contact-image": 'url("/cars/camaro-blue.jpg")' }} id="contact">
      <div className="vip-container vip-contact-layout">
        <div className="vip-contact-copy">
          <span className="vip-eyebrow">GET IN TOUCH</span>
          <h1>VISIT OUR <em>SHOWROOM</em></h1>
          <p>Schedule a private viewing or connect directly with our team to ask about a car from the collection.</p>
          <div className="vip-contact-details">
            {profile?.location && <div><span><MapPin size={17} /></span><p>{profile.location}</p></div>}
            {profile?.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}><span><Phone size={17} /></span><p>{profile.phone}</p><ArrowUpRight size={14} /></a>}
            {profile?.email && <a href={`mailto:${profile.email}`}><span><Mail size={17} /></span><p>{profile.email}</p><ArrowUpRight size={14} /></a>}
          </div>
          {phoneDigits && <a className="vip-whatsapp-button" href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp"><MessageCircle size={22} /></a>}
        </div>
        <div className="vip-contact-form-panel">
          <h2>Send Direct Inquiry</h2>
          <ContactForm profile={profile} selectedVehicle={selectedVehicle} onClearVehicle={() => setSelectedVehicle(null)} />
        </div>
      </div>
    </section>
  );
}

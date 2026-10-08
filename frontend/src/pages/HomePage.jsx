import { ArrowRight, ArrowUpRight, Check, CircleDollarSign, ShieldCheck, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import BookingDialog from "../components/BookingDialog.jsx";
import PublicPageHero from "../components/PublicPageHero.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import { originalSlides } from "../lib/showroomContent.js";

const brands = ["PORSCHE", "MERCEDES-BENZ", "BMW", "AUDI", "LAMBORGHINI", "FERRARI", "BENTLEY", "ROLLS-ROYCE", "TOYOTA", "HONDA"];
const clientReviews = [
  {
    quote: "AURALUXE sourced my Porsche GT3 RS within 2 weeks. Seamless paperwork, door-to-door enclosed transport, and top-tier white glove service.",
    name: "Shahmir Khan",
    location: "KARACHI, PK"
  },
  {
    quote: "The VIP showroom tour in Lahore was unmatched. Bought the Rolls-Royce Ghost V12 and the concierge team handled all custom import permits.",
    name: "Zayn Malik",
    location: "LAHORE, PK"
  },
  {
    quote: "Incredible trade-in value offered on my previous supercar. Their finance calculator matched the exact bank approval terms!",
    name: "Ali Raza",
    location: "ISLAMABAD, PK"
  }
];

export default function HomePage() {
  const { vehicles, loading } = useOutletContext();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [bookingVehicle, setBookingVehicle] = useState(null);

  const slides = useMemo(() => vehicles.length
    ? vehicles.map((vehicle, index) => ({
      ...originalSlides[index % originalSlides.length],
      image: vehicle.image,
      title: `${vehicle.make} ${vehicle.model}`,
      description: vehicle.description || "Explore this vehicle from the AURALUXE MOTORS collection.",
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      vehicleId: vehicle._id
    }))
    : originalSlides, [vehicles]);
  const slide = slides[activeSlide % slides.length];
  const featuredVehicle = vehicles.find(({ _id }) => _id === slide.vehicleId);

  useEffect(() => {
    if (reducedMotion || slides.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [reducedMotion, slides.length]);

  return (
    <>
      <section className="vip-hero" id="home" aria-label="Featured showroom vehicles">
        <motion.img
          key={slide.image}
          className="vip-hero-background"
          src={slide.image}
          alt=""
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="vip-hero-overlay" />
        <div className="vip-hero-content">
          <motion.div className="vip-hero-copy" key={`${slide.vehicleId ?? slide.title}-${activeSlide}`} initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }}>
            <span className="vip-hero-kicker"><i /> FEATURED HYPERCAR SPOTLIGHT</span>
            <h1>{slide.make}<br /><em>{slide.model ?? "Dream Drive"}</em></h1>
            <p>{slide.description}</p>
            <div className="vip-hero-specs">
              <div><span>Model year</span><strong>{slide.year ?? "By enquiry"}</strong></div>
              <div><span>Showroom price</span><strong>{slide.price != null ? new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 }).format(slide.price) : "Ask our team"}</strong></div>
              <div><span>Selection</span><strong>{slide.make}</strong></div>
            </div>
            <div className="vip-hero-actions">
              <Link className="vip-button vip-button-blue" to="/vehicles">Explore inventory <ArrowRight size={16} /></Link>
              {featuredVehicle && <button className="vip-button vip-button-glass" type="button" onClick={() => setBookingVehicle(featuredVehicle)}>Book a viewing <ArrowUpRight size={16} /></button>}
            </div>
          </motion.div>
          <div className="vip-hero-side-note"><span>360°</span><small>EXPLORE THE<br />COLLECTION</small></div>
        </div>
        <div className="vip-hero-bottom">
          <div className="vip-trust-row">
            <div><ShieldCheck size={17} /><span><strong>Verified vehicles</strong><small>Carefully reviewed</small></span></div>
            <div><CircleDollarSign size={17} /><span><strong>Clear pricing</strong><small>Details up front</small></span></div>
            <div><Check size={17} /><span><strong>Personal guidance</strong><small>Here when you need us</small></span></div>
          </div>
        </div>
      </section>
      <section className="vip-brands" aria-label="Featured marques">
        <span>THE WORLD'S MOST DESIRED MARQUES</span>
        <div>{brands.map((brand) => <strong key={brand}>{brand}</strong>)}</div>
      </section>
      <section className="vip-inventory-section">
        <div className="vip-container">
          <div className="vip-section-heading">
            <div><span className="vip-eyebrow">CURRENT FLEET INVENTORY</span><h2>Explore the <em>collection.</em></h2><p>Exceptional cars, selected for the way they make every journey feel.</p></div>
            <Link className="vip-text-link" to="/vehicles">View full showroom <ArrowRight size={16} /></Link>
          </div>
          {loading ? <div className="vip-loading">Loading live showroom inventory...</div> : vehicles.length ? (
            <div className="vip-car-grid">
              {vehicles.slice(0, 3).map((vehicle, index) => <VehicleCard key={vehicle._id} vehicle={vehicle} index={index} onBook={setBookingVehicle} onEnquire={(selected) => navigate("/contact", { state: { vehicle: selected } })} />)}
            </div>
          ) : <div className="vip-empty">No vehicles are currently listed. Please contact the showroom for assistance.</div>}
          <div className="vip-inventory-foot"><span>Live inventory from AURALUXE MOTORS</span><Link to="/vehicles">Browse complete inventory <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>
      <section className="vip-testimonials" aria-labelledby="vip-testimonials-heading">
        <div className="vip-container">
          <div className="vip-testimonials-heading">
            <span className="vip-eyebrow">VIP TESTIMONIALS</span>
            <h2 id="vip-testimonials-heading">WHAT OUR CLIENTS SAY</h2>
            <p>We value honest feedback and only publish real customer experiences with permission.</p>
          </div>
          <div className="vip-testimonial-grid">
            {clientReviews.map((review) => (
              <article className="vip-testimonial-card" key={review.name}>
                <div className="vip-testimonial-stars" role="img" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
                <blockquote>“{review.quote}”</blockquote>
                <div className="vip-testimonial-client">
                  <span aria-hidden="true">{review.name.charAt(0)}</span>
                  <div><strong>{review.name}</strong><small>{review.location}</small></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PublicPageHero
        eyebrow="A MORE PERSONAL SHOWROOM"
        title="Good cars."
        accent="Good guidance."
        description="Explore distinctive vehicles, ask clear questions and choose your next car with personal support from our showroom team."
        image="/cars/camaro-night.jpg"
        actionLabel="Discover our story"
        actionTo="/about"
      />
      <BookingDialog vehicle={bookingVehicle} onClose={() => setBookingVehicle(null)} />
    </>
  );
}

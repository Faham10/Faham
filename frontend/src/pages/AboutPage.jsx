import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CarFront,
  Check,
  CircleDollarSign,
  Compass,
  KeyRound,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

const METRIC_COUNT_DURATION = 1_600;

function MetricCounter({ value, reducedMotion }) {
  const [count, setCount] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return undefined;
    }

    const startTime = Date.now();
    let lastUpdate = 0;
    const intervalId = window.setInterval(() => {
      const progress = Math.min((Date.now() - startTime) / METRIC_COUNT_DURATION, 1);

      if (Date.now() - lastUpdate >= 80 || progress === 1) {
        setCount(Math.floor(value * progress));
        lastUpdate = Date.now();
      }

      if (progress === 1) window.clearInterval(intervalId);
    }, 40);
    return () => window.clearInterval(intervalId);
  }, [reducedMotion, value]);

  return <strong aria-label={String(value).padStart(2, "0")}>{String(count).padStart(2, "0")}</strong>;
}

const representedMakes = [
  "PORSCHE",
  "MERCEDES-BENZ",
  "BMW",
  "AUDI",
  "LAMBORGHINI",
  "FERRARI",
  "BENTLEY",
  "ROLLS-ROYCE",
  "TOYOTA",
  "HONDA"
];

const standards = [
  { icon: CarFront, title: "A considered collection", description: "Browse a varied selection of luxury, performance and everyday vehicles." },
  { icon: BadgeCheck, title: "Clear vehicle details", description: "Review the listed price, model year, mileage, transmission, fuel and colour." },
  { icon: CircleDollarSign, title: "Straightforward pricing", description: "See the showroom price on each listing, with no hidden calculator or guesswork." },
  { icon: MessageCircle, title: "Personal guidance", description: "Ask our team about a specific vehicle and get help with your shortlist." },
  { icon: Compass, title: "A simpler comparison", description: "Compare up to three available cars side by side before you decide." },
  { icon: KeyRound, title: "Viewings by request", description: "Send a booking request for the car you would like to see." }
];

const customerSteps = [
  { icon: Compass, label: "Explore", description: "Browse the live collection and discover the makes and models available." },
  { icon: Check, label: "Compare", description: "Shortlist up to three vehicles and review their details side by side." },
  { icon: MessageCircle, label: "Ask", description: "Send an enquiry to get answers about the car that interests you." },
  { icon: KeyRound, label: "Arrange a viewing", description: "Request a time to see your chosen vehicle in person." }
];

const showroomGallery = [
  { image: "/cars/porsche-taycan.jpg", alt: "Porsche Taycan 4S in the AURALUXE vehicle collection", caption: "Performance, thoughtfully selected" },
  { image: "/cars/bmw-x7.jpg", alt: "BMW X7 luxury SUV in the AURALUXE vehicle collection", caption: "Comfort for every journey" },
  { image: "/cars/toyota-gr-supra.png", alt: "Toyota GR Supra sports coupe in the AURALUXE vehicle collection", caption: "A collection with character" }
];

export default function AboutPage() {
  const { profile, vehicles = [] } = useOutletContext();
  const reducedMotion = useReducedMotion();
  const brandCount = new Set(vehicles.map(({ make }) => make).filter(Boolean)).size;
  const metrics = [
    { value: vehicles.length, label: "Vehicles in the live collection" },
    { value: brandCount, label: "Makes currently represented" },
    { value: 3, label: "Cars available to compare at once" }
  ];
  const introDescription = profile?.description
    ?? "A considered collection, clear answers and personal guidance to help you find a car that feels right for every journey.";

  return (
    <>
      <section className="vip-about-hero" style={{ "--about-hero-image": 'url("/cars/camaro-night.jpg")' }}>
        <div className="vip-about-hero-inner vip-about-container">
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <span className="vip-about-kicker"><i /> THE AURALUXE STORY</span>
            <h1>Driven by<br /><span>Passion.</span><br />Defined by Excellence.</h1>
            <p>{introDescription}</p>
            <Link className="vip-button vip-button-blue vip-about-hero-button" to="/vehicles">Explore our collection <ArrowUpRight size={16} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="vip-about-intro vip-about-container">
        <motion.div className="vip-about-intro-image" initial={reducedMotion ? false : { opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <img src="/cars/bentley-continental-gt.jpg" alt="Bentley Continental GT, part of the curated AURALUXE collection" loading="lazy" />
          <span>AURALUXE MOTORS · THE COLLECTION</span>
        </motion.div>
        <motion.div className="vip-about-intro-copy" initial={reducedMotion ? false : { opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
          <span className="vip-about-eyebrow">THE AURALUXE EXPERIENCE</span>
          <h2>A better way to find<br /><span>your next drive.</span></h2>
          <p className="vip-about-lead">Buying a remarkable car should feel as considered as driving one.</p>
          <p>AURALUXE MOTORS brings a carefully selected range of vehicles together with a straightforward digital showroom. Explore at your own pace, compare the details that matter and contact our team when you are ready.</p>
          <p>From your first shortlist to a private viewing request, we aim to make each next step clear, helpful and personal.</p>
          <div className="vip-about-values">
            <article><ShieldCheck size={23} /><strong>Trust first</strong><span>Clear details at every step.</span></article>
            <article><Sparkles size={23} /><strong>Curated luxury</strong><span>Distinctive cars, thoughtfully presented.</span></article>
          </div>
        </motion.div>
      </section>

      <section className="vip-about-metrics" aria-label="Live showroom facts">
        <div className="vip-about-container">
          <div className="vip-about-section-heading is-centered">
            <span className="vip-about-eyebrow">THE COLLECTION, AT A GLANCE</span>
            <h2>The experience in <span>numbers.</span></h2>
          </div>
          <div className="vip-about-metric-grid">
            {metrics.map((metric) => <article key={metric.label}><MetricCounter value={metric.value} reducedMotion={reducedMotion} /><span>{metric.label}</span></article>)}
          </div>
        </div>
      </section>

      <section className="vip-about-mission vip-about-container">
        <motion.div className="vip-about-mission-copy" initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <span className="vip-about-eyebrow">OUR APPROACH</span>
          <h2>More than<br /><span>a car.</span></h2>
          <p>Our aim is to make exploring and choosing a vehicle feel considered, transparent and enjoyable—from the first browse to the moment you arrange a viewing.</p>
          <div className="vip-about-steps">
            {customerSteps.map((step, index) => {
              const Icon = step.icon;
              return <article key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><Icon size={18} /><div><strong>{step.label}</strong><p>{step.description}</p></div></article>;
            })}
          </div>
        </motion.div>
        <motion.div className="vip-about-mission-image" initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65 }}>
          <img src="/cars/lamborghini-huracan.jpg" alt="Lamborghini Huracán in the performance collection" loading="lazy" />
          <span>DESIGN · PERFORMANCE · PERSONAL SERVICE</span>
        </motion.div>
      </section>

      <section className="vip-about-standard">
        <div className="vip-about-container">
          <div className="vip-about-section-heading is-centered">
            <span className="vip-about-eyebrow">WHY AURALUXE MOTORS</span>
            <h2>The Luxe <span>standard.</span></h2>
            <p>Everything you need to make a more confident next move.</p>
          </div>
          <div className="vip-about-standard-grid">
            {standards.map((standard, index) => {
              const Icon = standard.icon;
              return <motion.article key={standard.title} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}>
                <span>{String(index + 1).padStart(2, "0")}</span><Icon size={27} /><h3>{standard.title}</h3><p>{standard.description}</p>
              </motion.article>;
            })}
          </div>
        </div>
      </section>

      <section className="vip-about-brands vip-about-container">
        <div className="vip-about-section-heading is-centered">
          <span className="vip-about-eyebrow">THE COLLECTION</span>
          <h2>Brands we <span>represent.</span></h2>
        </div>
        <div className="vip-about-brand-grid">
          {representedMakes.map((make) => <div key={make}>{make}</div>)}
        </div>
      </section>

      <section className="vip-about-gallery">
        <div className="vip-about-container">
          <div className="vip-about-gallery-heading">
            <div><span className="vip-about-eyebrow">INSIDE THE EXPERIENCE</span><h2>Made for the <span>drive ahead.</span></h2></div>
            <p>Take a closer look at a few of the vehicles in our current collection.</p>
          </div>
          <div className="vip-about-gallery-grid">
            {showroomGallery.map((item, index) => <motion.figure key={item.image} className={`vip-about-gallery-item item-${index + 1}`} initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: index * 0.08 }}>
              <img src={item.image} alt={item.alt} loading="lazy" />
              <figcaption>{item.caption}</figcaption>
            </motion.figure>)}
          </div>
        </div>
      </section>

      <section className="vip-about-experience vip-about-container">
        <span className="vip-about-eyebrow">CUSTOMER EXPERIENCE</span>
        <h2>Every car has a story.<br /><span>We help you find yours.</span></h2>
        <p>From browsing and comparing to asking questions and arranging a viewing, the showroom is built around the choices you want to make.</p>
        <div className="vip-about-experience-grid">
          {customerSteps.map((step) => {
            const Icon = step.icon;
            return <article key={step.label}><Icon size={22} /><strong>{step.label}</strong></article>;
          })}
        </div>
      </section>

      <section className="vip-about-cta" style={{ "--about-cta-image": 'url("/cars/rolls-royce-cullinan.jpg")' }}>
        <div>
          <span className="vip-about-eyebrow">YOUR NEXT CHAPTER</span>
          <h2>Ready to find<br /><span>your dream car?</span></h2>
          <div><Link className="vip-button vip-button-blue" to="/vehicles">Explore collection <ArrowRight size={16} /></Link><Link className="vip-button vip-button-glass" to="/contact">Talk to our team <MessageCircle size={16} /></Link></div>
        </div>
      </section>
    </>
  );
}

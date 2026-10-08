import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import BookingDialog from "../components/BookingDialog.jsx";
import PublicPageHero from "../components/PublicPageHero.jsx";
import VehicleCard from "../components/VehicleCard.jsx";

const preferredMakes = [
  "Porsche",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Lamborghini",
  "Ferrari",
  "Bentley",
  "Rolls-Royce",
  "Toyota",
  "Honda"
];

export default function VehiclesPage() {
  const { vehicles, loading } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("ALL");
  const [selectedMake, setSelectedMake] = useState("ALL");
  const [bookingVehicle, setBookingVehicle] = useState(null);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const categories = useMemo(() => ["ALL", ...new Set(vehicles.map(({ bodyStyle }) => bodyStyle?.toUpperCase()).filter(Boolean))], [vehicles]);
  const makes = useMemo(() => {
    const availableMakes = [...new Set(vehicles.map(({ make }) => make).filter(Boolean))];
    return ["ALL", ...availableMakes.sort((first, second) => {
      const firstOrder = preferredMakes.findIndex((make) => make.toLowerCase() === first.toLowerCase());
      const secondOrder = preferredMakes.findIndex((make) => make.toLowerCase() === second.toLowerCase());
      return (firstOrder < 0 ? preferredMakes.length : firstOrder) - (secondOrder < 0 ? preferredMakes.length : secondOrder) || first.localeCompare(second);
    })];
  }, [vehicles]);
  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesCategory = category === "ALL" || vehicle.bodyStyle?.toUpperCase() === category;
      const matchesMake = selectedMake === "ALL" || vehicle.make.toLowerCase() === selectedMake.toLowerCase();
      const matchesSearch = !query || `${vehicle.make} ${vehicle.model} ${vehicle.bodyStyle} ${vehicle.year} ${vehicle.fuel} ${vehicle.transmission} ${vehicle.exterior}`.toLowerCase().includes(query);
      return matchesCategory && matchesMake && matchesSearch;
    });
  }, [vehicles, category, search, selectedMake]);

  function enquire(vehicle) {
    navigate("/contact", { state: { vehicle } });
  }

  return (
    <>
      <PublicPageHero eyebrow="THE AURALUXE COLLECTION" title="Find your" accent="next drive." description="Explore the available cars, compare the details and request a viewing with our team." image="/cars/camaro-night.jpg" actionLabel="Talk to our team" actionTo="/contact" />

      <section className="legacy-vehicles vehicles-page-list" aria-labelledby="vehicles-title">
        <div className="page-shell">
          <div className="legacy-vehicles-heading vehicles-page-heading">
            <div><span className="legacy-eyebrow">AVAILABLE VEHICLES</span><h2 id="vehicles-title">Choose your <em>favourite.</em></h2></div>
            <span className="legacy-count">{filteredVehicles.length.toString().padStart(2, "0")} CARS</span>
          </div>
          <div className="vehicles-toolbar">
            <label className="legacy-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search available cars</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by make, model or year..." /></label>
            <div className="vehicles-categories" role="group" aria-label="Filter by car type">
              {categories.map((item) => <button type="button" key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
          </div>
          <div className="vehicles-brand-filter">
            <div className="vehicles-filter-heading"><span>SHOP BY MAKE</span><span>{selectedMake === "ALL" ? "ALL MARQUES" : selectedMake.toUpperCase()}</span></div>
            <div className="vehicles-brand-filters" role="group" aria-label="Filter by vehicle make">
              {makes.map((make) => <button type="button" key={make} className={selectedMake === make ? "is-active" : ""} aria-pressed={selectedMake === make} onClick={() => setSelectedMake(make)}>{make === "ALL" ? "ALL MAKES" : make.toUpperCase()}</button>)}
            </div>
          </div>
          {loading ? <div className="legacy-loading"><span /> Loading cars from the showroom...</div> : filteredVehicles.length ? (
            <div className="vip-car-grid legacy-vehicle-grid">
              {filteredVehicles.map((vehicle, index) => <VehicleCard key={vehicle._id} vehicle={vehicle} index={index} onBook={setBookingVehicle} onEnquire={enquire} />)}
            </div>
          ) : <div className="legacy-empty">{search || category !== "ALL" || selectedMake !== "ALL" ? "No cars match these filters." : "No cars are available at the moment."}<button type="button" onClick={() => { setSearch(""); setCategory("ALL"); setSelectedMake("ALL"); }}>Show all cars</button></div>}
        </div>
      </section>
      <BookingDialog vehicle={bookingVehicle} onClose={() => setBookingVehicle(null)} />
    </>
  );
}

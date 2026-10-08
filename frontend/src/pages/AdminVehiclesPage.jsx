import { ArrowUpRight, CarFront, Edit3, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api.js";
import { formatPrice } from "../lib/format.js";
import { getAdminSession } from "../lib/adminSession.js";

const emptyVehicle = {
  make: "", model: "", year: new Date().getFullYear(), price: "", mileage: "",
  transmission: "Automatic", fuel: "Petrol", bodyStyle: "Sedan", exterior: "",
  description: "", image: "/cars/audi.jpeg", featured: false, status: "available"
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const token = getAdminSession()?.token;

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api("/admin/vehicles", { token });
      setVehicles(result.vehicles);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadVehicles(); }, [loadVehicles]);

  const visible = useMemo(() => vehicles.filter((vehicle) =>
    `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(search.toLowerCase())
  ), [vehicles, search]);

  function openNew() { setEditing({ ...emptyVehicle }); }
  function openEdit(vehicle) { setEditing({ ...vehicle }); }

  async function saveVehicle(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      featured: form.featured === "on"
    };
    setSaving(true);
    try {
      const isEdit = Boolean(editing._id);
      const result = await api(isEdit ? `/admin/vehicles/${editing._id}` : "/admin/vehicles", {
        method: isEdit ? "PUT" : "POST",
        token,
        body: JSON.stringify(payload)
      });
      setVehicles((current) => isEdit
        ? current.map((vehicle) => vehicle._id === result.vehicle._id ? result.vehicle : vehicle)
        : [result.vehicle, ...current]);
      setEditing(null);
      toast.success(isEdit ? "Vehicle details updated." : "Vehicle added to your collection.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeVehicle(vehicle) {
    if (!window.confirm(`Remove ${vehicle.year} ${vehicle.make} ${vehicle.model} from the collection?`)) return;
    try {
      await api(`/admin/vehicles/${vehicle._id}`, { method: "DELETE", token });
      setVehicles((current) => current.filter((item) => item._id !== vehicle._id));
      toast.success("Vehicle removed.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div><span className="eyebrow">CURATED BY YOU</span><h1>Your collection<span className="admin-count">{vehicles.length.toString().padStart(2, "0")}</span></h1><p>Manage the vehicles your guests discover.</p></div>
        <button className="admin-button admin-button-dark" onClick={openNew}><Plus size={17} /> Add a vehicle</button>
      </header>
      <div className="collection-admin-toolbar"><span>{vehicles.filter((vehicle) => vehicle.status === "available").length} AVAILABLE <i /> {vehicles.filter((vehicle) => vehicle.status !== "available").length} OFF MARKET</span><label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a vehicle" /></label></div>
      {loading ? <div className="admin-empty"><span className="loading-orbit" /><p>Loading the collection...</p></div> : visible.length ? <div className="admin-vehicle-grid">{visible.map((vehicle) => <article className="admin-vehicle-card" key={vehicle._id}><div className="admin-vehicle-image"><img src={vehicle.image} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} /><span className={`vehicle-status status-${vehicle.status}`}>{vehicle.status}</span>{vehicle.featured && <span className="vehicle-badge">CURATED PICK</span>}</div><div className="admin-vehicle-content"><span className="eyebrow">{vehicle.year} · {vehicle.make}</span><h3>{vehicle.model}</h3><div className="admin-vehicle-meta"><span>{formatPrice(vehicle.price)}</span><span>{vehicle.mileage.toLocaleString()} km</span></div><div className="admin-vehicle-actions"><button onClick={() => openEdit(vehicle)}><Edit3 size={15} /> Edit details</button><button className="danger-link" onClick={() => removeVehicle(vehicle)} aria-label={`Delete ${vehicle.make} ${vehicle.model}`}><Trash2 size={16} /></button></div></div></article>)}</div> : <div className="admin-empty"><CarFront size={30} /><p>{vehicles.length ? "No vehicles match your search." : "Your collection is waiting."}</p><button className="admin-button admin-button-light" onClick={openNew}><Plus size={16} /> Add your first vehicle</button></div>}
      {editing && <div className="admin-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}><div className="vehicle-modal" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title"><header><div><span className="eyebrow">{editing._id ? "EDIT YOUR COLLECTION" : "A NEW ARRIVAL"}</span><h2 id="vehicle-modal-title">{editing._id ? "Refine the details." : "Add a vehicle."}</h2></div><button className="icon-button" onClick={() => setEditing(null)} aria-label="Close vehicle form"><X size={19} /></button></header>
        <form className="vehicle-edit-form" onSubmit={saveVehicle}>
          <div className="form-row"><label>Make<input name="make" defaultValue={editing.make} maxLength="60" required /></label><label>Model<input name="model" defaultValue={editing.model} maxLength="80" required /></label></div>
          <div className="form-row form-row-three"><label>Year<input name="year" type="number" min="1900" max={new Date().getFullYear() + 2} defaultValue={editing.year} required /></label><label>Price (MYR)<input name="price" type="number" min="0" step="1" defaultValue={editing.price} required /></label><label>Mileage (km)<input name="mileage" type="number" min="0" step="1" defaultValue={editing.mileage} required /></label></div>
          <div className="form-row form-row-three"><label>Transmission<input name="transmission" defaultValue={editing.transmission} maxLength="40" required /></label><label>Fuel<input name="fuel" defaultValue={editing.fuel} maxLength="40" required /></label><label>Body style<input name="bodyStyle" defaultValue={editing.bodyStyle} maxLength="40" required /></label></div>
          <label>Exterior colour<input name="exterior" defaultValue={editing.exterior} maxLength="50" /></label>
          <label>Image path or URL<input name="image" defaultValue={editing.image} placeholder="/cars/audi.jpeg" maxLength="500" required /></label>
          <label>Description<textarea name="description" rows="3" defaultValue={editing.description} minLength="10" maxLength="1500" required /></label>
          <div className="form-row admin-checkboxes"><label>Availability<select name="status" defaultValue={editing.status}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></label><label className="check-control"><input name="featured" type="checkbox" defaultChecked={editing.featured} /> Featured vehicle</label></div>
          <div className="modal-actions"><button type="button" className="admin-button admin-button-light" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="admin-button admin-button-dark" disabled={saving}>{saving ? "Saving..." : <>{editing._id ? "Save changes" : "Add to collection"} <ArrowUpRight size={15} /></>}</button></div>
        </form></div></div>}
    </div>
  );
}

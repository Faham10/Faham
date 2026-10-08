import { ArrowUpRight, Check, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api.js";
import { getAdminSession } from "../lib/adminSession.js";
import { getShowroomBrand } from "../lib/showroomContent.js";

const initialProfile = {
  brand: "AURALUXE MOTORS",
  tagline: "A finer way to find your next drive.",
  description: "",
  location: "",
  phone: "",
  email: "",
  heroImage: "/cars/merceds.jpeg",
  services: []
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = getAdminSession()?.token;

  useEffect(() => {
    api("/portfolio").then(({ profile: result }) => {
      if (result) setProfile({ ...initialProfile, ...result, brand: getShowroomBrand(result.brand) });
    }).catch((error) => toast.error(error.message)).finally(() => setLoading(false));
  }, []);

  function updateField(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateService(index, value) {
    setProfile((current) => ({ ...current, services: current.services.map((service, i) => i === index ? value : service) }));
  }

  function addService() {
    if (profile.services.length >= 12) return toast.error("A maximum of 12 services can be listed.");
    setProfile((current) => ({ ...current, services: [...current.services, ""] }));
  }

  function removeService(index) {
    setProfile((current) => ({ ...current, services: current.services.filter((_, i) => i !== index) }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await api("/admin/profile", {
        method: "PUT",
        token,
        body: JSON.stringify({ ...profile, services: profile.services.map((service) => service.trim()).filter(Boolean) })
      });
      setProfile({ ...initialProfile, ...result.profile });
      toast.success("Showroom details updated.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-page"><div className="admin-empty"><span className="loading-orbit" /><p>Loading showroom details...</p></div></div>;

  return <div className="admin-page">
    <header className="admin-page-header"><div><span className="eyebrow">THE DETAILS THAT DEFINE YOU</span><h1>Showroom details</h1><p>Shape the way your guests see the showroom.</p></div><button className="admin-button admin-button-dark" form="profile-form" type="submit" disabled={saving}><Save size={16} />{saving ? "Saving..." : "Save changes"}</button></header>
    <form id="profile-form" className="profile-edit-layout" onSubmit={saveProfile}>
      <section className="profile-edit-card"><div className="form-section-heading"><span>01</span><div><h2>Your introduction</h2><p>The first things guests learn about your showroom.</p></div></div>
        <label>Showroom name<input name="brand" value={profile.brand} onChange={updateField} maxLength="80" required /></label>
        <label>Tagline<input name="tagline" value={profile.tagline} onChange={updateField} maxLength="160" required /></label>
        <label>About the showroom<textarea name="description" value={profile.description} onChange={updateField} rows="5" minLength="20" maxLength="2000" required /></label>
        <label>Hero image path or URL<input name="heroImage" value={profile.heroImage} onChange={updateField} maxLength="500" required /></label>
      </section>
      <section className="profile-edit-card"><div className="form-section-heading"><span>02</span><div><h2>Come find us</h2><p>How your guests can connect with you.</p></div></div>
        <label>Showroom location<input name="location" value={profile.location} onChange={updateField} maxLength="120" required /></label>
        <div className="form-row"><label>Contact email<input name="email" type="email" value={profile.email} onChange={updateField} maxLength="254" required /></label><label>Phone number<input name="phone" value={profile.phone} onChange={updateField} maxLength="40" required /></label></div>
      </section>
      <section className="profile-edit-card"><div className="form-section-heading"><span>03</span><div><h2>Your services</h2><p>The thoughtful extras that set your showroom apart.</p></div></div>
        <div className="service-editor">{profile.services.map((service, index) => <div className="service-edit-row" key={index}><input aria-label={`Service ${index + 1}`} value={service} onChange={(event) => updateService(index, event.target.value)} maxLength="100" /><button type="button" className="danger-link icon-button" onClick={() => removeService(index)} aria-label={`Remove service ${index + 1}`}><Trash2 size={16} /></button></div>)}</div>
        <button type="button" className="admin-button admin-button-light" onClick={addService}><Plus size={15} /> Add a service</button>
      </section>
      <div className="profile-save-note"><Check size={16} /> Updates appear on the public showroom as soon as they're saved.</div>
    </form>
  </div>;
}

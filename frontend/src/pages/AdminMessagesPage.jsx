import { ArrowUpRight, CalendarDays, Check, ChevronRight, Clock3, Mail, MessageSquareText, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api.js";
import { formatDate, formatMileage, formatPrice } from "../lib/format.js";
import { getAdminSession } from "../lib/adminSession.js";

const defaultReply = `Dear Customer,

Thank you for contacting AURA LUXE MOTORS and for your interest in our vehicles.

We have received your enquiry and appreciate you taking the time to reach out to us. Our team will be happy to assist you with your questions and provide any additional information you may need.

If you are enquiring about a specific vehicle, please feel free to share its name or model so we can assist you more effectively.

Thank you for considering AURA LUXE MOTORS. We look forward to assisting you.

Best regards,
AURA LUXE MOTORS
Customer Support Team`;

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const token = getAdminSession()?.token;

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api("/admin/messages", { token });
      setMessages(result.messages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const visibleMessages = useMemo(() => messages.filter((message) => {
    const matchesFilter = filter === "all" || (filter === "bookings" ? message.type === "booking" : message.status === filter);
    const matchesSearch = `${message.name} ${message.email} ${message.subject} ${message.body} ${message.vehicle?.make ?? ""} ${message.vehicle?.model ?? ""}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [messages, filter, search]);
  const unreadCount = messages.filter((message) => message.status === "new").length;
  const bookingCount = messages.filter((message) => message.type === "booking").length;

  async function updateStatus(message, status) {
    try {
      const result = await api(`/admin/messages/${message._id}`, { method: "PATCH", token, body: JSON.stringify({ status }) });
      setMessages((current) => current.map((item) => item._id === message._id ? result.message : item));
      if (selected?._id === message._id) setSelected(result.message);
      toast.success("Enquiry status updated.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deleteMessage(message) {
    if (!window.confirm(`Delete the enquiry from ${message.name}? This cannot be undone.`)) return;
    try {
      await api(`/admin/messages/${message._id}`, { method: "DELETE", token });
      setMessages((current) => current.filter((item) => item._id !== message._id));
      setSelected(null);
      toast.success("Enquiry deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!selected) return;
    setReplying(true);
    try {
      const result = await api(`/admin/messages/${selected._id}/reply`, { method: "POST", token, body: JSON.stringify({ reply }) });
      setMessages((current) => current.map((item) => item._id === selected._id ? result.enquiry : item));
      setSelected(result.enquiry);
      setReply("");
      toast.success("Reply sent to " + selected.email);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setReplying(false);
    }
  }

  async function openMessage(message) {
    setSelected(message);
    setReply(defaultReply);
    if (message.status === "new") await updateStatus(message, "read");
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div><span className="eyebrow">SHOWROOM INBOX</span><h1>Enquiries<span className="admin-count">{messages.length.toString().padStart(2, "0")}</span></h1><p>Customer questions and vehicle booking requests, together in one place.</p></div>
        <button className="admin-button admin-button-light" onClick={loadMessages}><RefreshCw size={16} /> Refresh</button>
      </header>
      <div className="message-summary"><div><span>ALL REQUESTS</span><strong>{messages.length.toString().padStart(2, "0")}</strong></div><div><span>NEEDS YOUR ATTENTION</span><strong className={unreadCount ? "attention-count" : ""}>{unreadCount.toString().padStart(2, "0")}</strong></div><div><span>BOOKING REQUESTS</span><strong>{bookingCount.toString().padStart(2, "0")}</strong></div><div><span>REPLIED</span><strong>{messages.filter((message) => message.status === "replied").length.toString().padStart(2, "0")}</strong></div></div>
      <div className="inbox-toolbar">
        <div className="inbox-filters">{["all", "new", "read", "replied", "bookings"].map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "all" ? "All" : value === "new" ? "New" : value === "read" ? "Read" : value === "replied" ? "Replied" : "Bookings"}{value === "new" && unreadCount > 0 && <i>{unreadCount}</i>}{value === "bookings" && bookingCount > 0 && <i>{bookingCount}</i>}</button>)}</div>
        <label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search enquiries" /></label>
      </div>
      <section className="inbox-list">
        {loading ? <div className="admin-empty"><span className="loading-orbit" /><p>Loading your enquiries...</p></div> : visibleMessages.length ? visibleMessages.map((message) => <button className={`inbox-row ${message.status === "new" ? "is-new" : ""}`} key={message._id} onClick={() => openMessage(message)}>
          <span className={`inbox-status status-${message.status}`} />
          <span className="inbox-name">{message.name}<small>{message.email}</small></span>
          <span className="inbox-subject">{message.subject}<small>{message.type === "booking" ? `${message.vehicle?.make ?? ""} ${message.vehicle?.model ?? ""} · Preferred ${message.preferredDate || "date not selected"}` : message.body}</small></span>
          <span className="inbox-date">{formatDate(message.createdAt)}</span>
          <ChevronRight size={17} className="inbox-chevron" />
        </button>) : <div className="admin-empty"><MessageSquareText size={28} /><p>{messages.length ? "No enquiries match these filters." : "Nothing in your inbox just yet."}</p><span>New showroom enquiries will appear here.</span></div>}
      </section>

      {selected && <div className="admin-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
        <aside className="message-drawer" role="dialog" aria-modal="true" aria-labelledby="message-title">
          <div className="drawer-header"><span className={`status-pill status-${selected.status}`}>{selected.status}</span><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close enquiry"><X size={19} /></button></div>
          <span className="eyebrow">{selected.type === "booking" ? "VEHICLE BOOKING REQUEST" : "SHOWROOM ENQUIRY"} · {formatDate(selected.createdAt)}</span>
          <h2 id="message-title">{selected.subject}</h2>
          <div className="drawer-sender"><span className="admin-avatar">{selected.name.charAt(0).toUpperCase()}</span><div><strong>{selected.name}</strong><a href={`mailto:${selected.email}`}>{selected.email}</a></div></div>
          {selected.phone && <a className="drawer-phone" href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}>{selected.phone}</a>}
          {selected.type === "booking" && selected.vehicle && <section className="booking-inbox-vehicle">
            {selected.vehicle.image && <img src={selected.vehicle.image} alt={`${selected.vehicle.make} ${selected.vehicle.model}`} />}
            <div className="booking-inbox-vehicle-copy"><span>REQUESTED VEHICLE</span><strong>{selected.vehicle.year ? `${selected.vehicle.year} ` : ""}{selected.vehicle.make} {selected.vehicle.model}</strong><small>{selected.vehicle.price != null ? formatPrice(selected.vehicle.price) : "Price on request"}{selected.vehicle.mileage != null ? ` · ${formatMileage(selected.vehicle.mileage)}` : ""}</small><small>{[selected.vehicle.transmission, selected.vehicle.fuel, selected.vehicle.bodyStyle].filter(Boolean).join(" · ")}</small></div>
            {selected.preferredDate && <div className="booking-inbox-date"><CalendarDays size={15} /><span>Preferred date<strong>{selected.preferredDate}</strong></span></div>}
          </section>}
          <div className="drawer-message">{selected.body}</div>
          {selected.reply && <div className="previous-reply"><span>YOUR REPLY · {formatDate(selected.repliedAt)}</span><p>{selected.reply}</p></div>}
          {selected.status !== "replied" && <form className="reply-form" onSubmit={sendReply}><label htmlFor="reply-body">Write a personal reply</label><textarea id="reply-body" value={reply} onChange={(event) => setReply(event.target.value)} minLength="2" maxLength="3000" rows="6" placeholder="A thoughtful reply goes a long way..." required /><button className="admin-button admin-button-dark" disabled={replying}>{replying ? "Sending..." : <><Mail size={16} /> Send reply</>}</button></form>}
          <div className="drawer-actions">{selected.status !== "new" && selected.status !== "replied" && <button className="admin-link-button" onClick={() => updateStatus(selected, "new")}><Clock3 size={15} /> Mark as new</button>}{selected.status === "replied" && <span className="reply-sent"><Check size={15} /> Replied</span>}<button className="admin-link-button danger-link" onClick={() => deleteMessage(selected)}><Trash2 size={15} /> Delete enquiry</button></div>
        </aside>
      </div>}
    </div>
  );
}

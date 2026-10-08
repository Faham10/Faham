import { ArrowUpRight, CarFront, Inbox, LogOut, Settings2 } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAdminSession } from "../lib/adminSession.js";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const admin = getAdminSession();
  const pageTitle = pathname.endsWith("/vehicles") ? "Collection" : pathname.endsWith("/profile") ? "Showroom details" : "Enquiries";

  function signOut() {
    sessionStorage.removeItem("luxe-admin");
    toast.success("You have been signed out.");
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell auraluxe-admin">
      <aside className="admin-sidebar">
        <Link className="brand-lockup admin-brand" to="/"><span className="brand-mark"><img src="/auraluxe-mark.svg" alt="" /></span><span className="brand-copy"><span>AURALUXE MOTORS</span><small>SHOWROOM CONSOLE</small></span></Link>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" end><Inbox size={18} /> Enquiries</NavLink>
          <NavLink to="/admin/dashboard/vehicles"><CarFront size={18} /> Collection</NavLink>
          <NavLink to="/admin/dashboard/profile"><Settings2 size={18} /> Showroom details</NavLink>
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user"><span className="admin-avatar">A</span><span><strong>Showroom admin</strong><small>{admin?.email}</small></span></div>
          <button onClick={signOut}><LogOut size={17} /> Sign out</button>
          <Link to="/"><ArrowUpRight size={15} /> Back to website</Link>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div><span>AURALUXE MOTORS <i /> ADMIN CONSOLE</span><strong>{pageTitle}</strong></div>
          <div className="admin-topbar-actions">
            <span className="admin-topbar-email">{admin?.email}</span>
            <Link to="/" aria-label="Open public showroom">View showroom <ArrowUpRight size={14} /></Link>
            <button type="button" onClick={signOut}><LogOut size={15} /><span>Sign out</span></button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

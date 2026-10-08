import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api.js";
import { getAdminSession } from "../lib/adminSession.js";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (getAdminSession()) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    setLoading(true);
    try {
      const result = await api("/auth/login", { method: "POST", body: JSON.stringify(form) });
      sessionStorage.setItem("luxe-admin", JSON.stringify({ token: result.token, email: result.admin.email }));
      toast.success("Welcome back to the showroom.");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen auraluxe-admin-login">
      <div className="login-art">
        <div className="login-art-backdrop" />
        <Link className="login-back" to="/"><ArrowLeft size={16} /> Back to showroom</Link>
        <div className="login-art-copy"><span className="eyebrow">AURALUXE MOTORS</span><h1>Everything<br />in its <em>place.</em></h1><p>Your showroom, your collection, your way.</p></div>
        <span className="login-art-caption">THE SHOWROOM CONSOLE · EST. 2024</span>
      </div>
      <div className="login-panel">
        <div className="login-card">
          <span className="login-lock"><LockKeyhole size={20} /></span>
          <span className="eyebrow">SHOWROOM ACCESS</span>
          <h2>Welcome back.</h2>
          <p>Sign in to manage your collection and enquiries.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email address<input name="email" type="email" autoComplete="username" placeholder="you@auraluxe.com" required /></label>
            <label>Password<span className="password-wrap"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
            <button className="button button-gold login-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : <>Sign in securely <ArrowUpRight size={17} /></>}</button>
          </form>
          <span className="login-secure"><LockKeyhole size={13} /> Secure, administrator-only access</span>
        </div>
      </div>
    </div>
  );
}

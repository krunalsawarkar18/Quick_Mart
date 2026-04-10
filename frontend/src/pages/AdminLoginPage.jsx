import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/admin/products";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminLogin(form);
      navigate(from);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="gradient-border relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1f6fff_52%,#38bdf8_100%)] p-6 text-white sm:p-8">
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
            Admin sign in
          </div>
          <h1 className="display-font mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Access the inventory dashboard</h1>
          <p className="mt-4 text-sm leading-7 text-slate-100 sm:text-base">
            Admin accounts can manage products, edit product details, remove old items, and control store content from
            one dedicated panel.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <ShieldCheck className="text-brand-orange" />
              <div className="mt-3 text-lg font-bold">Admin-only access</div>
              <p className="mt-2 text-sm leading-6 text-slate-100">
                Customer accounts are blocked from this route, so product tools stay restricted to admins.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <LockKeyhole className="text-brand-orange" />
              <div className="mt-3 text-lg font-bold">Secure entry flow</div>
              <p className="mt-2 text-sm leading-6 text-slate-100">
                Sign in here and land directly in the admin area where add, edit, and delete actions are available.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="soft-card p-6 sm:p-8">
        <div className="pill">Admin panel</div>
        <h2 className="section-title mt-3">Sign in as admin</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use your admin email and password to open the product management workspace.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="email"
            placeholder="Admin email address"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Open admin dashboard"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/admin/register" className="font-semibold text-brand-green">
            Create admin account
          </Link>
          <Link to="/admin-access" className="font-semibold text-brand-orange">
            Back to admin access
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;

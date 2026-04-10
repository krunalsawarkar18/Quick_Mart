import { KeyRound, UserPlus2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const { adminRegister } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", adminKey: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminRegister(form);
      navigate("/admin/products");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="gradient-border relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1f6fff_48%,#60a5fa_100%)] p-6 text-white sm:p-8">
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
            Create admin account
          </div>
          <h1 className="display-font mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Set up a new admin login</h1>
          <p className="mt-4 text-sm leading-7 text-slate-100 sm:text-base">
            This form creates an admin user that can open the control room and manage product add, edit, and remove
            actions.
          </p>
          <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
              <KeyRound size={16} />
              Admin signup key
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-100">
              Admin registration uses the backend `ADMIN_SIGNUP_KEY`. Add that key to your backend environment before
              using this screen in production or local setup.
            </p>
          </div>
        </div>
      </div>

      <div className="soft-card p-6 sm:p-8">
        <div className="pill">Secure onboarding</div>
        <h2 className="section-title mt-3">Create admin account</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          After creating the account, you will be signed in and redirected to the admin product management page.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-field"
            placeholder="Full name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
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
            placeholder="Phone number"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="input-field pl-11"
              placeholder="Admin signup key"
              value={form.adminKey}
              onChange={(event) => setForm({ ...form, adminKey: event.target.value })}
              required
            />
          </div>
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          <button className="button-secondary w-full" disabled={loading}>
            <UserPlus2 size={16} className="mr-2" />
            {loading ? "Creating admin account..." : "Create admin account"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/admin/login" className="font-semibold text-brand-green">
            Already have admin login
          </Link>
          <Link to="/admin-access" className="font-semibold text-brand-orange">
            Back to admin access
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminRegisterPage;

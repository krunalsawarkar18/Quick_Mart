import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg soft-card overflow-hidden p-8">
      <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(31,111,255,0.12),rgba(255,107,87,0.08))] p-5">
        <span className="pill">Create account</span>
        <h1 className="section-title mt-3">Join Quick Market</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create your account to save addresses and place orders faster.</p>
      </div>
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
          placeholder="Email address"
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
        {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Already a member?{" "}
        <Link to="/login" className="font-bold text-brand-orange">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-sm text-slate-600">
        Looking for admin tools?{" "}
        <Link to="/admin-access" className="font-bold text-brand-green">
          Go to admin access
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;

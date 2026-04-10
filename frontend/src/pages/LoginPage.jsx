import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(from);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg soft-card overflow-hidden p-8">
      <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(31,111,255,0.12),rgba(255,107,87,0.08))] p-5">
        <span className="pill">Welcome back</span>
        <h1 className="section-title mt-3">Sign in to Quick Market</h1>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        New here?{" "}
        <Link to="/register" className="font-bold text-brand-orange">
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-sm text-slate-600">
        Need inventory access?{" "}
        <Link to="/admin-access" className="font-bold text-brand-green">
          Open the admin portal
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;

import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateProfile(form);
      setMessage("Profile updated successfully.");
      setForm((current) => ({ ...current, password: "" }));
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section className="mx-auto max-w-2xl panel p-8">
      <span className="pill">Account</span>
      <h1 className="section-title mt-3">Profile settings</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <input className="input-field bg-slate-50" value={user?.email || ""} disabled />
        <input
          className="input-field"
          placeholder="Phone number"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />
        <input
          className="input-field"
          type="password"
          placeholder="New password (optional)"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
        <button className="button-primary">Save changes</button>
      </form>
    </section>
  );
};

export default ProfilePage;


import { useEffect, useState } from "react";

const emptyAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false
};

const AddressForm = ({ initialValue, onSubmit, onCancel, submitLabel = "Save address" }) => {
  const [form, setForm] = useState(emptyAddress);

  useEffect(() => {
    setForm(initialValue || emptyAddress);
  }, [initialValue]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      <input className="input-field" name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} required />
      <input className="input-field" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <input className="input-field sm:col-span-2" name="street" placeholder="Street address" value={form.street} onChange={handleChange} required />
      <input className="input-field" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
      <input className="input-field" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
      <input className="input-field" name="postalCode" placeholder="Postal code" value={form.postalCode} onChange={handleChange} required />
      <input className="input-field" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
      <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-200/90 px-4 py-3 text-sm font-semibold text-slate-700">
        <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} />
        Set as default address
      </label>
      <div className="sm:col-span-2 flex flex-wrap gap-3">
        <button type="submit" className="button-primary">
          {submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="button-muted" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default AddressForm;

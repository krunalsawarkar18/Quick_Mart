import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import AddressForm from "../components/AddressForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AddressesPage = () => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadAddresses = async () => {
    const data = await apiRequest("/addresses", {}, token);
    setAddresses(data);
  };

  useEffect(() => {
    loadAddresses().catch(console.error);
  }, []);

  const createAddress = async (payload) => {
    await apiRequest(
      "/addresses",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
    setShowForm(false);
    await loadAddresses();
  };

  const updateAddress = async (payload) => {
    await apiRequest(
      `/addresses/${editingAddress._id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload)
      },
      token
    );
    setEditingAddress(null);
    await loadAddresses();
  };

  const deleteAddress = async (id) => {
    await apiRequest(
      `/addresses/${id}`,
      {
        method: "DELETE"
      },
      token
    );
    await loadAddresses();
  };

  return (
    <section className="space-y-6">
      <div className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="pill">Addresses</span>
            <h1 className="section-title mt-3">Saved delivery addresses</h1>
          </div>
          <button className="button-primary" onClick={() => setShowForm((current) => !current)}>
            {showForm ? "Hide form" : "Add address"}
          </button>
        </div>
        {showForm ? (
          <div className="mt-6">
            <AddressForm onSubmit={createAddress} submitLabel="Save address" />
          </div>
        ) : null}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <div key={address._id} className="panel p-5">
            {editingAddress?._id === address._id ? (
              <AddressForm
                initialValue={editingAddress}
                onSubmit={updateAddress}
                onCancel={() => setEditingAddress(null)}
                submitLabel="Update address"
              />
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      {address.fullName} {address.isDefault ? <span className="text-brand-orange">(Default)</span> : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{address.phone}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="button-muted" onClick={() => setEditingAddress(address)}>
                    Edit
                  </button>
                  <button className="button-muted" onClick={() => deleteAddress(address._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AddressesPage;


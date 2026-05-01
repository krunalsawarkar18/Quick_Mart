import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import AddressForm from "../components/AddressForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../utils/format.js";
import { calculateDeliveryFee } from "../utils/delivery.js";
import { loadDeliverySettings, readCachedDeliverySettings } from "../utils/deliverySettingsCache.js";

const CheckoutPage = () => {
  const { token } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [addressNotice, setAddressNotice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [deliverySettings, setDeliverySettings] = useState(() => readCachedDeliverySettings());
  const handledSessionRef = useRef("");

  const loadAddresses = async () => {
    const data = await apiRequest("/addresses", {}, token);
    setAddresses(data);
    const defaultAddress = data.find((item) => item.isDefault) || data[0];
    setSelectedAddressId(defaultAddress?._id || "");
  };

  useEffect(() => {
    loadAddresses().catch(console.error);
  }, []);

  useEffect(() => {
    loadDeliverySettings()
      .then(setDeliverySettings)
      .catch(() => setDeliverySettings(readCachedDeliverySettings()));
  }, []);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (payment === "cancelled") {
      setMessage("Stripe payment was cancelled. You can try again or place a Cash on Delivery order.");
      const next = new URLSearchParams(searchParams);
      next.delete("payment");
      setSearchParams(next, { replace: true });
      return;
    }

    if (payment !== "success" || !sessionId || handledSessionRef.current === sessionId) {
      return;
    }

    handledSessionRef.current = sessionId;
    setSubmitting(true);
    setMessage("");

    apiRequest(
      "/orders/stripe/confirm-session",
      {
        method: "POST",
        body: JSON.stringify({ sessionId })
      },
      token
    )
      .then(async (order) => {
        await clearCart();
        navigate("/account/orders", {
          replace: true,
          state: {
            successMessage: `Order ${order.orderNumber} paid successfully with Stripe.`
          }
        });
      })
      .catch((error) => {
        setMessage(error.message);
      })
      .finally(() => {
        setSubmitting(false);
        const next = new URLSearchParams(searchParams);
        next.delete("payment");
        next.delete("session_id");
        setSearchParams(next, { replace: true });
      });
  }, [clearCart, navigate, searchParams, setSearchParams, token]);

  useEffect(() => {
    if (!addressNotice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setAddressNotice(""), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [addressNotice]);

  const saveAddress = async (payload) => {
    await apiRequest(
      "/addresses",
      {
        method: "POST",
        body: JSON.stringify(payload)
      },
      token
    );
    setShowAddressForm(false);
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

    if (selectedAddressId === id) {
      setSelectedAddressId("");
    }

    if (editingAddress?._id === id) {
      setEditingAddress(null);
    }

    await loadAddresses();
  };

  const placeOrder = async () => {
    if (!selectedAddressId) {
      setAddressNotice("Enter address first to continue.");
      setShowAddressForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      if (paymentMethod === "Stripe") {
        const session = await apiRequest(
          "/orders/stripe/checkout-session",
          {
            method: "POST",
            body: JSON.stringify({ addressId: selectedAddressId })
          },
          token
        );

        window.location.href = session.url;
        return;
      }

      const order = await apiRequest(
        "/orders",
        {
          method: "POST",
          body: JSON.stringify({ addressId: selectedAddressId, paymentMethod })
        },
        token
      );
      await clearCart();
      navigate("/account/orders", {
        state: {
          successMessage: `Order ${order.orderNumber} placed successfully.`
        }
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deliveryFee = calculateDeliveryFee(subtotal, items.length, deliverySettings);

  return (
    <section className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_360px]">
      {addressNotice ? (
        <div className="fixed left-4 right-4 top-20 z-50 rounded-2xl border border-brand-orange/25 bg-rose-100 px-4 py-3 text-sm font-semibold text-brand-orange shadow-[0_18px_40px_rgba(15,23,42,0.14)] sm:left-auto sm:right-4 sm:top-24 sm:max-w-xs">
          {addressNotice}
        </div>
      ) : null}
      <div className="space-y-6">
        <div>
          <span className="pill">Checkout</span>
          <h1 className="section-title mt-3">Finish your Quick Market order</h1>
        </div>
        <div className="panel p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h2 className="text-xl font-extrabold text-slate-900">Delivery address</h2>
            <button className="button-muted" onClick={() => setShowAddressForm((current) => !current)}>
              {showAddressForm ? "Hide form" : "Add new address"}
            </button>
          </div>
          {showAddressForm ? (
            <div className="mt-5">
              <AddressForm
                onSubmit={saveAddress}
                onCancel={() => setShowAddressForm(false)}
                submitLabel="Save and use address"
              />
            </div>
          ) : null}
          <div className="mt-5 grid gap-4">
            {addresses.map((address) => (
              <div key={address._id} className="rounded-3xl border border-slate-300 bg-slate-200/90 p-4">
                {editingAddress?._id === address._id ? (
                  <AddressForm
                    initialValue={editingAddress}
                    onSubmit={updateAddress}
                    onCancel={() => setEditingAddress(null)}
                    submitLabel="Update address"
                  />
                ) : (
                  <>
                    <label className="flex gap-3 sm:gap-4">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address._id}
                        onChange={() => setSelectedAddressId(address._id)}
                      />
                      <div className="text-sm text-slate-600">
                        <div className="font-bold text-slate-900">
                          {address.fullName}{" "}
                          {address.isDefault ? <span className="text-brand-orange">(Default)</span> : null}
                        </div>
                        <div>{address.phone}</div>
                        <div>
                          {address.street}, {address.city}, {address.state} {address.postalCode}
                        </div>
                      </div>
                    </label>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                      <button className="button-muted" onClick={() => setEditingAddress(address)}>
                        Edit
                      </button>
                      <button className="button-muted" onClick={() => deleteAddress(address._id)}>
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {!addresses.length ? <div className="text-sm text-slate-500">Add an address to continue.</div> : null}
          </div>
        </div>
        {message ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</div> : null}
      </div>
      <aside className="panel h-fit p-4 sm:p-6 lg:sticky lg:top-28">
        <h2 className="text-xl font-extrabold text-slate-900">Payment summary</h2>
        <div className="mt-4 space-y-3">
          <div className="text-sm font-semibold text-slate-700">Choose payment method</div>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-200/90 px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={() => setPaymentMethod("Cash on Delivery")}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-200/90 px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "Stripe"}
              onChange={() => setPaymentMethod("Stripe")}
            />
            Pay with Stripe
          </label>
        </div>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{deliveryFee ? formatCurrency(deliveryFee) : "Free"}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal + deliveryFee)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Free delivery unlocks automatically on orders above {formatCurrency(deliverySettings.freeDeliveryThreshold)}.
        </p>
        <button
          className="button-primary mt-6 w-full"
          onClick={placeOrder}
          disabled={!items.length || submitting}
        >
          {submitting ? "Processing..." : paymentMethod === "Stripe" ? "Continue to Stripe" : "Place order"}
        </button>
      </aside>
    </section>
  );
};

export default CheckoutPage;

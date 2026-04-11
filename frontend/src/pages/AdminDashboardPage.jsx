import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatDateTime } from "../utils/format.js";
import { getOrderStatusMeta } from "../utils/orderStatus.js";

const emptyDeliveryForm = {
  charge: "40",
  freeDeliveryThreshold: "799"
};

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState(emptyDeliveryForm);
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState("");

  const loadDashboard = useCallback(async (syncForm = false) => {
    const data = await apiRequest("/admin/dashboard", {}, token);
    setStats(data);

    if (syncForm) {
      setDeliveryForm({
        charge: String(data.deliverySettings?.charge ?? 40),
        freeDeliveryThreshold: String(data.deliverySettings?.freeDeliveryThreshold ?? 799)
      });
    }
  }, [token]);

  useEffect(() => {
    loadDashboard(true).catch(console.error);

    const intervalId = window.setInterval(() => {
      loadDashboard(false).catch(console.error);
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard(false).catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadDashboard]);

  if (!stats) {
    return <div className="text-center text-slate-600">Loading dashboard...</div>;
  }

  const saveDeliverySettings = async (event) => {
    event.preventDefault();
    setSavingDelivery(true);
    setDeliveryMessage("");

    try {
      const nextSettings = await apiRequest(
        "/admin/delivery-settings",
        {
          method: "PATCH",
          body: JSON.stringify({
            charge: Number(deliveryForm.charge),
            freeDeliveryThreshold: Number(deliveryForm.freeDeliveryThreshold)
          })
        },
        token
      );

      setStats((current) => ({ ...current, deliverySettings: nextSettings }));
      setDeliveryForm({
        charge: String(nextSettings.charge),
        freeDeliveryThreshold: String(nextSettings.freeDeliveryThreshold)
      });
      setDeliveryMessage("Delivery settings updated successfully.");
    } catch (error) {
      setDeliveryMessage(error.message);
    } finally {
      setSavingDelivery(false);
    }
  };

  const cards = [
    { label: "Products", value: stats.products },
    { label: "Categories", value: stats.categories },
    { label: "Orders", value: stats.orders },
    { label: "Customers", value: stats.customers },
    { label: "Revenue", value: formatCurrency(stats.revenue) }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="panel p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</div>
            <div className="mt-3 text-3xl font-black text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.05fr]">
        <Link to="/admin/products" className="soft-card p-6 transition hover:-translate-y-0.5 hover:border-brand-orange">
          <div className="pill">Inventory</div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Manage products</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add new products, edit pricing and stock, or remove products from the storefront.
          </p>
        </Link>
        <Link to="/admin/categories" className="soft-card p-6 transition hover:-translate-y-0.5 hover:border-brand-green">
          <div className="pill">Catalog structure</div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Add product categories</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create more categories for products, edit category details, or remove unused categories.
          </p>
        </Link>
        <div className="soft-card p-6">
          <div className="pill">Admin only</div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Delivery settings</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage the delivery charge and free-delivery threshold used across customer cart and checkout totals.
          </p>
          <form className="mt-5 grid gap-4" onSubmit={saveDeliverySettings}>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Delivery charge</span>
              <input
                className="input-field"
                type="number"
                min="0"
                value={deliveryForm.charge}
                onChange={(event) => setDeliveryForm((current) => ({ ...current, charge: event.target.value }))}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Free delivery above</span>
              <input
                className="input-field"
                type="number"
                min="0"
                value={deliveryForm.freeDeliveryThreshold}
                onChange={(event) =>
                  setDeliveryForm((current) => ({ ...current, freeDeliveryThreshold: event.target.value }))
                }
              />
            </label>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              Current rule: charge {formatCurrency(Number(deliveryForm.charge || 0))}, free above{" "}
              {formatCurrency(Number(deliveryForm.freeDeliveryThreshold || 0))}
            </div>
            {deliveryMessage ? (
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{deliveryMessage}</div>
            ) : null}
            <button className="button-primary w-full" type="submit" disabled={savingDelivery}>
              {savingDelivery ? "Saving..." : "Save delivery settings"}
            </button>
          </form>
        </div>
      </div>

      <div className="soft-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="pill">Recent activity</div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Latest customer orders</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              See recent order details right from the admin home screen.
            </p>
          </div>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-green transition hover:text-brand-orange">
            Open full orders view
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          {stats.recentOrders?.length ? (
            stats.recentOrders.map((order) => {
              const statusMeta = getOrderStatusMeta(order.status);

              return (
                <div key={order._id} className="rounded-[28px] border border-slate-200 bg-white/80 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">{order.orderNumber}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {`${order.user?.name || order.address?.fullName || "Customer"} · ${order.user?.email || "No email"} · ${formatDateTime(order.createdAt)}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusMeta.badgeClass}`}>
                        {order.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                        {order.paymentMethod}
                      </span>
                      <span className="text-lg font-black text-brand-green">{formatCurrency(order.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Order details</div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {order.items.map((item, index) => (
                          <div key={`${order._id}-${index}`} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold text-slate-400">
                                Item
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-bold text-slate-900">{item.name}</div>
                              <div className="mt-1 text-xs text-slate-500">Qty: {item.quantity}</div>
                              <div className="mt-1 text-sm font-semibold text-brand-green">{formatCurrency(item.price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Customer delivery</div>
                      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                        <div className="font-bold text-slate-900">{order.address?.fullName || order.user?.name || "Customer"}</div>
                        <div>{order.address?.phone || order.user?.phone || "No phone added"}</div>
                        <div>
                          {[
                            order.address?.street,
                            order.address?.city,
                            order.address?.state,
                            order.address?.postalCode,
                            order.address?.country
                          ]
                            .filter(Boolean)
                            .join(", ") || "No address details available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-slate-600">
              No recent customer orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";
import { ORDER_STATUS_STEPS, getOrderStatusIndex, getOrderStatusMeta } from "../utils/orderStatus.js";

const statuses = ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

const AdminOrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  const loadOrders = async () => {
    const data = await apiRequest("/admin/orders", {}, token);
    setOrders(data);
  };

  useEffect(() => {
    loadOrders().catch(console.error);
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingOrderId(id);

    try {
      const updatedOrder = await apiRequest(
        `/admin/orders/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status })
        },
        token
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                ...updatedOrder,
                user: order.user,
                address: updatedOrder.address || order.address,
                items: updatedOrder.items || order.items
              }
            : order
        )
      );
    } finally {
      setUpdatingOrderId("");
    }
  };

  return (
    <div className="grid gap-4">
      {orders.length ? (
        orders.map((order) => {
          const statusMeta = getOrderStatusMeta(order.status);
          const currentStepIndex = getOrderStatusIndex(order.status);

          return (
            <article key={order._id} className="panel p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">{order.orderNumber}</div>
                    <div className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Customer</div>
                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        <div className="font-bold text-slate-900">{order.user?.name || order.address?.fullName || "Customer"}</div>
                        <div>{order.user?.email || "No email available"}</div>
                        <div>{order.user?.phone || order.address?.phone || "No phone added"}</div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Delivery</div>
                      <div className="mt-3 text-sm leading-6 text-slate-600">
                        <div className="font-bold text-slate-900">{order.address?.fullName || order.user?.name || "Delivery address"}</div>
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
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-brand-orange">
                    {order.paymentMethod}
                  </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    order.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.paymentStatus === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {order.paymentStatus}
                </span>
                <span className={`rounded-full border-2 border-white/80 px-3 py-1 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${statusMeta.badgeClass}`}>
                  {order.status}
                </span>
                <div className="text-lg font-black text-brand-green">{formatCurrency(order.totalPrice)}</div>
                <select
                  className={`input-field min-w-52 border-2 font-semibold ${
                    updatingOrderId === order._id ? "cursor-wait border-brand-orange/50 bg-orange-50/70" : "border-brand-green/20"
                  }`}
                  value={order.status}
                  onChange={(event) => updateStatus(order._id, event.target.value)}
                  disabled={updatingOrderId === order._id}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-5 rounded-3xl border border-slate-200 bg-white/80 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Delivery status</div>
                    <div className="mt-2 text-lg font-bold text-slate-900">{statusMeta.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{statusMeta.description}</div>
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${statusMeta.badgeClass}`}>
                    {updatingOrderId === order._id ? "Updating status..." : `Current stage: ${order.status}`}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const isCompleted = currentStepIndex >= index;
                    const isCurrent = order.status === step;

                    return (
                      <span
                        key={`${order._id}-${step}`}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isCurrent
                            ? `${statusMeta.badgeClass} ring-2 ring-offset-2 ring-brand-orange/35`
                            : isCompleted
                              ? "bg-slate-900 text-white"
                              : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {step}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {order.items.map((item, index) => {
                  const productPath = item.product ? `/products/${item.product}` : null;

                  const itemCard = (
                    <div className="flex h-full gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 transition hover:border-brand-orange/35 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold text-slate-400">
                          Item
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold text-slate-900">{item.name}</div>
                        <div className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</div>
                        <div className="mt-1 text-sm text-slate-500">Unit price: {formatCurrency(item.price)}</div>
                        <div className="mt-2 font-semibold text-brand-green">
                          Line total: {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  );

                  return productPath ? (
                    <Link key={`${order._id}-${item.product}-${index}`} to={productPath}>
                      {itemCard}
                    </Link>
                  ) : (
                    <div key={`${order._id}-${index}`}>{itemCard}</div>
                  );
                })}
              </div>
            </article>
          );
        })
      ) : (
        <div className="panel p-8 text-center text-slate-600">No customer orders yet.</div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";
import { ORDER_STATUS_STEPS, getOrderStatusIndex, getOrderStatusMeta } from "../utils/orderStatus.js";

const OrdersPage = () => {
  const { token } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(() => {
    apiRequest("/orders", {}, token).then(setOrders).catch(console.error);
  }, [token]);

  useEffect(() => {
    loadOrders();

    const intervalId = window.setInterval(loadOrders, 10000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadOrders();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadOrders]);

  return (
    <section className="space-y-6">
      <div>
        <span className="pill">Orders</span>
        <h1 className="section-title mt-3">Track your Quick Market purchases</h1>
      </div>
      {location.state?.successMessage ? (
        <div className="rounded-2xl bg-blue-100 px-4 py-3 text-sm text-blue-800">{location.state.successMessage}</div>
      ) : null}
      <div className="grid gap-4">
        {orders.length ? (
          orders.map((order) => {
            const statusMeta = getOrderStatusMeta(order.status);
            const currentStepIndex = getOrderStatusIndex(order.status);

            return (
              <article key={order._id} className="panel p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">{order.orderNumber}</div>
                    <div className="text-sm text-slate-500">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusMeta.badgeClass}`}>{order.status}</span>
                    <span className="text-lg font-black text-brand-green">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-3xl border border-slate-200 bg-white/80 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Delivery status</div>
                      <div className="mt-2 text-lg font-bold text-slate-900">{statusMeta.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{statusMeta.description}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                      Payment: {order.paymentMethod}
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
                              ? statusMeta.badgeClass
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
                <div className="mt-4 text-sm text-slate-600">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {order.items.map((item, index) => {
                      const productPath = item.product ? `/products/${item.product}` : null;

                      const content = (
                        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white/80 p-3 transition hover:border-brand-orange/35 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold text-slate-400">
                              Item
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-bold text-slate-900">{item.name}</div>
                            <div className="mt-1 text-xs text-slate-500">Qty: {item.quantity}</div>
                            <div className="mt-1 font-semibold text-brand-green">{formatCurrency(item.price)}</div>
                          </div>
                        </div>
                      );

                      return productPath ? (
                        <Link key={`${order._id}-${item.product}-${index}`} to={productPath}>
                          {content}
                        </Link>
                      ) : (
                        <div key={`${order._id}-${index}`}>{content}</div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="panel p-8 text-center text-slate-600">No orders yet. Place your first Quick Market order.</div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;

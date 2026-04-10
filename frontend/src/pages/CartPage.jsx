import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency, formatProductQuantity } from "../utils/format.js";

const CartPage = () => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const deliveryFee = items.length ? (subtotal > 799 ? 0 : 40) : 0;

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div>
          <span className="pill">Cart</span>
          <h1 className="section-title mt-3">Review your quick picks</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Adjust quantities, review your total, and move to checkout with a cleaner cart summary.
          </p>
        </div>
        {items.length ? (
          items.map((item) => (
            <article key={item.productId} className="soft-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
              <img src={item.imageUrl} alt={item.name} className="h-28 w-full rounded-[22px] object-cover sm:w-32" />
              <div className="min-w-0 flex-1">
                <Link to={`/products/${item.slug}`} className="text-lg font-extrabold tracking-tight text-slate-900">
                  {item.name}
                </Link>
                <div className="mt-2 text-sm font-semibold text-brand-green">
                  {formatCurrency(item.discountPrice || item.price)}
                </div>
              </div>
              <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:flex-nowrap sm:justify-start">
                <div className="flex items-center rounded-full border border-slate-300 bg-slate-200/90 p-1 shadow-[0_10px_20px_rgba(15,23,42,0.06)]">
                  <button
                    className="rounded-full p-2 transition hover:bg-slate-300/70"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-[3.5rem] px-1 text-center font-bold">{formatProductQuantity(item, item.quantity)}</span>
                  <button
                    className="rounded-full p-2 transition hover:bg-slate-300/70"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button className="button-muted w-full px-3 py-2 sm:w-auto" onClick={() => removeFromCart(item.productId)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="soft-card p-8 text-center">
            <p className="text-slate-600">Your cart is empty right now.</p>
            <Link to="/products" className="button-primary mt-4">
              Start shopping
            </Link>
          </div>
        )}
      </div>
      <aside className="soft-card h-fit p-6 lg:sticky lg:top-28">
        <div className="inline-flex rounded-full bg-brand-green px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white">
          Summary
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">Order summary</h2>
        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
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
        <p className="mt-4 text-sm leading-6 text-slate-500">Free delivery unlocks automatically on orders above Rs. 799.</p>
        <Link
          to="/checkout"
          className={`mt-6 flex w-full justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
            items.length ? "bg-brand-orange text-white" : "cursor-not-allowed bg-slate-200 text-slate-500"
          }`}
        >
          Continue to checkout
        </Link>
      </aside>
    </section>
  );
};

export default CartPage;

import { ShoppingBasket, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency, getDiscount, getProductPrice } from "../utils/format.js";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = getDiscount(product.price, product.discountPrice);

  return (
    <article className="group gradient-border soft-card">
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-40 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2">
          <span className="pill bg-brand-mint text-brand-green">{product.category?.name || "Quick Pick"}</span>
          {discount ? (
            <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
              {discount}% off
            </span>
          ) : null}
        </div>
      </Link>
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 sm:text-sm">
            <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" /> {product.rating || 4.5}
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:px-3 sm:text-xs sm:tracking-[0.16em]">
            {product.stock > 0 ? "In stock" : "Limited"}
          </span>
        </div>
        <div>
          <Link to={`/products/${product.slug}`} className="text-base font-extrabold tracking-tight text-slate-900 sm:text-xl">
            {product.name}
          </Link>
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600 sm:mt-2 sm:min-h-[72px] sm:text-sm sm:leading-6">
            {product.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-lg font-extrabold text-brand-green sm:text-xl">{formatCurrency(getProductPrice(product))}</div>
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through sm:text-sm">{formatCurrency(product.price)}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-brand-orange sm:text-xs">Today&apos;s saving</span>
              </div>
            ) : null}
          </div>
          <button className="button-primary w-full gap-2 px-3 py-2 text-xs sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm" onClick={() => addToCart(product, 1)}>
            <ShoppingBasket size={14} className="sm:h-4 sm:w-4" /> Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

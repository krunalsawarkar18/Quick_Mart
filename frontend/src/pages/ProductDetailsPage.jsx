import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency, formatProductQuantity, getProductPrice, getSavingsAmount } from "../utils/format.js";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    apiRequest(`/products/${slug}`)
      .then((data) => {
        setProduct(data);
        setQuantity(1);
      })
      .catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (!product?.category?._id) {
      setSimilarProducts([]);
      return;
    }

    apiRequest(`/products?category=${product.category._id}`)
      .then((products) => {
        setSimilarProducts(products.filter((item) => item._id !== product._id).slice(0, 4));
      })
      .catch(console.error);
  }, [product]);

  if (!product) {
    return <div className="text-center text-slate-600">Loading product...</div>;
  }

  const savingsAmount = getSavingsAmount(product.price, product.discountPrice);
  const isAdmin = user?.role === "admin";
  const buyNow = async () => {
    await addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <section className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-start">
        <div className="gradient-border soft-card mx-auto w-full max-w-[560px] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full max-h-[280px] w-full object-cover sm:max-h-[360px] lg:max-h-[430px]"
          />
        </div>
        <div className="space-y-6">
          <div className="soft-card p-5 sm:p-6 md:p-8">
            <span className="pill">{product.category?.name}</span>
            <h1 className="display-font mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <div className="rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-700">Fresh arrival</div>
              <div className="rounded-full bg-rose-50 px-4 py-2 font-semibold text-brand-orange">
                Stock: {product.stock || 99} available
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <div className="text-3xl font-black text-brand-green">{formatCurrency(getProductPrice(product))}</div>
              {product.discountPrice ? (
                <>
                  <div className="text-lg text-slate-400 line-through">{formatCurrency(product.price)}</div>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                    Save {formatCurrency(savingsAmount)} today
                  </span>
                </>
              ) : null}
            </div>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <div className="flex items-center rounded-full border border-slate-300 bg-slate-200/90 p-1 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <button
                  className="rounded-full p-2 text-slate-700 transition hover:bg-slate-300/70"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[4.5rem] px-1 text-center font-bold">{formatProductQuantity(product, quantity)}</span>
                <button
                  className="rounded-full p-2 text-slate-700 transition hover:bg-slate-300/70"
                  onClick={() => setQuantity((current) => Math.min(product.stock || 99, current + 1))}
                >
                  <Plus size={16} />
                </button>
              </div>
              {isAdmin ? (
                <Link to="/admin/orders" className="button-muted w-full justify-center sm:w-auto">
                  View customer orders
                </Link>
              ) : (
                <>
                  <button className="button-primary w-full sm:w-auto" onClick={() => addToCart(product, quantity)}>
                    Add to cart
                  </button>
                  <button className="button-secondary w-full sm:w-auto" onClick={buyNow}>
                    Buy now
                  </button>
                  <Link to="/cart" className="button-muted w-full sm:w-auto">
                    View cart
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="soft-card p-5">
              <Truck className="text-brand-orange" />
              <div className="mt-3 font-bold text-slate-900">Fast dispatch</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Reliable packing and smooth doorstep delivery across supported areas.
              </p>
            </div>
            <div className="soft-card p-5">
              <ShieldCheck className="text-brand-orange" />
              <div className="mt-3 font-bold text-slate-900">Checkout confidence</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Cash on Delivery checkout with saved addresses and order history.
              </p>
            </div>
          </div>
        </div>
      </div>
      {similarProducts.length ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="pill">More like this</span>
              <h2 className="section-title mt-3">Similar products you might like</h2>
            </div>
            <Link
              to={`/products?category=${product.category?._id}`}
              className="text-sm font-semibold text-brand-green transition hover:text-brand-orange"
            >
              View all in {product.category?.name}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {similarProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductDetailsPage;

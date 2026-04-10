import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { apiRequest } from "../api/client.js";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([apiRequest("/products?featured=true"), apiRequest("/categories")])
      .then(([products, categoryList]) => {
        setFeaturedProducts(products);
        setCategories(categoryList);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          className="gradient-border relative overflow-hidden rounded-[32px] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-8 lg:p-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.56) 45%, rgba(15, 23, 42, 0.28) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur sm:px-4 sm:text-xs sm:tracking-[0.28em]">
              Fresh produce every day
            </span>
            <h1 className="display-font mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Fresh fruits and vegetables, ready when you are.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">
              Shop crisp produce, pantry staples, and daily essentials through a cleaner, faster Quick Market
              experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/products${search ? `?q=${encodeURIComponent(search)}` : ""}`}
                className="button-primary w-full sm:w-auto"
              >
                Shop now <ArrowRight size={16} className="ml-2" />
              </Link>
              <input
                className="w-full rounded-full border border-white/30 bg-white/15 px-5 py-3 text-white outline-none placeholder:text-slate-200 sm:max-w-sm"
                placeholder="Search quick picks"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5 text-sm">
              <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm sm:block">
                Same-day essentials
              </div>
              <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm sm:block">
                Curated seasonal picks
              </div>
              <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm sm:block">
                Fast COD checkout
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                <div className="text-2xl font-black">{categories.length || "4+"}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/70">Curated aisles</div>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm">
                <div className="text-2xl font-black">{featuredProducts.length || "8+"}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/70">Featured picks</div>
              </div>
              <div className="col-span-2 rounded-3xl border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-sm sm:col-span-1">
                <div className="text-2xl font-black">COD</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/70">Ready checkout</div>
              </div>
            </div>
            <div className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <Truck className="text-brand-orange" />
                <div className="mt-3 font-bold">Fast local delivery</div>
                <p className="mt-1 text-sm text-slate-100">Built for same-day essentials and weekly restocks.</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <ShieldCheck className="text-brand-orange" />
                <div className="mt-3 font-bold">Secure account flow</div>
                <p className="mt-1 text-sm text-slate-100">JWT-authenticated customer and admin areas.</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <Sparkles className="text-brand-orange" />
                <div className="mt-3 font-bold">Elegant checkout</div>
                <p className="mt-1 text-sm text-slate-100">Address book, order review, and COD-first checkout.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="soft-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="pill">Popular aisles</div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Browse by category</h2>
              </div>
              <div className="rounded-2xl bg-[linear-gradient(135deg,#1f6fff_0%,#60a5fa_100%)] px-4 py-3 text-center text-white">
                <div className="text-2xl font-black">{categories.length}</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-blue-100">Aisles</div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="flex items-center justify-between rounded-[22px] border border-slate-300 bg-slate-200/90 px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-brand-orange hover:bg-slate-300/75 hover:text-brand-orange sm:py-4"
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-mint/80 font-bold text-brand-green">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {category.name}
                  </span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
          <div className="soft-card p-5 sm:p-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
              Why shop here
            </div>
            <h2 className="display-font mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Smarter grocery shopping in a few taps
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Fresh essentials, quick browsing, and a cleaner checkout flow designed to help customers move from
              discovery to order faster.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 px-4 py-4">
                <div className="text-2xl font-black text-brand-green">{categories.length || "10+"}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Categories</div>
              </div>
              <div className="rounded-2xl bg-rose-50 px-4 py-4">
                <div className="text-2xl font-black text-brand-orange">{featuredProducts.length || "20+"}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Featured picks</div>
              </div>
              <div className="col-span-2 rounded-2xl bg-sky-50 px-4 py-4 sm:col-span-1">
                <div className="text-2xl font-black text-slate-900">Fast</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Checkout flow</div>
              </div>
            </div>
            <Link to="/products" className="button-secondary mt-6 w-full">
              Explore the catalog <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="pill">Featured collection</span>
            <h2 className="section-title mt-3">Fresh drops and pantry staples</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              A curated mix of produce, household essentials, and quick-pick grocery items that feel right at home in
              a modern storefront.
            </p>
          </div>
          <Link to="/products" className="button-muted">
            View all products
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

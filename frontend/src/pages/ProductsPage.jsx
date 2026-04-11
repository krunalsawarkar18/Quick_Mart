import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const updateCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("category", value);
    } else {
      next.delete("category");
    }
    setSearchParams(next);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiRequest(`/products?${new URLSearchParams({ q: search, category }).toString()}`),
      apiRequest("/categories")
    ])
      .then(([productList, categoryList]) => {
        setProducts(productList);
        setCategories(categoryList);
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <section className="space-y-6">
      <div className="soft-card overflow-hidden p-4 sm:p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="pill">Catalog</span>
            <h1 className="section-title mt-3">Shop everything at Quick Market</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Discover fresh produce, pantry goods, and daily essentials with cleaner filters and a more focused
              browsing experience.
            </p>
          </div>
          <div className="grid gap-3 rounded-[26px] bg-[linear-gradient(135deg,#1f6fff_0%,#0f172a_100%)] p-4 text-white sm:grid-cols-3 sm:p-5">
            <div>
              <div className="text-2xl font-black">{products.length}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/60">Products</div>
            </div>
            <div>
              <div className="text-2xl font-black">{categories.length}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/60">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-black">{search || category ? "Filtered" : "All"}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/60">View</div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="input-field pl-16"
              placeholder="Search products"
              value={search}
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value) {
                  next.set("q", event.target.value);
                } else {
                  next.delete("q");
                }
                setSearchParams(next);
              }}
            />
          </div>
          <select
            className="input-field"
            value={category}
            onChange={(event) => updateCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !category ? "bg-brand-green text-white" : "bg-slate-200/90 text-slate-700 hover:text-brand-orange"
            }`}
            onClick={() => updateCategory("")}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item._id}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item._id ? "bg-brand-green text-white" : "bg-slate-200/90 text-slate-700 hover:text-brand-orange"
              }`}
              onClick={() => updateCategory(item._id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-center text-slate-600">Loading products...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.length ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="panel col-span-full p-8 text-center text-slate-600">No products matched your search.</div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;

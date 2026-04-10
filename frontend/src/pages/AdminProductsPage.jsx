import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency } from "../utils/format.js";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  imageUrl: "",
  category: "",
  featured: false
};

const AdminProductsPage = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const loadData = async () => {
    const [productList, categoryList] = await Promise.all([
      apiRequest("/admin/products", {}, token),
      apiRequest("/admin/categories", {}, token)
    ]);
    setProducts(productList);
    setCategories(categoryList);
  };

  useEffect(() => {
    loadData().catch(console.error);
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const path = editingId ? `/admin/products/${editingId}` : "/admin/products";

    await apiRequest(
      path,
      {
        method,
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          discountPrice: Number(form.discountPrice || 0),
          stock: Number(form.stock || 0)
        })
      },
      token
    );

    setEditingId("");
    setForm(emptyForm);
    await loadData();
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: product.category?._id || "",
      featured: product.featured
    });
  };

  const deleteProduct = async (id) => {
    await apiRequest(
      `/admin/products/${id}`,
      {
        method: "DELETE"
      },
      token
    );
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div className="soft-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="pill">Product management</div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Add, edit, and remove products</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Need a new grouping first? Admins can also create more product categories from the categories section.
          </p>
        </div>
        <Link to="/admin/categories" className="button-secondary">
          Add or manage categories
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form className="panel h-fit space-y-4 p-6" onSubmit={handleSubmit}>
        <h2 className="text-xl font-extrabold text-slate-900">{editingId ? "Edit product" : "Add product"}</h2>
        <input className="input-field" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <textarea className="input-field min-h-28" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input className="input-field" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input-field" name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input className="input-field" name="discountPrice" type="number" placeholder="Discount price" value={form.discountPrice} onChange={handleChange} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input-field" name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <select className="input-field" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Mark as featured
        </label>
        <div className="flex gap-3">
          <button className="button-primary">{editingId ? "Update" : "Create"}</button>
          {editingId ? (
            <button
              type="button"
              className="button-muted"
              onClick={() => {
                setEditingId("");
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      <div className="grid gap-4">
        {products.map((product) => (
          <article key={product._id} className="panel flex flex-col gap-4 p-5 lg:flex-row">
            <img src={product.imageUrl} alt={product.name} className="h-28 w-full rounded-2xl object-cover lg:w-32" />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">{product.category?.name}</div>
                </div>
                <div className="text-lg font-black text-brand-green">{formatCurrency(product.discountPrice || product.price)}</div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{product.description}</p>
              <div className="mt-4 flex gap-3">
                <button className="button-muted" onClick={() => startEdit(product)}>
                  Edit
                </button>
                <button className="button-muted" onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;

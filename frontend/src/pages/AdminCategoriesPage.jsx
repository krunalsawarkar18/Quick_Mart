import { useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyForm = {
  name: "",
  description: ""
};

const AdminCategoriesPage = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const loadCategories = async () => {
    const data = await apiRequest("/admin/categories", {}, token);
    setCategories(data);
  };

  useEffect(() => {
    loadCategories().catch(console.error);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const path = editingId ? `/admin/categories/${editingId}` : "/admin/categories";

    await apiRequest(
      path,
      {
        method,
        body: JSON.stringify(form)
      },
      token
    );

    setForm(emptyForm);
    setEditingId("");
    await loadCategories();
  };

  const deleteCategory = async (id) => {
    await apiRequest(
      `/admin/categories/${id}`,
      {
        method: "DELETE"
      },
      token
    );
    await loadCategories();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form className="panel h-fit space-y-4 p-6" onSubmit={handleSubmit}>
        <h2 className="text-xl font-extrabold text-slate-900">{editingId ? "Edit category" : "Add category"}</h2>
        <input
          className="input-field"
          placeholder="Category name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <textarea
          className="input-field min-h-28"
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
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
        {categories.map((category) => (
          <article key={category._id} className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold text-slate-900">{category.name}</div>
                <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  className="button-muted"
                  onClick={() => {
                    setEditingId(category._id);
                    setForm({ name: category.name, description: category.description || "" });
                  }}
                >
                  Edit
                </button>
                <button className="button-muted" onClick={() => deleteCategory(category._id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;


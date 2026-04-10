import { NavLink, Outlet } from "react-router-dom";

const tabClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand-green text-white shadow-[0_14px_30px_rgba(31,111,255,0.22)]"
      : "border border-slate-300 bg-slate-200/90 text-slate-700 hover:border-brand-orange hover:text-brand-orange"
  }`;

const AdminShell = () => (
  <section className="space-y-6">
    <div className="soft-card p-6">
      <span className="pill">Quick Market control room</span>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title">Admin dashboard</h1>
          <p className="mt-2 max-w-2xl leading-6 text-slate-600">
            Manage products, categories, and orders from one backend-powered workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NavLink end to="/admin" className={tabClass}>
            Overview
          </NavLink>
          <NavLink to="/admin/products" className={tabClass}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={tabClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={tabClass}>
            Orders
          </NavLink>
        </div>
      </div>
    </div>
    <Outlet />
  </section>
);

export default AdminShell;

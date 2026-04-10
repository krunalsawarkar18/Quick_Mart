import { ArrowRight, PackagePlus, ShieldCheck, UserPlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const accessCards = [
  {
    title: "Add products",
    text: "Create new inventory items with category, pricing, stock, image, and featured controls."
  },
  {
    title: "Edit products",
    text: "Update product details anytime to keep your storefront accurate and current."
  },
  {
    title: "Remove products",
    text: "Delete outdated items quickly from the admin inventory workspace."
  }
];

const AdminAccessPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="gradient-border relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1f6fff_55%,#38bdf8_100%)] p-6 text-white sm:p-8 lg:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/85">
            Admin panel access
          </div>
          <h1 className="display-font mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Manage products from a separate admin workspace
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">
            Sign in as an admin or create an admin account to open the inventory dashboard and manage add, edit, and
            remove product actions from one place.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {accessCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-lg font-bold">{card.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-100">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="soft-card p-6 sm:p-8">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
          Choose your path
        </div>
        <h2 className="display-font mt-4 text-3xl font-semibold text-slate-900">Enter the admin panel</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use a dedicated admin account to access product management, category management, and order operations.
        </p>

        <div className="mt-6 grid gap-4">
          <Link to={isAdmin ? "/admin/products" : "/admin/login"} className="soft-card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand-orange">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <ShieldCheck size={22} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-extrabold text-slate-900">{isAdmin ? "Open dashboard" : "Admin sign in"}</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {isAdmin
                  ? "You are already signed in as an admin. Jump straight to product management."
                  : "Use your admin credentials to open the dashboard and manage store inventory."}
              </p>
            </div>
            <ArrowRight className="mt-1 text-slate-400" size={18} />
          </Link>

          <Link to="/admin/register" className="soft-card flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand-green">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white">
              <UserPlus2 size={22} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-extrabold text-slate-900">Create admin account</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Register a new admin with the secure signup key, then head directly into the admin inventory workspace.
              </p>
            </div>
            <ArrowRight className="mt-1 text-slate-400" size={18} />
          </Link>
        </div>

        <div className="mt-6 rounded-[26px] bg-[linear-gradient(135deg,#0f172a_0%,#182848_100%)] p-5 text-white">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
            <PackagePlus size={16} />
            Inventory tools
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
            <li>Add new product entries with pricing and stock.</li>
            <li>Edit existing product content without leaving the admin area.</li>
            <li>Remove products that should no longer appear in the store.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminAccessPage;

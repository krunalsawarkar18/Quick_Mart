import { ArrowRight, ShieldCheck, UserPlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminAccessPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <section className="mx-auto max-w-3xl">
      <div className="soft-card p-6 sm:p-8">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
          Choose your path
        </div>
        <h1 className="display-font mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Enter the admin panel</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Open the admin workspace to manage products, categories, and customer orders.
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
                  ? "You are already signed in as an admin. Jump straight to the dashboard."
                  : "Use your admin credentials to open the dashboard and manage store operations."}
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
                Register a new admin account with the secure signup key and continue into the admin workspace.
              </p>
            </div>
            <ArrowRight className="mt-1 text-slate-400" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminAccessPage;

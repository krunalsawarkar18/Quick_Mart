import { House, LayoutDashboard, Leaf, LogOut, MapPin, ShoppingBag, ShoppingCart, UserCircle2 } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const navClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-[13px] font-semibold transition sm:px-4 sm:text-sm ${
    isActive
      ? "bg-brand-green text-white shadow-[0_14px_30px_rgba(31,111,255,0.2)]"
      : "text-slate-700 hover:bg-slate-300/80 hover:text-slate-900"
  }`;

const mobileNavClass = ({ isActive }) =>
  `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
    isActive ? "bg-brand-green text-white" : "text-slate-600"
  }`;

const AppShell = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const showCartNav = user?.role !== "admin";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_65%)]" />
      <header className="fixed inset-x-0 top-0 z-40 py-3 sm:py-4">
        <div className="container-shell">
          <div className="glass-strip rounded-[28px] px-3 py-3 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:px-4 sm:py-4">
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Link to="/" className="flex items-center gap-2.5 self-start sm:gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green via-blue-500 to-sky-400 text-white shadow-[0_16px_30px_rgba(31,111,255,0.28)] sm:h-12 sm:w-12">
                  <Leaf size={18} className="sm:h-[22px] sm:w-[22px]" />
                </div>
                <div>
                  <div className="display-font text-lg font-semibold text-slate-900 sm:text-2xl">Quick Market</div>
                  <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs sm:tracking-[0.32em]">
                    Fresh delivered fast
                  </div>
                </div>
              </Link>

              <div className="sm:hidden">
                {user ? (
                  <button className="button-muted px-3 py-2" onClick={logout}>
                    <LogOut size={16} />
                  </button>
                ) : (
                  <NavLink to="/login" className="button-primary px-4 py-2 text-[13px]">
                    Sign in
                  </NavLink>
                )}
              </div>

              <nav className="no-scrollbar hidden w-full items-center gap-1.5 overflow-x-auto rounded-full bg-slate-300/65 p-1.5 shadow-[inset_0_1px_0_rgba(191,219,254,0.5)] sm:flex lg:w-auto lg:flex-wrap lg:justify-end">
                <NavLink to="/" className={navClass}>
                  Home
                </NavLink>
                <NavLink to="/products" className={navClass}>
                  Shop
                </NavLink>
                {showCartNav ? (
                  <NavLink to="/cart" className={navClass}>
                    <span className="inline-flex items-center gap-2">
                      <ShoppingCart size={16} />
                      Cart
                      <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs font-bold text-white">{itemCount}</span>
                    </span>
                  </NavLink>
                ) : null}
                {user ? (
                  <>
                    <NavLink to="/account/orders" className={navClass}>
                      Orders
                    </NavLink>
                    {user.role === "admin" ? (
                      <NavLink to="/admin" className={navClass}>
                        Admin
                      </NavLink>
                    ) : null}
                    <button className="button-muted shrink-0" onClick={logout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink to="/login" className="button-primary shrink-0">
                    Sign in
                  </NavLink>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
      <main className="container-shell relative pb-6 pt-28 sm:pb-8 sm:pt-32 mobile-safe-bottom">
        <Outlet />
      </main>
      <footer className="mt-12 pb-8">
        <div className="container-shell">
          <div className="soft-card overflow-hidden p-6 sm:p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green via-blue-500 to-sky-400 text-white">
                    <Leaf size={22} />
                  </div>
                  <div>
                    <div className="display-font text-2xl font-semibold text-slate-900">Quick Market</div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Fresh delivered fast</div>
                  </div>
                </div>
                <p className="max-w-md text-sm leading-6 text-slate-600">
                  Grocery, pantry, and bakery essentials with a polished storefront, modern account flows, and
                  admin-ready operations.
                </p>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="font-bold uppercase tracking-[0.2em] text-slate-900">Customer</div>
                <Link to="/products" className="flex items-center gap-2 transition hover:text-brand-orange">
                  <ShoppingBag size={16} /> Browse products
                </Link>
                <Link to="/account/addresses" className="flex items-center gap-2 transition hover:text-brand-orange">
                  <MapPin size={16} /> Manage addresses
                </Link>
                <Link to="/account/profile" className="flex items-center gap-2 transition hover:text-brand-orange">
                  <UserCircle2 size={16} /> Profile settings
                </Link>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="font-bold uppercase tracking-[0.2em] text-slate-900">Operations</div>
                <p>Cash on Delivery checkout for v1 and admin-ready order management.</p>
                <Link to="/admin/auth" className="flex items-center gap-2 font-semibold text-brand-orange transition hover:text-brand-ember">
                  <LayoutDashboard size={16} /> Admin access portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[24px] border border-slate-300/80 bg-slate-200/95 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-1">
          <NavLink to="/" className={mobileNavClass}>
            <House size={18} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/products" className={mobileNavClass}>
            <ShoppingBag size={18} />
            <span>Shop</span>
          </NavLink>
          {showCartNav ? (
            <NavLink to="/cart" className={mobileNavClass}>
              <div className="relative">
                <ShoppingCart size={18} />
                {itemCount ? (
                  <span className="absolute -right-2 -top-2 rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </div>
              <span>Cart</span>
            </NavLink>
          ) : null}
          {user ? (
            user.role === "admin" ? (
              <NavLink to="/admin" className={mobileNavClass}>
                <LayoutDashboard size={18} />
                <span>Admin</span>
              </NavLink>
            ) : (
              <NavLink to="/account/orders" className={mobileNavClass}>
                <UserCircle2 size={18} />
                <span>Orders</span>
              </NavLink>
            )
          ) : (
            <NavLink to="/login" className={mobileNavClass}>
              <UserCircle2 size={18} />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;

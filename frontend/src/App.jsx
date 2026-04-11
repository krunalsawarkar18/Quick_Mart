import { Route, Routes } from "react-router-dom";
import AddressesPage from "./pages/AddressesPage.jsx";
import AdminAccessPage from "./pages/AdminAccessPage.jsx";
import AdminCategoriesPage from "./pages/AdminCategoriesPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminRegisterPage from "./pages/AdminRegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminShell from "./components/layout/AdminShell.jsx";
import AppShell from "./components/layout/AppShell.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<AppShell />}>
      <Route index element={<HomePage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="products/:slug" element={<ProductDetailsPage />} />
      <Route
        path="cart"
        element={
          <ProtectedRoute disallowAdmin adminRedirectTo="/admin">
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route path="admin-access" element={<AdminAccessPage />} />
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin/register" element={<AdminRegisterPage />} />
      <Route
        path="checkout"
        element={
          <ProtectedRoute disallowAdmin adminRedirectTo="/admin">
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route
        path="account/profile"
        element={
          <ProtectedRoute disallowAdmin adminRedirectTo="/admin">
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="account/addresses"
        element={
          <ProtectedRoute disallowAdmin adminRedirectTo="/admin">
            <AddressesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="account/orders"
        element={
          <ProtectedRoute disallowAdmin adminRedirectTo="/admin/orders">
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="container-shell py-16 text-center text-slate-600">Loading your account...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/admin-access" replace />;
  }

  return children;
};

export default ProtectedRoute;

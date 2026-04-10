import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "quick-market-auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(saved);
    setToken(parsed.token);
    setUser(parsed.user);

    apiRequest("/auth/me", {}, parsed.token)
      .then((data) => {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: parsed.token, user: data.user }));
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken("");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveAuth = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const authenticate = async (path, payload, { requireAdmin = false } = {}) => {
    const data = await apiRequest(path, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (requireAdmin && data.user?.role !== "admin") {
      throw new Error("This account does not have admin access");
    }

    saveAuth(data);
    return data;
  };

  const login = (credentials) => authenticate("/auth/login", credentials);

  const register = (payload) => authenticate("/auth/register", payload);

  const adminLogin = (credentials) => authenticate("/auth/login", credentials, { requireAdmin: true });

  const adminRegister = (payload) => authenticate("/auth/admin/register", payload, { requireAdmin: true });

  const updateProfile = async (payload) => {
    const data = await apiRequest(
      "/auth/me",
      {
        method: "PUT",
        body: JSON.stringify(payload)
      },
      token
    );

    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: data.user }));
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("quick-market-logout"));
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        adminLogin,
        adminRegister,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/client.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);
const STORAGE_KEY = "quick-market-cart";

const normalizeGuestItem = (product, quantity) => ({
  productId: product._id,
  name: product.name,
  slug: product.slug,
  imageUrl: product.imageUrl,
  price: product.price,
  discountPrice: product.discountPrice,
  stock: product.stock,
  categoryName: product.category?.name || product.categoryName || "",
  quantity
});

const normalizeServerCart = (cart) =>
  (cart?.items || []).map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    slug: item.product.slug,
    imageUrl: item.product.imageUrl,
    price: item.product.price,
    discountPrice: item.product.discountPrice,
    stock: item.product.stock,
    categoryName: item.product.category?.name || "",
    quantity: item.quantity
  }));

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return;
    }

    const syncCart = async () => {
      setLoading(true);
      try {
        const guestItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        if (guestItems.length) {
          for (const item of guestItems) {
            await apiRequest(
              "/cart/items",
              {
                method: "POST",
                body: JSON.stringify({
                  productId: item.productId,
                  quantity: item.quantity
                })
              },
              token
            );
          }
          localStorage.removeItem(STORAGE_KEY);
        }

        const cart = await apiRequest("/cart", {}, token);
        setItems(normalizeServerCart(cart));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("quick-market-logout", handleLogout);
    return () => window.removeEventListener("quick-market-logout", handleLogout);
  }, []);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      const cart = await apiRequest(
        "/cart/items",
        {
          method: "POST",
          body: JSON.stringify({
            productId: product._id,
            quantity
          })
        },
        token
      );

      setItems(normalizeServerCart(cart));
      return;
    }

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.productId === product._id);

      if (existing) {
        return currentItems.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      }

      return [...currentItems, normalizeGuestItem(product, quantity)];
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      const cart = await apiRequest(
        `/cart/items/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({ quantity })
        },
        token
      );

      setItems(normalizeServerCart(cart));
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      const cart = await apiRequest(
        `/cart/items/${productId}`,
        {
          method: "DELETE"
        },
        token
      );

      setItems(normalizeServerCart(cart));
      return;
    }

    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await apiRequest(
        "/cart/clear",
        {
          method: "DELETE"
        },
        token
      );
    }

    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

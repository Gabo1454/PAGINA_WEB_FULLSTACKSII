// src/context/Provider.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  qty: number;
  name?: string;
  price?: number;
  image?: string;
  stock?: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (productId: string, qty?: number) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // --- Función para sincronizar el carrito con el backend ---
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data: { items: CartItem[]; total: number } = await res.json();
      setCartItems(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error("Error al obtener carrito", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- Acciones del carrito ---
  const addToCart = async (productId: string, qty = 1) => {
    setLoading(true);
    try {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });
      await fetchCart(); // refresca el estado
    } catch (err) {
      console.error("Error al agregar al carrito", err);
    } finally {
      setLoading(false);
    }
  };

  const setQty = async (productId: string, qty: number) => {
    setLoading(true);
    try {
      await fetch("/api/cart/set-qty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });
      await fetchCart();
    } catch (err) {
      console.error("Error al actualizar cantidad", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    try {
      await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      await fetchCart();
    } catch (err) {
      console.error("Error al eliminar del carrito", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await fetch("/api/cart/clear", { method: "DELETE" });
      await fetchCart();
    } catch (err) {
      console.error("Error al vaciar carrito", err);
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    total,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

// src/context/CartContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products as productsRepo } from "../lib/db"; // para calcular totales

export type CartItem = { productId: string; qty: number };

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const KEY_CART = "cart_ctx_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY_CART) || "[]");
    } catch {
      return [];
    }
  });

  const persist = (next: CartItem[]) => {
    setCartItems(next);
    localStorage.setItem(KEY_CART, JSON.stringify(next));
  };

  const addToCart = (productId: string, qty = 1) => {
    persist(
      cartItems.some((i) => i.productId === productId)
        ? cartItems.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + qty } : i
          )
        : [...cartItems, { productId, qty }]
    );
  };

  const setQty = (productId: string, qty: number) => {
    const safe = Math.max(0, Math.floor(qty));
    persist(
      cartItems
        .map((i) => (i.productId === productId ? { ...i, qty: safe } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (productId: string) =>
    persist(cartItems.filter((i) => i.productId !== productId));
  const clearCart = () => persist([]);

  // calcula total cruzando con la BD (precio garantizado number)
  const total = useMemo(() => {
    const all = productsRepo.all();
    return cartItems.reduce((acc, it) => {
      const p = all.find((pp) => pp.id === it.productId);
      const price = p?.price ?? 0;
      return acc + price * it.qty;
    }, 0);
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    total,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

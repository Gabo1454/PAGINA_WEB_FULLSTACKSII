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

function safeParseCart(raw: string | null): CartItem[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    // Aseguramos que productId sea string y qty número entero >=1
    return parsed.map((it) => ({
      productId: String(it.productId ?? ""),
      qty: Math.max(0, Math.floor(Number(it.qty ?? 0))),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return safeParseCart(localStorage.getItem(KEY_CART));
  });

  const persist = (next: CartItem[]) => {
    // normalizamos antes de guardar
    const normalized = next.map((it) => ({
      productId: String(it.productId),
      qty: Math.max(0, Math.floor(it.qty)),
    }));
    setCartItems(normalized);
    localStorage.setItem(KEY_CART, JSON.stringify(normalized));
  };

  const addToCart = (productId: string, qty = 1) => {
    const idStr = String(productId);
    persist(
      cartItems.some((i) => i.productId === idStr)
        ? cartItems.map((i) =>
            i.productId === idStr ? { ...i, qty: i.qty + qty } : i
          )
        : [...cartItems, { productId: idStr, qty }]
    );
  };

  const setQty = (productId: string, qty: number) => {
    const safe = Math.max(0, Math.floor(qty));
    const idStr = String(productId);
    persist(
      cartItems
        .map((i) => (i.productId === idStr ? { ...i, qty: safe } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (productId: string) =>
    persist(cartItems.filter((i) => i.productId !== String(productId)));
  const clearCart = () => persist([]);

  // calcula total cruzando con la BD (precio garantizado number)
  const total = useMemo(() => {
    const all = productsRepo.all();
    return cartItems.reduce((acc, it) => {
      // normalizamos ambos lados a string para evitar problemas de tipo
      const p = all.find((pp) => String(pp.id) === String(it.productId));
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

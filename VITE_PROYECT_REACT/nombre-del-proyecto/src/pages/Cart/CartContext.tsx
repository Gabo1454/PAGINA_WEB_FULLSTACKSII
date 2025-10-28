import { createContext, useContext, useState, type ReactNode } from "react";
// 1️⃣ Define el tipo de producto
type Product = {
  id: number;
  name: string;
  price?: number;
};

// 2️⃣ Define el tipo del contexto
type CartContextType = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
};

// 3️⃣ Crea el contexto con tipo
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4️⃣ Crea el proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 5️⃣ Hook para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}

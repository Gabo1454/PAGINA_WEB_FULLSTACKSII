// src/context/CartContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

// Importa las funciones del servicio, asumiendo que doLogout es accesible o que
// el logout de useAuth llama a doLogout del servicio.
import { authHeader } from "../services/auth";

// --- Tipos (Sin Cambios) ---

export type CartItem = {
  productId: string;
  qty: number;
  name?: string;
  price?: number;
};

type Cart = {
  items: CartItem[];
  total: number;
};

type CartContextType = {
  cart: Cart;
  loading: boolean;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reload: () => Promise<void>;
};

const KEY_CART = "cart_ctx_v1";
const API_BASE = "http://localhost:8080/api"; // Usa el puerto correcto de Spring Boot (8080)

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Función Auxiliar para Manejar Errores de Auth ---
// Función para verificar si el error es de autenticación/autorización
const checkAuthError = async (
  res: Response,
  logout: () => void
): Promise<void> => {
  if (res.status === 401 || res.status === 403) {
    console.error(
      `[AUTH ERROR] Petición rechazada con ${res.status}. El token es inválido o expiró.`
    );
    // Forzar el logout y limpiar el token local
    logout();
    // Lanza un error para detener el flujo de la petición
    throw new Error(`Authentication failed with status: ${res.status}`);
  }
  if (!res.ok) {
    throw new Error(`Server returned error: ${res.status} ${res.statusText}`);
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth(); // <-- Obtenemos la función logout
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  const computeTotal = (items: CartItem[]): number =>
    items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0); // ... loadGuest y persistGuest (Sin Cambios) ...

  const loadGuest = () => {
    try {
      const raw = localStorage.getItem(KEY_CART) || "[]";
      const items: CartItem[] = JSON.parse(raw);
      setCart({ items, total: computeTotal(items) });
    } catch {
      setCart({ items: [], total: 0 });
    }
  };

  const persistGuest = (items: CartItem[]) => {
    localStorage.setItem(KEY_CART, JSON.stringify(items));
    setCart({ items, total: computeTotal(items) });
  }; // -------------------------------------------------- // Cargar carrito del servidor (MODIFICADA)
  const loadFromServer = async () => {
    setLoading(true);
    try {
      const headers = authHeader();
      const res = await fetch(`${API_BASE}/cart`, { headers });

      // 🚨 Nuevo: Manejo de 401/403
      await checkAuthError(res, logout);

      const data = await res.json();
      const serverItems: CartItem[] = (data.items ?? []) as CartItem[];
      setCart({
        items: serverItems,
        total: data.total ?? computeTotal(serverItems),
      });
    } catch (e) {
      console.warn("loadFromServer failed", e); // Si falló por cualquier otra razón, carga el carrito de invitado
      loadGuest();
    } finally {
      setLoading(false);
    }
  }; // Fusionar carrito de invitado al servidor (MODIFICADA)

  const mergeGuestToServer = async (guestItems: CartItem[]) => {
    if (!guestItems.length) return;
    try {
      // 🔥 CORRECCIÓN: Iterar y llamar a addToCart para cada item de invitado.
      for (const item of guestItems) {
        // Usamos la función ya existente para enviar cada item al servidor
        // Nota: Llamar a addToCart repetidamente puede ser menos eficiente (N+1)
        // que un solo merge, pero funciona con el Backend actual.
        await addToCart(item.productId, item.qty);
      }

      // 2. Limpiar el almacenamiento local
      localStorage.removeItem(KEY_CART);

      // 3. Recargar el carrito final desde el servidor
      await loadFromServer();
    } catch (e) {
      console.warn("mergeGuestToServer failed", e);
    }
  };

  useEffect(() => {
    (async () => {
      const storageUserRaw = localStorage.getItem("levelup-auth");
      const storageUser = storageUserRaw ? JSON.parse(storageUserRaw) : null;
      const tokenExistsInStorage = !!(storageUser && storageUser.token);

      if (isAuthenticated || tokenExistsInStorage) {
        const raw = localStorage.getItem(KEY_CART) || "[]";
        const guestItems: CartItem[] = JSON.parse(raw) || [];
        if (guestItems.length) await mergeGuestToServer(guestItems);
        else await loadFromServer();
      } else {
        loadGuest();
      }
    })();
    // Agregué 'logout' a las dependencias por seguridad, aunque su valor no cambia.
  }, [isAuthenticated, user?.id, logout]); // Agregar producto al carrito (MODIFICADA y CORREGIDA la conversión de ID)

  const addToCart = async (productId: string, qty = 1) => {
    if (isAuthenticated) {
      const headers = { "Content-Type": "application/json", ...authHeader() };
      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productId: Number(productId), quantity: qty }), // <-- Corrección de tipo
      });

      // 🚨 Nuevo: Manejo de 401/403
      await checkAuthError(res, logout);

      const data = await res.json();
      const items: CartItem[] = (data.items ?? []) as CartItem[];
      setCart({ items, total: data.total ?? computeTotal(items) });
    } else {
      // ... lógica de carrito de invitado (sin cambios)
      const raw = localStorage.getItem(KEY_CART) || "[]";
      const items: CartItem[] = JSON.parse(raw) || [];
      const idx = items.findIndex((i) => i.productId === productId);
      if (idx >= 0) items[idx].qty += qty;
      else items.push({ productId, qty });
      persistGuest(items);
    }
  }; // Quitar producto del carrito (MODIFICADA)

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      const headers = { ...authHeader() };
      const res = await fetch(`${API_BASE}/cart/remove/${productId}`, {
        method: "DELETE",
        headers,
      });

      // 🚨 Nuevo: Manejo de 401/403
      await checkAuthError(res, logout);

      const data = await res.json();
      const items: CartItem[] = (data.items ?? []) as CartItem[];
      setCart({ items, total: data.total ?? computeTotal(items) });
    } else {
      // ... lógica de carrito de invitado (sin cambios)
      const raw = localStorage.getItem(KEY_CART) || "[]";
      const items: CartItem[] = (JSON.parse(raw) as CartItem[]).filter(
        (i) => i.productId !== productId
      );
      persistGuest(items);
    }
  }; // Vaciar carrito (MODIFICADA)

  const clearCart = async () => {
    if (isAuthenticated) {
      const headers = { ...authHeader() };
      const res = await fetch(`${API_BASE}/cart/clear`, {
        method: "DELETE",
        headers,
      });

      // 🚨 Nuevo: Manejo de 401/403
      await checkAuthError(res, logout);

      await loadFromServer();
    } else {
      // ... lógica de carrito de invitado (sin cambios)
      localStorage.removeItem(KEY_CART);
      setCart({ items: [], total: 0 });
    }
  }; // Recargar carrito (Sin Cambios)

  const reload = async () => {
    if (isAuthenticated) await loadFromServer();
    else loadGuest();
  };

  const value = useMemo(
    () => ({ cart, loading, addToCart, removeFromCart, clearCart, reload }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

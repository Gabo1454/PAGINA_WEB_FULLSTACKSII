// src/context/ProductsContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import { fetchProducts } from "../services/products";
// 🎯 Importamos Product y CartItem (asumiendo que CartItem ahora tiene price y name)
import type { Product, CartItem } from "../types/products";

// --- TIPOS ---

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  selectedCategories: string[];
  maxPrice: number;
  initialMaxPrice: number;
  cart: CartItem[]; // Estado del carrito
}

// 🎯 TIPOS DE ACCIONES DEL CARRO
type CartAction =
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string } // payload es el productId
  | {
      type: "UPDATE_CART_QUANTITY";
      payload: { productId: string; quantity: number };
    };

type ProductStoreAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_CATEGORY_FILTER"; payload: string }
  | { type: "SET_MAX_PRICE_FILTER"; payload: number }
  | { type: "SET_CATEGORIES"; payload: string[] } // TIPOS DE ACCIÓN DEL CARRITO INCLUIDOS
  | CartAction;

// --- ESTADO INICIAL ---

const initialStoreState: ProductStoreState = {
  products: [],
  isLoading: true,
  selectedCategories: [],
  initialMaxPrice: 0,
  maxPrice: 0,
  cart: [],
};

// --- REDUCER (Se mantiene la lógica de carrito corregida) ---

function productStoreReducer(
  state: ProductStoreState,
  action: ProductStoreAction
): ProductStoreState {
  switch (action.type) {
    case "SET_PRODUCTS": {
      // ... (Lógica de carga de productos, se mantiene igual)
      const list = action.payload ?? [];
      const max = list.length ? Math.max(...list.map((p) => p.price ?? 0)) : 0;
      return {
        ...state,
        products: list,
        initialMaxPrice: max,
        maxPrice: max,
        isLoading: false,
      };
    }

    case "ADD_TO_CART": {
      const { productId, quantity } = action.payload;
      const productToAdd = state.products.find((p) => p.id === productId);
      if (!productToAdd) return state;

      const existingItem = state.cart.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        const newItem: CartItem = {
          productId: productToAdd.id,
          name: productToAdd.name,
          price: productToAdd.price,
          image: productToAdd.image || "",
          quantity: quantity,
        };
        return {
          ...state,
          cart: [...state.cart, newItem],
        };
      }
    }

    case "REMOVE_FROM_CART": {
      const productIdToRemove = action.payload;
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== productIdToRemove),
      };
    }

    case "UPDATE_CART_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.productId !== productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === productId ? { ...item, quantity: quantity } : item
        ),
      };
    }

    case "TOGGLE_CATEGORY_FILTER": {
      const cat = action.payload;
      const selected = state.selectedCategories.includes(cat)
        ? state.selectedCategories.filter((c) => c !== cat)
        : [...state.selectedCategories, cat];
      return { ...state, selectedCategories: selected };
    }

    case "SET_CATEGORIES":
      return { ...state, selectedCategories: action.payload };

    case "SET_MAX_PRICE_FILTER":
      return { ...state, maxPrice: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

// --- CONTEXTO (CORREGIDO) ---
// 🎯 Renombramos y exportamos el contexto para asegurar que useProductStore pueda acceder a él.
export const ProductsContext = createContext<
  | {
      state: ProductStoreState;
      dispatch: React.Dispatch<ProductStoreAction>;
    }
  | undefined
>(undefined);

// --- PROVIDER (Actualizado para usar ProductsContext) ---

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productStoreReducer, initialStoreState); // Efecto para cargar los productos al inicio (se mantiene igual)

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const apiProducts = await fetchProducts();
        if (!cancelled) {
          dispatch({ type: "SET_PRODUCTS", payload: apiProducts });
        }
      } catch (err) {
        console.error("Error cargando productos desde API:", err);
        if (!cancelled) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]); // 🎯 Usamos el contexto renombrado

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

// --- HOOK PERSONALIZADO (Actualizado para usar ProductsContext) ---

export const useProductStore = () => {
  // 🎯 Usamos el contexto renombrado y exportado
  const ctx = useContext(ProductsContext);
  if (!ctx)
    throw new Error("useProductStore debe usarse dentro de ProductsProvider");
  return ctx;
};

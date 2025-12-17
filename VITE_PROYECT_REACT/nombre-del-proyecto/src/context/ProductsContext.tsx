// src/context/ProductsContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import { fetchProducts } from "../services/products";
import type { Product, CartItem } from "../types/products";

// --------------------
// TIPOS
// --------------------

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  selectedCategories: string[];
  maxPrice: number;
  initialMaxPrice: number;
  cart: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_CART_QUANTITY";
      payload: { productId: string; quantity: number };
    };

type ProductStoreAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_CATEGORY_FILTER"; payload: string }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_MAX_PRICE_FILTER"; payload: number }
  | CartAction;

// --------------------
// ESTADO INICIAL
// --------------------

const initialStoreState: ProductStoreState = {
  products: [],
  isLoading: true,
  selectedCategories: [],
  initialMaxPrice: 0,
  maxPrice: 0,
  cart: [],
};

// --------------------
// REDUCER
// --------------------

function productStoreReducer(
  state: ProductStoreState,
  action: ProductStoreAction
): ProductStoreState {
  switch (action.type) {
    case "SET_PRODUCTS": {
      const list = action.payload ?? [];
      const max = list.length ? Math.max(...list.map((p) => p.price)) : 0;

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
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;

      const existing = state.cart.find((item) => item.productId === productId);

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image ?? "",
        quantity,
      };

      return {
        ...state,
        cart: [...state.cart, newItem],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.payload),
      };

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
          item.productId === productId ? { ...item, quantity } : item
        ),
      };
    }

    case "TOGGLE_CATEGORY_FILTER": {
      const category = action.payload;
      const selected = state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category];

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

// --------------------
// CONTEXTO
// --------------------

export const ProductsContext = createContext<
  | {
      state: ProductStoreState;
      dispatch: React.Dispatch<ProductStoreAction>;
    }
  | undefined
>(undefined);

// --------------------
// PROVIDER
// --------------------

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productStoreReducer, initialStoreState);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        if (!cancelled) {
          dispatch({ type: "SET_PRODUCTS", payload: products });
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        if (!cancelled) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// --------------------
// HOOK
// --------------------

export const useProductStore = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProductStore debe usarse dentro de ProductsProvider");
  }
  return ctx;
};

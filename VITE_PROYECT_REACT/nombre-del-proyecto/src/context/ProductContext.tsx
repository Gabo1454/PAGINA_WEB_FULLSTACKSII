// src/context/ProductContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "react";
import type { Product, CartItem } from "../data/types";
import { products as productsRepo } from "../data/db";

interface ProductStoreState {
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  selectedCategories: string[];
  maxPrice: number;
  initialMaxPrice: number;
}
type ProductStoreAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_ITEM_FROM_CART"; payload: { productId: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_CATEGORY_FILTER"; payload: string }
  | { type: "SET_MAX_PRICE_FILTER"; payload: number };

const initialStoreState: ProductStoreState = {
  products: [],
  cart: [],
  isLoading: false,
  selectedCategories: [],
  initialMaxPrice: 0,
  maxPrice: 0,
};

function productStoreReducer(
  state: ProductStoreState,
  action: ProductStoreAction
): ProductStoreState {
  switch (action.type) {
    case "SET_PRODUCTS": {
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
      // aceptar payload con { quantity } o { qty } (o ninguno -> 1)
      const payload = (action as any)?.payload ?? {};
      const productId: string | undefined = payload.productId;
      const itemQty: number = Number(payload.qty ?? payload.quantity ?? 1);

      if (!productId) return state;

      const exists = state.products.some((p) => p.id === productId);
      if (!exists) return state;

      const existing = state.cart.find((i) => i.productId === productId);

      const cart: CartItem[] = existing
        ? state.cart.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + itemQty } : i
          )
        : [...state.cart, { productId, qty: itemQty }];

      return { ...state, cart };
    }
    case "REMOVE_ITEM_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (i) => i.productId !== action.payload.productId
        ),
      };
    case "TOGGLE_CATEGORY_FILTER": {
      const cat = action.payload;
      const selected = state.selectedCategories.includes(cat)
        ? state.selectedCategories.filter((c) => c !== cat)
        : [...state.selectedCategories, cat];
      return { ...state, selectedCategories: selected };
    }
    case "SET_MAX_PRICE_FILTER":
      return { ...state, maxPrice: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const Ctx = createContext<
  | {
      state: ProductStoreState;
      dispatch: React.Dispatch<ProductStoreAction>;
      cartItemCount: number;
    }
  | undefined
>(undefined);

export const ProductStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productStoreReducer, initialStoreState);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    const list = productsRepo.all(); // lee desde localStorage (db.ts)
    dispatch({ type: "SET_PRODUCTS", payload: list });
  }, []);

  const cartItemCount = useMemo(
    () => state.cart.reduce((acc, it) => acc + it.qty, 0),
    [state.cart]
  );

  return (
    <Ctx.Provider value={{ state, dispatch, cartItemCount }}>
      {children}
    </Ctx.Provider>
  );
};

export const useProductStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useProductStore debe usarse dentro de ProductStoreProvider"
    );
  return ctx;
};

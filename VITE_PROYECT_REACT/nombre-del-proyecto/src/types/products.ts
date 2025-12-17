// src/types/products.ts

// Las categorías son strings simples (ej: "Gabinetes", "Componentes")
export type Category = string;

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;

  description?: string;
  image?: string;

  // CLAVE: debe ser PLURAL, igual al backend
  categories: Category[];

  // Flags usados en Home / cards
  featured?: boolean; // opcional por seguridad
  offer: boolean;
}

// ---------------- CART ----------------

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

// ---------------- SORT ----------------

export type SortOption =
  | "default"
  | "priceAsc"
  | "priceDesc"
  | "nameAsc"
  | "nameDesc";

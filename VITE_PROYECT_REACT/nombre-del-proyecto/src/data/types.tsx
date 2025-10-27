// src/data/types.ts
export type Category =
  | "Consolas"
  | "PCs"
  | "Juegos"
  | "Accesorios"
  | "Periféricos";

/** Útil para query params como ?category=Juegos */
export type SingleCategory = Category;

export type Product = {
  id: string;
  name: string;
  price: number; // CLP u otra moneda (mantén consistente en toda la app)
  stock: number;
  description?: string;
  image?: string; // estándar único
  offer?: boolean; // para "Ofertas"
  featured?: boolean; // para "Destacados"
  category: Category[]; // lo usas en filtros → array tipado (no string suelto)
};

export type CartItem = {
  productId: string; // estándar único
  qty: number; // estándar único
};

export type Customer = {
  name: string;
  email: string;
  phone?: string;
};

export type Address = {
  street: string;
  number: string;
  city: string;
  region: string;
};

export type OrderStatus = "success" | "failure" | "pending";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customer: Customer;
  address: Address;
  status: OrderStatus;
  createdAt: string; // ISO string
};

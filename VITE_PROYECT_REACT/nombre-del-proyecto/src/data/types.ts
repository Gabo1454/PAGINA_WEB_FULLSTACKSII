// src/data/types.ts
export type Category =
  | "Códigos Digitales"
  | "Gabinetes"
  | "Componentes"
  | "Notebooks"
  | "Juegos"
  | "Coleccionables"
  | "Consolas"
  | "Accesorios"
  | "Audio"
  | "Muebles Gamer"
  | "Periféricos"
  | "Monitores"
  | "PCs"
  | "Juegos de Mesa"
  | "Merchandising";

/** Producto principal usado en todo el proyecto */
export interface Product {
  id: string;
  name?: string;
  title?: string;
  description?: string | null;
  price?: number;
  image?: string;
  stock?: number;
  offer?: boolean;
  featured?: boolean;
  category: Category[]; // array tipado exactamente con las categorías de arriba
  [key: string]: any; // permite campos extra sin romper el tipado
}

/** Elemento de carrito */
export type CartItem = {
  productId: string;
  qty: number;
};

/** Pedido / Order */
export type Customer = {
  name: string;
  email: string;
  phone?: string;
};

export type Address = {
  street?: string;
  number?: string;
  city?: string;
  region?: string;
};

export type OrderStatus = "success" | "failure" | "pending";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customer: Customer;
  address?: Address;
  status?: OrderStatus;
  createdAt?: string;
};

/** helper: categoría única (query params) */
export type SingleCategory = Category;

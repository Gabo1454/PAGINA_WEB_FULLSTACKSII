// src/types/products.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  offer: boolean;
  categories: string[];
}

export interface CartItem {
  productId: number;
  qty: number;
}

// src/services/products.ts
import type { Product } from "../types/products";

const API_URL = "http://localhost:8080/api";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);

  if (!res.ok) {
    throw new Error("Error al cargar productos desde el backend");
  }

  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);

  if (!res.ok) {
    throw new Error("Producto no encontrado");
  }

  return res.json();
}

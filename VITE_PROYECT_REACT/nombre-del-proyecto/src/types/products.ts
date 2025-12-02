// src/types/products.ts

// Define la categoría como un tipo de string para mayor seguridad
export type Category = string;

export interface Product {
  id: string; // O number, dependiendo de cómo lo manejes
  name: string;
  price: number;
  stock: number;
  description?: string; // Opcional
  image?: string; // Opcional

  // 🎯 PROPIEDADES FALTANTES QUE CAUSAN EL ERROR
  category: Category[]; // Debe ser un array de Category (ej: ["Consolas", "Gaming"])
  featured: boolean; // Indica si es destacado para la sección del Home
  offer: boolean; // Indica si está en oferta (también usado en Home)
  // ----------------------------------------
}

// También podrías tener otras interfaces aquí, como:
export interface CartItem {
  productId: string;
  name: string; // Necesario para mostrar en la tabla
  price: number; // CRÍTICO: Necesario para el subtotal.
  image: string; // Necesario para la imagen
  quantity: number; // Cambié 'qty' a 'quantity' para mayor claridad (pero si usas 'qty', déjalo así)
}
// ...
export type SortOption =
  | "default"
  | "priceAsc" // <-- Usar CamelCase
  | "priceDesc"
  | "nameAsc"
  | "nameDesc";

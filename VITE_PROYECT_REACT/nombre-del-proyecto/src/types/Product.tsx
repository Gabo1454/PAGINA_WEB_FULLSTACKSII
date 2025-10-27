export interface Product {
  id: string;
  name: string;
  price: number;
  category: string[];
  /** URL o ruta de la imagen del producto (requerido para el ProductCard). */
  imageUrl: string;
  /** Descripción breve del producto. */
  description: string;

  stock: number;
}

/** Define la estructura de un ítem dentro del carrito de compras. */
export interface CartItem extends Product {
  quantity: number;
}

// src/data/db.ts
import type { Product, CartItem, Order, Category } from "./types";
import { initialProducts } from "./products";

const KEY_PRODUCTS = "db_products";
const KEY_CART = "db_cart";
const KEY_ORDERS = "db_orders";

/* =============== Helpers base =============== */
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function read<T>(key: string, fallback: T): T {
  return safeParse<T>(localStorage.getItem(key), fallback);
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  // útil para que componentes puedan escuchar cambios (opcional)
  window.dispatchEvent(new CustomEvent("db:changed", { detail: key }));
}

/* =============== Normalización/Migración ligera =============== */
/** Asegura que el producto cumpla tu contrato actual. */
function normalizeProduct(p: any): Product {
  const category: Category[] = Array.isArray(p.category)
    ? (p.category as Category[])
    : p.category
    ? [p.category as Category]
    : []; // si viene vacío, queda []

  return {
    id: String(p.id),
    name: String(p.name ?? p.title ?? "Producto"),
    price: Number(p.price ?? 0),
    stock: Number(p.stock ?? 0),
    description: p.description ? String(p.description) : undefined,
    image: p.image ? String(p.image) : undefined,
    offer: Boolean(p.offer),
    featured: Boolean(p.featured),
    category,
  };
}

/** Normaliza toda una lista (para seeds o para lecturas antiguas). */
function normalizeList(list: any[]): Product[] {
  return (list || []).map(normalizeProduct);
}

/* =============== Seed (solo primera vez) =============== */
(function seed() {
  if (!localStorage.getItem(KEY_PRODUCTS)) {
    write<Product[]>(KEY_PRODUCTS, normalizeList(initialProducts as any));
  }
  if (!localStorage.getItem(KEY_CART)) write<CartItem[]>(KEY_CART, []);
  if (!localStorage.getItem(KEY_ORDERS)) write<Order[]>(KEY_ORDERS, []);
})();

/* =============== PRODUCTS =============== */
export const products = {
  all(): Product[] {
    return normalizeList(read<Product[]>(KEY_PRODUCTS, []));
  },

  get(id: string): Product | undefined {
    return this.all().find((p) => p.id === id);
  },

  /** Devuelve los productos que incluyan la categoría indicada (porque category es array). */
  byCategory(category: Category): Product[] {
    return this.all().filter((p) => p.category.includes(category));
  },

  /** Destacados por categoría (usa featured; si no hay, cae a offer; si tampoco, lista base). */
  featuredByCategory(category: Category, limit = 8): Product[] {
    const list = this.byCategory(category);
    const featured = list.filter((p) => p.featured === true);
    const fallbackOffers = featured.length
      ? featured
      : list.filter((p) => p.offer === true);
    const base =
      featured.length || fallbackOffers.length
        ? featured.length
          ? featured
          : fallbackOffers
        : list;
    return base.slice(0, limit);
  },

  /** Búsqueda simple por nombre/descr. */
  search(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.all().filter((p) =>
      [p.name ?? p.title ?? "", p.description ?? ""].some((s) =>
        (s ?? "").toLowerCase().includes(q)
      )
    );
  },

  /** Ofertas globales */
  offers(limit = 20): Product[] {
    return this.all()
      .filter((p) => p.offer)
      .slice(0, limit);
  },

  /** Crear/actualizar/eliminar */
  create(p: Product) {
    const list = this.all();
    const np = normalizeProduct(p);
    list.push(np);
    write(KEY_PRODUCTS, list);
    return np;
    // Nota: si hay chance de colisión de ID, aquí podrías validar.
  },

  update(p: Product) {
    const list = this.all().map((x) =>
      x.id === p.id ? normalizeProduct(p) : x
    );
    write(KEY_PRODUCTS, list);
    return p;
  },

  remove(id: string) {
    write<Product[]>(
      KEY_PRODUCTS,
      this.all().filter((p) => p.id !== id)
    );
  },

  /** Utilidad: obtener categorías únicas presentes en la base (útil para filtros dinámicos) */
  categories(): Category[] {
    const set = new Set<Category>();
    this.all().forEach((p) => p.category.forEach((c) => set.add(c)));
    return Array.from(set);
  },
};

/* =============== CART =============== */
export const cart = {
  items(): CartItem[] {
    return read<CartItem[]>(KEY_CART, []);
  },

  /** Agrega respetando stock (si existe) */
  add(productId: string, qty = 1) {
    const product = products.get(productId);
    if (!product) return;

    const list = this.items();
    const it = list.find((i) => i.productId === productId);

    const currentQty = it?.qty ?? 0;
    const nextQty = Math.max(0, currentQty + qty);

    // Respeta stock si está definido (>0). Si stock es 0, no agrega.
    const stock = product.stock ?? 0;
    const cap = stock > 0 ? Math.min(nextQty, stock) : nextQty;

    if (it) {
      it.qty = cap;
    } else if (cap > 0) {
      list.push({ productId, qty: cap });
    }

    write(KEY_CART, list);
  },

  update(productId: string, qty: number) {
    const product = products.get(productId);
    if (!product) return;

    const list = this.items()
      .map((i) =>
        i.productId === productId
          ? {
              ...i,
              qty: Math.max(
                0,
                (() => {
                  const stock = product.stock ?? 0;
                  return stock > 0 ? Math.min(qty, stock) : qty;
                })()
              ),
            }
          : i
      )
      .filter((i) => i.qty > 0);

    write(KEY_CART, list);
  },

  remove(productId: string) {
    write<CartItem[]>(
      KEY_CART,
      this.items().filter((i) => i.productId !== productId)
    );
  },

  clear() {
    write<CartItem[]>(KEY_CART, []);
  },

  total(): number {
    const list = this.items();
    const prod = products.all();
    return list.reduce((acc, i) => {
      const p = prod.find((pp) => pp.id === i.productId);
      return acc + (p ? (p.price ?? 0) * i.qty : 0);
    }, 0);
  },
};

/* =============== ORDERS =============== */
export const orders = {
  all(): Order[] {
    return read<Order[]>(KEY_ORDERS, []);
  },

  /** Crea la orden y (opcional) descuenta stock de los productos. */
  create(order: Order, options?: { decrementStock?: boolean }) {
    const list = this.all();
    list.push(order);
    write(KEY_ORDERS, list);

    if (options?.decrementStock) {
      // Descuenta stock y guarda productos
      const map = new Map<string, number>();
      order.items.forEach((i) => {
        map.set(i.productId, (map.get(i.productId) ?? 0) + i.qty);
      });

      const updated = products.all().map((p) => {
        const dec = map.get(p.id);
        if (!dec) return p;
        const next = Math.max(0, (p.stock ?? 0) - dec);
        return { ...p, stock: next };
      });

      write<Product[]>(KEY_PRODUCTS, updated);
    }

    return order;
  },
};

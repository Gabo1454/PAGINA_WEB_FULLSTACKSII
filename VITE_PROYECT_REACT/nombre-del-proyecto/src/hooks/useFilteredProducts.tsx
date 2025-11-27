// src/hooks/useFilteredProducts.ts
import { useMemo, useState } from "react";
import { useProductStore } from "../context/ProductsContext";
import type { Product } from "../types/products";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export function useFilteredProducts() {
  const { state } = useProductStore();
  const { products, selectedCategories, maxPrice, initialMaxPrice, isLoading } =
    state;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const filteredAndSortedProducts = useMemo<Product[]>(() => {
    let list = [...products];

    // 🔍 BÚSQUEDA POR NOMBRE
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // 🏷️ FILTRO POR CATEGORÍAS (AND: el producto debe tener TODAS las seleccionadas)
    if (selectedCategories.length > 0) {
      list = list.filter((p) => {
        const prodCats = p.categories ?? [];
        if (prodCats.length === 0) return false;

        // AND → todas las categorías seleccionadas deben estar en el producto
        return selectedCategories.every((selectedCat) =>
          prodCats.includes(selectedCat)
        );
      });
    }

    // 💰 FILTRO POR PRECIO MÁXIMO
    if (
      maxPrice > 0 &&
      maxPrice < (initialMaxPrice || Number.MAX_SAFE_INTEGER)
    ) {
      list = list.filter((p) => (p.price ?? 0) <= maxPrice);
    }

    // ↕️ ORDENAMIENTO
    switch (sortOption) {
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name-asc":
        list.sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        );
        break;
      case "name-desc":
        list.sort((a, b) =>
          b.name.localeCompare(a.name, "es", { sensitivity: "base" })
        );
        break;

      case "default":
      default:
        // sin orden → como viene del backend
        break;
    }

    return list;
  }, [
    products,
    searchTerm,
    selectedCategories,
    maxPrice,
    initialMaxPrice,
    sortOption,
  ]);

  return {
    isLoading,
    filteredAndSortedProducts,
    sortOption,
    setSortOption,
    setSearchTerm,
  };
}

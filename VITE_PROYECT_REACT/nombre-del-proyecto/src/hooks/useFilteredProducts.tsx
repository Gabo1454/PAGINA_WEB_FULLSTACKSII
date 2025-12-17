// src/hooks/useFilteredProducts.ts
import { useMemo, useState, Dispatch, SetStateAction } from "react";
import { useProductStore } from "../context/ProductsContext";
import type { Product, SortOption } from "../types/products";

interface UseFilteredProductsResult {
  isLoading: boolean;
  filteredAndSortedProducts: Product[];
  sortOption: SortOption;
  setSortOption: Dispatch<SetStateAction<SortOption>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export function useFilteredProducts(): UseFilteredProductsResult {
  const { state } = useProductStore();
  const { products, selectedCategories, maxPrice, initialMaxPrice, isLoading } =
    state;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const filteredAndSortedProducts = useMemo<Product[]>(() => {
    let list = [...products];

    // 🔍 Búsqueda por nombre
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // 🏷️ Filtro por categorías
    if (selectedCategories.length > 0) {
      list = list.filter((p) => {
        const prodCats = p.categories ?? [];
        if (prodCats.length === 0) return false;

        // AND: todas las categorías seleccionadas deben estar en el producto
        return selectedCategories.every((selectedCat) =>
          prodCats.includes(selectedCat)
        );
      });
    }

    // 💰 Filtro por precio máximo
    if (
      maxPrice > 0 &&
      maxPrice < (initialMaxPrice || Number.MAX_SAFE_INTEGER)
    ) {
      list = list.filter((p) => (p.price ?? 0) <= maxPrice);
    }

    // ↕️ Ordenamiento
    switch (sortOption) {
      case "priceAsc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "nameAsc":
        list.sort((a, b) =>
          a.name.localeCompare(b.name, "es", { sensitivity: "base" })
        );
        break;
      case "nameDesc":
        list.sort((a, b) =>
          b.name.localeCompare(a.name, "es", { sensitivity: "base" })
        );
        break;
      case "default":
      default:
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

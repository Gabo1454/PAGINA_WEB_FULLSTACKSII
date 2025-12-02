// src/hooks/useFilteredProducts.ts
import { useMemo, useState, Dispatch, SetStateAction } from "react"; // 🎯 Se importa Dispatch y SetStateAction
import { useProductStore } from "../context/ProductsContext";
// 🎯 Importamos SortOption del archivo global y Product
import type { Product, SortOption } from "../types/products";

// ❌ ELIMINAMOS LA REDEFINICIÓN LOCAL DEL TIPO SortOption
// type SortOption =
//    | "default"
//    | "price-asc"
//    | "price-desc"
//    | "name-asc"
//    | "name-desc";
// ✅ Ahora usa la importación global

// 🎯 Tipado de la función de retorno del hook
interface UseFilteredProductsResult {
  isLoading: boolean;
  filteredAndSortedProducts: Product[];
  sortOption: SortOption;
  setSortOption: Dispatch<SetStateAction<SortOption>>; // 🎯 Tipado corregido
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

    // 🔍 BÚSQUEDA POR NOMBRE
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // 🏷️ FILTRO POR CATEGORÍAS (AND: el producto debe tener TODAS las seleccionadas)
    if (selectedCategories.length > 0) {
      list = list.filter((p) => {
        const prodCats = p.category ?? [];
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
      // 🎯 CORRECCIÓN CRÍTICA: Usamos CamelCase para coincidir con el tipo global
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

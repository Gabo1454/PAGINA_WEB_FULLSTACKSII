import { useState, useMemo } from "react";
import { useProductStore } from "../context/ProductContext";
import type { Product, CartItem } from "../data/types"; // ajusta el path relativo

export const useFilteredProducts = () => {
  // 1. Obtener datos y filtros del estado global
  const { state } = useProductStore();
  const { products, isLoading, selectedCategories, maxPrice } = state;

  // 2. Estados locales
  const [sortOption, setSortOption] = useState<string>("default");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 3. Lógica compleja (El useMemo completo)
  const filteredAndSortedProducts = useMemo(() => {
    // Asegura que haya datos para procesar.
    if (!products || products.length === 0) {
      return [];
    }

    const effectiveMaxPrice = maxPrice > 0 ? maxPrice : Infinity;
    let processableProducts: Product[] = [...products];

    // --- FILTRADO POR CATEGORÍA (¡Ajuste de robustez de tipo!) ---
    if (selectedCategories.length > 0) {
      processableProducts = processableProducts.filter((product) => {
        // 💡 Verificación de Robustez: Normaliza product.category a un array de strings.
        const productCategories = Array.isArray(product.category)
          ? product.category
          : typeof product.category === "string"
          ? [product.category]
          : [];

        // Requiere que TODAS las categorías seleccionadas estén en el producto (Lógica AND).
        return selectedCategories.every((selectedCat) =>
          productCategories.includes(selectedCat)
        );
      });
    }

    // --- FILTRADO POR PRECIO ---
    processableProducts = processableProducts.filter(
      (product) => product.price <= effectiveMaxPrice
    );

    // --- FILTRADO POR BÚSQUEDA ---
    if (searchTerm) {
      processableProducts = processableProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // --- ORDENAMIENTO ---
    if (sortOption === "price-asc") {
      processableProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      processableProducts.sort((a, b) => b.price - a.price);
    } else {
      processableProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    return processableProducts;
  }, [products, sortOption, searchTerm, selectedCategories, maxPrice]); // Dependencias correctas

  // 4. Retornar solo lo que el componente necesita
  return {
    isLoading,
    filteredAndSortedProducts,
    sortOption,
    setSortOption,
    searchTerm,
    setSearchTerm,
  };
};

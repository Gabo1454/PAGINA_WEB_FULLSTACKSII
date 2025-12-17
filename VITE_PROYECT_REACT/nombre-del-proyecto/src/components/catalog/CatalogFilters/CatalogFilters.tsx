// src/components/catalog/CatalogFilters/CatalogFilters.tsx
import { useMemo } from "react";
import { useProductStore } from "../../../context/ProductsContext";
import styles from "./CatalogFilters.module.css";
import type { SortOption } from "../../../types/products"; // Importado correctamente

type Props = {
  onSearch: (term: string) => void;
  // sortOption DEBE ser de tipo SortOption
  sortOption: SortOption;
  // onChangeSort DEBE esperar un argumento de tipo SortOption
  onChangeSort: (opt: SortOption) => void;
};

export default function CatalogFilters({
  onSearch,
  sortOption,
  onChangeSort,
}: Props) {
  const { state, dispatch } = useProductStore();
  const { products, selectedCategories, maxPrice, initialMaxPrice } = state;

  // categorías únicas desde backend
  const categories = useMemo(() => {
    const all = products ?? [];
    const set = new Set<string>();

    all.forEach((p) => {
      (p.categories ?? []).forEach((c) => {
        if (c && c.trim()) set.add(c.trim());
      });
    });

    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [products]);

  const sliderMax = initialMaxPrice || 2_000_000;

  const handleCategoryClick = (cat: string) => {
    dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: cat });
  };

  const handlePriceChange = (e: any) => {
    const value = Number(e.target.value);
    dispatch({ type: "SET_MAX_PRICE_FILTER", payload: value });
  };

  const formatPrice = (price: number): string =>
    price.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  return (
    <div className={styles.filtersCard}>
      <h5 className={styles.title}>Filtros</h5>

      {/* 🔍 Búsqueda */}
      <div className={styles.section}>
        <label className={styles.label}>Buscar</label>
        <input
          type="text"
          className={`form-control ${styles.input}`}
          placeholder="Nombre del producto..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* 🏷️ Categorías dinámicas */}
      {categories.length > 0 && (
        <div className={styles.section}>
          <label className={styles.label}>Categorías</label>
          <div className={styles.categoryList}>
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.categoryChip} ${
                    active ? styles.categoryChipActive : ""
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <span className={styles.checkbox} aria-hidden="true" />
                  <span className={styles.categoryText}>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 💰 Precio máximo */}
      <div className={styles.section}>
        <label className={styles.label}>Precio máximo</label>
        <p className={styles.priceText}>Hasta: {formatPrice(maxPrice)}</p>

        <input
          type="range"
          min={0}
          max={sliderMax}
          step={50_000}
          value={maxPrice}
          onChange={handlePriceChange}
          className={styles.range}
        />

        <div className={styles.rangeLabels}>
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(sliderMax)}</span>
        </div>
      </div>

      {/* 🔽 Ordenar */}
      <div className={styles.section}>
        <label className={styles.label}>Ordenar por</label>
        <select
          className={`form-select ${styles.select}`}
          value={sortOption}
          // 🎯 CORRECCIÓN DE TIPADO Y CAPITALIZACIÓN:
          // Se llama a onChangeSort con e.target.value casteado a SortOption.
          onChange={(e) => onChangeSort(e.target.value as SortOption)}
        >
          {/* 🎯 CORRECCIÓN CRÍTICA: Valores uniformados a CamelCase */}
          <option value="default">Sin orden especial</option>
          <option value="relevance">Relevancia</option>
          <option value="priceAsc">Precio: menor a mayor</option>{" "}
          {/* Corregido de price-asc */}
          <option value="priceDesc">Precio: mayor a menor</option>{" "}
          {/* Corregido de price-desc */}
          <option value="nameAsc">Nombre A-Z</option>{" "}
          {/* Corregido de name-asc */}
          <option value="nameDesc">Nombre Z-A</option>{" "}
          {/* Corregido de name-desc */}
        </select>
      </div>
    </div>
  );
}

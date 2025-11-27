// src/components/layout/FilterSidebar/FilterSidebar.tsx
import React, { useMemo } from "react";
import { useProductStore } from "../../../context/ProductsContext";
import { FaFilter } from "react-icons/fa";
import styles from "./FilterSidebar.module.css";

const FilterSidebar: React.FC = () => {
  const { state, dispatch } = useProductStore();
  const { products, selectedCategories, maxPrice, initialMaxPrice } = state;

  // Precio máximo del slider (si no hay datos, usa fallback)
  const sliderMax = initialMaxPrice || 2_000_000;

  // 🔹 Categorías únicas desde p.categories (array)
  const uniqueCategories = useMemo(() => {
    const flat = products.flatMap((p) =>
      Array.isArray(p.categories) ? p.categories : []
    );
    return Array.from(new Set(flat.filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );
  }, [products]);

  const handleCategoryChange = (category: string) => {
    dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: category });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    // Actualiza el estado global (filtro de precio)
    dispatch({ type: "SET_MAX_PRICE_FILTER", payload: value });

    // Actualiza visualmente el "llenado" del slider
    const percentage = (value / sliderMax) * 100;
    e.target.style.background = `
      linear-gradient(
        90deg,
        var(--azul-electrico) ${percentage}%,
        #1a1a1a ${percentage}%
      )
    `;
  };

  const formatPrice = (price: number): string =>
    price.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>
        <FaFilter />
        <span>Filtros</span>
      </h2>

      {/* 🏷️ CATEGORÍAS */}
      <div className={styles.section}>
        <h3 className={styles.sectionLabel}>Categorías</h3>
        <div className={styles.categoryList}>
          {uniqueCategories.map((category) => {
            const active = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                className={`${styles.categoryPill} ${
                  active ? styles.categoryPillActive : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            );
          })}

          {uniqueCategories.length === 0 && (
            <p className={styles.emptyText}>No hay categorías disponibles.</p>
          )}
        </div>
      </div>

      {/* 💰 PRECIO */}
      <div className={styles.section}>
        <h3 className={styles.sectionLabel}>Precio máximo</h3>
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
    </aside>
  );
};

export default FilterSidebar;

import React, { useMemo } from "react";
import { useProductStore } from "../../context/ProductContext";
import styles from "../../pages/Products/Products.module.css";

const FilterSidebar: React.FC = () => {
  const { state, dispatch } = useProductStore();
  const { products, selectedCategories, maxPrice, initialMaxPrice } = state;

  // Precio máx. del slider (si no hay datos, usa fallback)
  const sliderMax = initialMaxPrice || 2_000_000;

  // Categorías únicas (ignora productos sin category)
  const uniqueCategories = useMemo(() => {
    const flat = products.flatMap((p) =>
      Array.isArray(p.category) ? p.category : []
    );
    return Array.from(new Set(flat.filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, "es", { sensitivity: "base" })
    );
  }, [products]);

  const handleCategoryChange = (category: string) => {
    dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: category });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_MAX_PRICE_FILTER", payload: Number(e.target.value) });
  };

  const formatPrice = (price: number): string =>
    price.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  return (
    <aside
      className={`${styles.sidebar} bg-dark text-white p-4 rounded-3 shadow h-fit sticky`}
      style={{ top: "var(--header-h, 80px)" }}
    >
      <h2 className="h5 mb-4 border-bottom border-primary pb-2">Filtrar por</h2>

      {/* Filtro por Categoría */}
      <div className="mb-4">
        <h3 className={`${styles.filterTitle} h6 mb-3`}>Categorías</h3>
        <ul className="list-unstyled m-0">
          {uniqueCategories.map((category) => (
            <li key={category} className="mb-2">
              <div className="form-check">
                <input
                  id={`cat-${category}`}
                  type="checkbox"
                  className={`form-check-input ${styles.categoryCheckbox}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={`cat-${category}`}
                  className={`form-check-label ${styles.categoryLabel}`}
                >
                  {category}
                </label>
              </div>
            </li>
          ))}
          {uniqueCategories.length === 0 && (
            <li className="text-secondary small">
              No hay categorías disponibles.
            </li>
          )}
        </ul>
      </div>

      {/* Filtro por Precio */}
      <div>
        <h3 className={`${styles.filterTitle} h6 mb-3`}>Rango de Precio</h3>
        <p className="fw-bold text-success mb-2">
          Hasta: {formatPrice(maxPrice)}
        </p>
        <input
          type="range"
          min={0}
          max={sliderMax}
          step={50_000}
          value={maxPrice}
          onChange={handlePriceChange}
          className="form-range"
          aria-label="Filtro de precio máximo"
        />
        <div className="d-flex justify-content-between text-secondary small">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(sliderMax)}</span>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

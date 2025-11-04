// src/pages/Products/Products.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import { useProductStore } from "../../context/ProductsContext";
import ProductCard from "../../components/catalog/ProductCard/ProductCard";
import CatalogFilters from "../../components/catalog/CatalogFilters/CatalogFilters";
import styles from "./Products.module.css";
import type { Product } from "../../types/products";

export default function ProductsIndex() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { state, dispatch } = useProductStore();

  const {
    isLoading,
    filteredAndSortedProducts,
    sortOption,
    setSortOption,
    setSearchTerm,
  } = useFilteredProducts();

  // ?q= -> búsqueda
  useEffect(() => {
    const q = params.get("q") ?? "";
    setSearchTerm(q);
  }, [params, setSearchTerm]);

  // ?category= -> forzar filtro por UNA sola categoría
  useEffect(() => {
    const cat = params.get("category");
    if (!cat) return;

    const category = decodeURIComponent(cat);

    // Si ya está exactamente esa única categoría activa, no hagas nada
    const onlyThisActive =
      state.selectedCategories.length === 1 &&
      state.selectedCategories[0] === category;
    if (onlyThisActive) return;

    // 1) limpiar todas las categorías activas
    if (state.selectedCategories.length) {
      state.selectedCategories.forEach((c) =>
        dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: c })
      );
    }

    // 2) activar la categoría de la URL (siempre)
    dispatch({ type: "TOGGLE_CATEGORY_FILTER", payload: category });

    // 3) opcional: limpiar búsqueda para no “ocultar” resultados
    setSearchTerm("");

    // 4) subir al inicio
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [params, state.selectedCategories, dispatch, setSearchTerm]);

  if (isLoading) {
    return <div className={styles.loadingContainer}>Cargando productos...</div>;
  }

  return (
    <>
      {/* Banner */}
      <div className={styles.heroBanner}>
        <img
          src="/imgs/elden-ring-slider-banner.webp"
          alt="Banner"
          className={styles.heroImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://www.weplay.cl/pub/media/catalog/category/BANNER-JUEGOS.png";
          }}
        />
      </div>

      <section className={`container-fluid text-white ${styles.productsPage}`}>
        <div className="d-flex justify-content-between align-items-center mb-3 d-lg-none">
          <button
            className="btn btn-outline-primary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#filtersOffcanvas"
            aria-controls="filtersOffcanvas"
            aria-label="Abrir filtros"
          >
            ☰ Filtros
          </button>
        </div>

        <div className={`row g-4 ${styles.productsRow}`}>
          <aside className="col-12 col-lg-3 d-none d-lg-block">
            <div className={styles.sidebarSticky}>
              <CatalogFilters
                onSearch={setSearchTerm}
                sortOption={sortOption}
                onChangeSort={setSortOption}
              />
            </div>
          </aside>

          <div
            className="offcanvas offcanvas-start bg-dark text-white d-lg-none"
            tabIndex={-1}
            id="filtersOffcanvas"
            aria-labelledby="filtersOffcanvasLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="filtersOffcanvasLabel">
                Filtros
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="offcanvas-body">
              <CatalogFilters
                onSearch={setSearchTerm}
                sortOption={sortOption}
                onChangeSort={setSortOption}
              />
            </div>
          </div>

          <div className="col-12 col-lg-9">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product: Product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p className="text-center text-muted py-5">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

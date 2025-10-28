import React from "react";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import ProductCard from "../../components/ProductCard/ProductCard";
import CatalogFilters from "../../components/CatalogFilters/CatalogFilters";
import styles from "./Products.module.css";

export default function ProductsIndex() {
  const {
    isLoading,
    filteredAndSortedProducts,
    sortOption,
    setSortOption,
    setSearchTerm,
  } = useFilteredProducts();

  if (isLoading) {
    return <div className={styles.loadingContainer}>Cargando productos...</div>;
  }

  return (
    <>
      {/* 🖼️ Banner full-bleed (borde a borde) */}
      <div className={styles.heroBanner}>
        <img
          src="img/elden-ring-slider-banner.webp"
          alt="Banner de Elden Ring"
          className={styles.heroImage}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://www.weplay.cl/pub/media/catalog/category/BANNER-JUEGOS.png";
          }}
        />
      </div>

      {/* 🛒 Contenido con márgenes laterales (igual que Home) */}
      <section className={`container-fluid text-white ${styles.productsPage}`}>
        {/* Barra superior sólo en móvil: botón hamburguesa */}
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
          {/* Sidebar (desktop) */}
          <aside className="col-12 col-lg-3 d-none d-lg-block">
            <div className={styles.sidebarSticky}>
              <CatalogFilters
                onSearch={setSearchTerm}
                sortOption={sortOption}
                onChangeSort={setSortOption}
              />
            </div>
          </aside>

          {/* Offcanvas en móvil (usa el mismo componente, el estado persiste en el hook) */}
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

          {/* Grid de productos */}
          <div className="col-12 col-lg-9">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product) => (
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

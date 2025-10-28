import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import ProductCard from "../../components/ProductCard/ProductCard";
import CatalogFilters from "../../components/CatalogFilters/CatalogFilters";
import styles from "./Products.module.css";
import type { Product } from "../../data/types";

function useQuerySearchParam() {
  return new URLSearchParams(useLocation().search).get("q") ?? "";
}

export default function ProductsIndex() {
  const navigate = useNavigate();
  const qParam = useQuerySearchParam();

  const {
    isLoading,
    filteredAndSortedProducts,
    sortOption,
    setSortOption,
    setSearchTerm,
  } = useFilteredProducts();

  // Si vienen con ?q= desde la URL (ej: header navegó), inicializamos el filtro
  useEffect(() => {
    if (qParam) {
      setSearchTerm(qParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]); // intencional: solo cuando cambia la query string

  // Escucha evento global product-search emitido por Header.
  // Si llega un término, navegamos a /products?q=... y actualizamos setSearchTerm.
  useEffect(() => {
    const onSearch = (e: Event) => {
      const term = (e as CustomEvent<string>).detail ?? "";
      // navegamos siempre a /products para mostrar resultados
      navigate(`/products${term ? `?q=${encodeURIComponent(term)}` : ""}`, {
        replace: false,
      });
      setSearchTerm(term);
    };

    window.addEventListener("product-search", onSearch as EventListener);
    return () =>
      window.removeEventListener("product-search", onSearch as EventListener);
  }, [navigate, setSearchTerm]);

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

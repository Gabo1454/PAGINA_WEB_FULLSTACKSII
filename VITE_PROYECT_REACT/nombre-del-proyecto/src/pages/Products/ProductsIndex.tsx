import React from "react";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import ProductCard from "../../components/ProductCard/ProductCard";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import SearchBar from "../../components/SearchBar/SearchBar";
import styles from "./Products.module.css";

export default function ProductsIndex() {
  // 💡 Usa el hook: Toda la lógica de filtrado y estado se consume aquí
  const {
    isLoading,
    filteredAndSortedProducts, // ESTA ES LA LISTA DE PRODUCTOS FILTRADOS
    sortOption,
    setSortOption,
    setSearchTerm,
  } = useFilteredProducts();

  if (isLoading) {
    return <div className={styles.loadingContainer}>Cargando productos...</div>;
  }

  return (
    <div className={`px-4 ${styles.productsPage}`}>
      {/* Tu banner y h1 van aquí */}
      <h1 className="text-4xl font-extrabold text-white mb-6 border-b-4 border-red-600 pb-2"></h1>
      {/* Sección para el SLIDER / BANNER (ejemplo) */}
      <section className="mb-10 rounded-lg overflow-hidden shadow-2xl">
        <div className="h-64 bg-gray-900 flex items-center justify-center">
          <img
            src="img/elden-ring-slider-banner.webp"
            alt="Banner de Elden Ring"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://www.weplay.cl/pub/media/catalog/category/BANNER-JUEGOS.png";
            }}
          />
        </div>
      </section>{" "}
      <section className={styles.catalogoLayout}>
        <FilterSidebar />{" "}
        <main className="flex-grow">
          {" "}
          <div
            className={`${styles.filters} bg-gray-800 text-white p-4 rounded-lg shadow-xl`}
          >
            <SearchBar onSearch={setSearchTerm} />{" "}
            {/* Selector de Ordenamiento */}{" "}
            <div className="flex items-center space-x-2">
              {" "}
              <label
                htmlFor="sort-by"
                className="text-gray-200 font-medium whitespace-nowrap"
              >
                Ordenar por:{" "}
              </label>{" "}
              <select
                id="sort-by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="default">Relevancia</option>{" "}
                <option value="price-asc">Precio: Más barato</option>{" "}
                <option value="price-desc">Precio: Más caro</option>{" "}
                {/* 💡 OPCIÓN AÑADIDA */}{" "}
                <option value="name-asc">Nombre (A-Z)</option>{" "}
                {/* 💡 OPCIÓN AÑADIDA */}{" "}
              </select>{" "}
            </div>{" "}
          </div>
          {/* Grid de Productos */}{" "}
          <section className={styles.productsGrid}>
            {/* 💡 RENDERIZADO DE PRODUCTOS AÑADIDO */}{" "}
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-xl text-gray-400 col-span-full py-10 text-center">
                No se encontraron productos con los filtros seleccionados.{" "}
              </p>
            )}{" "}
          </section>{" "}
        </main>{" "}
      </section>{" "}
    </div>
  );
}

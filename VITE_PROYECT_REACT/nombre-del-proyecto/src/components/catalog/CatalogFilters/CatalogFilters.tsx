// src/components/catalog/CatalogFilters/CatalogFilters.tsx
import SearchBar from "../../sections/SearchBar";
import FilterSidebar from "../../layout/FilterSidebar/FilterSidebar";
import styles from "./CatalogFilters.module.css";

type Props = {
  onSearch: (q: string) => void;
  sortOption: string;
  onChangeSort: (v: string) => void;
};

export default function CatalogFilters({
  onSearch,
  sortOption,
  onChangeSort,
}: Props) {
  return (
    <aside className={`card bg-dark text-white ${styles.panel}`}>
      <div className="card-body">
        {/* Buscar + Ordenar */}
        <div className="row g-3 align-items-center mb-3">
          <div className="col-12 col-lg">
            {/* La SearchBar mantiene su lógica; solo toma el estilo del panel */}
            <SearchBar onSearch={onSearch} />
          </div>

          <div className="col-12 col-md-auto">
            <label
              htmlFor="sort-by"
              className={`form-label mb-0 me-2 ${styles.sectionLabel}`}
            >
              Ordenar por:
            </label>
            <select
              id="sort-by"
              value={sortOption}
              onChange={(e) => onChangeSort(e.target.value)}
              className={`form-select form-select-sm ${styles.select}`}
            >
              <option value="default">Relevancia</option>
              <option value="price-asc">Precio: Más barato</option>
              <option value="price-desc">Precio: Más caro</option>
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
            </select>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Categorías / otros filtros (panel sticky) */}
        <div className={styles.stickyBox}>
          <FilterSidebar />
        </div>
      </div>
    </aside>
  );
}

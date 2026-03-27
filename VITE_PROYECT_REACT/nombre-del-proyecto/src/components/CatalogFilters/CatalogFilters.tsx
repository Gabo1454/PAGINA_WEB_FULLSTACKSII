import SearchBar from "../SearchBar/SearchBar";
import FilterSidebar from "../FilterSidebar/FilterSidebar";

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
    <div className="card bg-dark border-primary">
      <div className="card-body">
        {/* Buscar + Ordenar */}
        <div className="row g-3 align-items-center mb-3">
          <div className="col-12 col-lg">
            <SearchBar onSearch={onSearch} />
          </div>
          <div className="col-12 col-md-auto">
            <label htmlFor="sort-by" className="form-label mb-0 me-2">
              Ordenar por:
            </label>
            <select
              id="sort-by"
              value={sortOption}
              onChange={(e) => onChangeSort(e.target.value)}
              className="form-select form-select-sm bg-dark text-white border-secondary"
            >
              <option value="default">Relevancia</option>
              <option value="price-asc">Precio: Más barato</option>
              <option value="price-desc">Precio: Más caro</option>
              <option value="name-asc">Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Categorías / otros filtros */}
        <FilterSidebar />
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useProductStore } from "../../context/ProductsContext"; // 🎯 Importar el contexto de productos
import FeaturedSection from "../../components/sections/FeaturedSection/FeaturedSection";
const logoPage = "/imgs/elden-ring-banner.jpg";
import HeroBanner from "../../components/sections/HeroBanner/HeroBanner";
import styles from "./Home.module.css";

export default function Home() {
  // 🎯 Reemplazamos la importación síncrona por el hook del contexto
  const { state } = useProductStore();
  const { products, isLoading } = state;

  // 🎯 Filtramos los productos de la API para obtener las ofertas
  const ofertas = products.filter((p) => p.offer).slice(0, 8); // Limitar a 8 ofertas

  // 🎯 Función helper para replicar la lógica antigua de featuredByCategory,
  // usando los datos de la API en lugar de db.ts
  const getFeaturedByCategory = (category: string, limit: number) => {
    // 1. Filtrar por categoría
    // ❌ CORRECCIÓN CRÍTICA: Se añade (p.category ?? []) para evitar que .includes() falle
    // si p.category es undefined (que es la causa del TypeError).
    const list = products.filter((p) =>
      (p.categories ?? []).includes(category)
    );

    // 2. Aplicar lógica de destacados/ofertas (similar a la lógica de db.ts)
    const featured = list.filter((p) => p.featured === true);
    const fallbackOffers = featured.length
      ? featured
      : list.filter((p) => p.offer === true);

    const base =
      featured.length || fallbackOffers.length
        ? featured.length
          ? featured
          : fallbackOffers
        : list;

    return base.slice(0, limit);
  };

  // ------------------------------------

  if (isLoading) {
    // Si aún estamos cargando los productos de la API, mostramos un loader
    return <div className={styles.loading}>Cargando datos de la tienda...</div>;
  }

  return (
    <div className={styles.home}>
      {/* HERO BANNER */}
      <HeroBanner
        imgSrc={logoPage}
        title="LEVEL UP YOUR"
        highlight="GAMING"
        subtitle="Los mejores juegos, hardware y accesorios para verdaderos gamers"
        ctaText="Explorar catálogo"
        ctaHref="/products"
        height="40vh"
        minHeight="260px"
        objectPosition="center"
      />

      {/* 🔥 OFERTAS EN EL HOME */}
      <section className={`container ${styles.section}`}>
        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className={styles.sectionTitle}>🔥 Ofertas especiales</h2>
          <Link to="/products" className="btn btn-outline-primary btn-sm">
            Ver catálogo
          </Link>
        </div>

        <div className="row g-4 mb-4">
          {ofertas.length > 0 ? ( // 🎯 Usamos el operador ternario para mostrar los productos o el mensaje
            ofertas.map((p) => (
              <article key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 bg-dark text-white border-primary position-relative">
                  {p.offer && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      OFERTA
                    </span>
                  )}
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="card-img-top"
                      style={{ objectFit: "cover", maxHeight: 180 }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{p.name}</h5>
                    {p.description && (
                      <p className="card-text text-secondary small mb-2">
                        {p.description}
                      </p>
                    )}
                    <p className="fw-bold text-success mt-auto mb-0">
                      ${(p.price ?? 0).toLocaleString("es-CL")}
                    </p>
                    <Link
                      to={`/products/${p.id}`}
                      className="btn btn-primary mt-2"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-muted mb-0">
              No hay productos en oferta por ahora.
            </p>
          )}
        </div>

        {/* 🎮 SECCIONES DESTACADAS */}
        <FeaturedSection
          title="Consolas destacadas"
          items={getFeaturedByCategory("Consolas", 8)} // 🎯 Uso de la función helper
          seeAllHref={`/products?category=${encodeURIComponent("Consolas")}`}
        />
        <FeaturedSection
          title="PCs destacadas"
          items={getFeaturedByCategory("PCs", 8)} // 🎯 Uso de la función helper
          seeAllHref={`/products?category=${encodeURIComponent("PCs")}`}
        />
        <FeaturedSection
          title="Juegos destacados"
          items={getFeaturedByCategory("Juegos", 8)} // 🎯 Uso de la función helper
          seeAllHref={`/products?category=${encodeURIComponent("Juegos")}`}
        />
      </section>
    </div>
  );
}

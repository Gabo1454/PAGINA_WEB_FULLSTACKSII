import { Link } from "react-router-dom";
import { products } from "../../lib/db";
import FeaturedSection from "../../components/sections/FeaturedSection/FeaturedSection";
const logoPage = "/imgs/elden-ring-banner.jpg";
import HeroBanner from "../../components/sections/HeroBanner/HeroBanner";
import styles from "./Home.module.css";

export default function Home() {
  const ofertas = products.offers();

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
          {ofertas.map((p) => (
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
          ))}

          {ofertas.length === 0 && (
            <p className="text-center text-muted mb-0">
              No hay productos en oferta por ahora.
            </p>
          )}
        </div>

        {/* 🎮 SECCIONES DESTACADAS */}
        <FeaturedSection
          title="Consolas destacadas"
          items={products.featuredByCategory("Consolas", 8)}
          seeAllHref={`/products?category=${encodeURIComponent("Consolas")}`}
        />
        <FeaturedSection
          title="PCs destacadas"
          items={products.featuredByCategory("PCs", 8)}
          seeAllHref={`/products?category=${encodeURIComponent("PCs")}`}
        />
        <FeaturedSection
          title="Juegos destacados"
          items={products.featuredByCategory("Juegos", 8)}
          seeAllHref={`/products?category=${encodeURIComponent("Juegos")}`}
        />
      </section>
    </div>
  );
}

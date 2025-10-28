// src/pages/Home/Home.tsx
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import logoPage from "../Home/assents/elden-ring-slider-banner.webp";
import { products } from "../../data/db";
import FeaturedSection from "../../components/FeaturedSection/FeaturedSection";

export default function Home() {
  const ofertas = products.offers();

  return (
    // ⬇️ ANTES: <main className={styles.home}>
    <div className={styles.home}>
      {/* HERO BANNER */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <img
            src={logoPage}
            alt="Elden Ring Banner"
            className={styles.bannerImage}
          />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            LEVEL UP YOUR <span className={styles.highlight}>GAMING</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Los mejores juegos, hardware y accesorios para verdaderos gamers
          </p>
          <a href="/products" className={styles.ctaButton}>
            Explorar catálogo
          </a>
        </div>
      </section>

      {/* OFERTAS EN EL HOME */}
      <section className={`container ${styles.section}`}>
        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className={styles.sectionTitle}>🔥 Ofertas especiales</h2>
          <Link to="/products" className="btn btn-outline-primary btn-sm">
            Ver catálogo
          </Link>
        </div>
        {/* añade margen inferior a la grilla */}
        <div className="row g-4 mb-4">
          {ofertas.map((p) => (
            <article key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className={`card h-100 bg-dark text-white border-primary position-relative ${styles.cardGlow}`}
              >
                {p.offer && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                    OFERTA
                  </span>
                )}
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="card-img-top"
                    style={{ objectFit: "cover", maxHeight: 180 }}
                  />
                ) : null}

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
        {/*dentro del return, después de OFERTAS:*/}
        <FeaturedSection
          title="Consolas destacadas"
          items={products.featuredByCategory("Consolas", 8)}
          seeAllHref="/products?category=Consolas"
        />
        <FeaturedSection
          title="PCs destacadas"
          items={products.featuredByCategory("PCs", 8)}
          seeAllHref="/products?category=PCs"
        />
        <FeaturedSection
          title="Juegos destacados"
          items={products.featuredByCategory("Juegos", 8)}
          seeAllHref="/products?category=Juegos"
        />
      </section>
    </div>
  );
}

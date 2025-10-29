// src/components/FeaturedSection/FeaturedSection.tsx
import { Link } from "react-router-dom";
import styles from "./FeaturedSection.module.css";
import type { Product } from "../../../types/products";

type Props = {
  title: string;
  items: Product[];
  seeAllHref?: string; // ej: /products?category=Consolas
  emptyText?: string; // texto si no hay items
};

export default function FeaturedSection({
  title,
  items,
  seeAllHref,
  emptyText = "No hay productos disponibles.",
}: Props) {
  return (
    <section className={`container ${styles.section}`}>
      <div className="d-flex justify-content-between align-items-end mb-3">
        <h2 className={styles.sectionTitle}>{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="btn btn-outline-primary btn-sm">
            Ver todo
          </Link>
        )}
      </div>

      <div className="row g-4">
        {items.length === 0 && (
          <p className="text-center text-muted mb-0">{emptyText}</p>
        )}

        {items.map((p) => (
          <article key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div
              className={`card h-100 bg-dark text-white border-primary position-relative ${styles.cardGlow}`}
            >
              {p.offer && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                  OFERTA
                </span>
              )}

              {p.image && (
                <img
                  src={p.image}
                  alt={p.name ?? p.name ?? "Producto"}
                  className="card-img-top"
                  style={{ objectFit: "cover", maxHeight: 180 }}
                  loading="lazy"
                />
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{p.name ?? p.name}</h5>
                {p.description && (
                  <p className="card-text text-secondary small mb-2">
                    {p.description}
                  </p>
                )}
                <p className="fw-bold text-success mt-auto mb-0">
                  ${(p.price ?? 0).toLocaleString("es-CL")}
                </p>
                <Link to={`/products/${p.id}`} className="btn btn-primary mt-2">
                  Ver detalle
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

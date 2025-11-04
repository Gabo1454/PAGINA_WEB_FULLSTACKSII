// src/pages/Offers/Offers.tsx
import { products } from "../../lib/db";
import { Link } from "react-router-dom";
import styles from "./Offers.module.css"; // ✅ Importa el CSS modular

export default function Offers() {
  const list = products.offers();

  return (
    <div className="container py-4 text-white">
      <h1 className="text-center mb-4 fw-bold">🔥 Ofertas especiales</h1>

      <div className="row g-4">
        {list.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div
              className={`card h-100 bg-dark text-white border-primary position-relative`}
            >
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
                  loading="lazy"
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

                {/* ✅ Aplica la clase del botón verde */}
                <Link
                  to={`/products/${p.id}`}
                  className={`${styles.detailBtn} mt-2`}
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-center text-muted mb-0">
            No hay productos en oferta por ahora.
          </p>
        )}
      </div>
    </div>
  );
}

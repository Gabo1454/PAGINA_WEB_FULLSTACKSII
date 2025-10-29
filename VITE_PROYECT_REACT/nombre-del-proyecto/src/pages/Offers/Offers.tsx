// src/pages/Offers/Offers.tsx
import { products } from "../../lib/db";
import { Link } from "react-router-dom";

export default function Offers() {
  const list = products.offers(); // 👈 Aquí usas la “BD”

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Ofertas</h1>
      <div className="row g-3">
        {list.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 bg-dark text-white border-primary">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                {p.description && (
                  <p className="card-text mb-2">{p.description}</p>
                )}
                <p className="fw-bold text-success mt-auto">
                  ${(p.price ?? 0).toLocaleString("es-CL")}
                </p>
                <Link to={`/products/${p.id}`} className="btn btn-primary mt-2">
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center">No hay productos en oferta.</p>
        )}
      </div>
    </div>
  );
}

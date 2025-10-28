import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products as productsRepo } from "../../data/db";
import { useProductStore } from "../../context/ProductContext";
import type { Product } from "../../data/types";
import styles from "./ProductDetail.module.css";

const pesoCL = (n = 0) =>
  n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

const fallbackImg = "/imgs/placeholder.png";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const safeId = useMemo(() => decodeURIComponent((id ?? "").trim()), [id]);
  const navigate = useNavigate();
  const { state, dispatch } = useProductStore();
  const [qty, setQty] = useState(1);

  const product = useMemo<Product | undefined>(() => {
    if (!safeId) return undefined;
    const direct = productsRepo.get(safeId);
    if (direct) return direct;

    const lo = safeId.toLowerCase();
    const all = state.products;
    return (
      all.find((p) => String(p.id) === safeId) ||
      all.find((p) => String(p.id).toLowerCase() === lo) ||
      all.find((p) => String(p.id).trim() === safeId)
    );
  }, [safeId, state.products]);

  if (!product) {
    return (
      <div className="container-fluid px-4 py-5 text-white">
        <div className="alert alert-warning bg-transparent border-warning text-warning">
          Producto no encontrado.
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
      </div>
    );
  }

  const inStock = (product.stock ?? 0) > 0;

  const addToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId: product.id, quantity: qty },
    });
  };

  return (
    <div className="container-fluid px-4 py-4 text-white">
      <nav className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="link-primary">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="link-primary">
              Productos
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card bg-dark border-primary position-relative">
            {product.offer && (
              <span
                className={`badge bg-danger position-absolute top-0 start-0 m-2 ${styles.badgeOffer}`}
              >
                OFERTA
              </span>
            )}

            <div
              className={`ratio ${styles.imageBox}`}
              role="button"
              data-bs-toggle="modal"
              data-bs-target="#imageZoomModal"
              aria-label="Ver imagen en grande"
            >
              <img
                src={product.image || fallbackImg}
                alt={product.name}
                className={styles.imageContain}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackImg;
                }}
              />
              <span className={styles.zoomHint}>Click para ampliar</span>
            </div>
          </div>

          <div
            className="modal fade"
            id="imageZoomModal"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content bg-black border border-primary">
                <div className="modal-body p-0">
                  <img
                    src={product.image || fallbackImg}
                    alt={product.name}
                    className="w-100"
                    style={{ objectFit: "contain", maxHeight: "85vh" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImg;
                    }}
                  />
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <h1 className="h3 mb-2">{product.name}</h1>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="fs-4 fw-bold text-success">
              {pesoCL(product.price ?? 0)}
            </span>
            {!inStock && <span className="badge bg-secondary">Sin stock</span>}
          </div>

          {product.description && (
            <p className="text-secondary">{product.description}</p>
          )}

          <div className="d-flex align-items-center gap-3 my-3">
            <label className="form-label mb-0">Cantidad:</label>
            <input
              type="number"
              min={1}
              max={Math.max(product.stock ?? 1, 1)}
              value={qty}
              onChange={(e) => {
                const n = Number(e.target.value || 1);
                const max = product.stock ?? 1;
                setQty(Math.max(1, Math.min(n, max)));
              }}
              className="form-control"
              style={{ width: 100 }}
            />
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={addToCart}
              disabled={!inStock}
            >
              🛒 Añadir al carrito
            </button>
            <Link to="/products" className="btn btn-outline-light">
              ← Volver al catálogo
            </Link>
          </div>

          <div className="mt-4 small text-secondary">
            {inStock
              ? `Stock disponible: ${product.stock}`
              : "Este producto está temporalmente agotado."}
          </div>
        </div>
      </div>
    </div>
  );
}

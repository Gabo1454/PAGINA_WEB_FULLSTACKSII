// src/pages/Products/ProductDetail/ProductDetail.tsx
import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// ELIMINADA: La importación directa de productos (products as productsRepo)
import { useProductStore } from "../../context/ProductsContext";
import { useCart } from "../../context/CartContext"; // 💡 Importación asumida de tu contexto de carrito
import type { Product } from "../../types/products";
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
  const { state } = useProductStore();
  // Asumimos que useCart expone addItem para agregar productos
  const { addToCart: cartAddToCart } = useCart() ?? { addToCart: () => {} };
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const product = useMemo<Product | undefined>(() => {
    if (!safeId) return undefined;

    // 💡 CORRECCIÓN: Búsqueda solo en la lista del contexto (más consistente)
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

  const handleAddToCart = () => {
    // 🎯 CORRECCIÓN: Llamar a la función del contexto usando el ID del producto (como string) y la cantidad.
    // cartAddToCart llama internamente a tu API /api/cart/add.
    cartAddToCart(String(product.id), qty);

    // ✅ Toast 3s
    setShowToast(true);
    window.clearTimeout((handleAddToCart as any)._t);
    (handleAddToCart as any)._t = window.setTimeout(
      () => setShowToast(false),
      3000
    );
  };

  return (
    <div className="container-fluid px-4 py-5 text-white">
      {/* 🧭 MIGAS DE PAN */}
      <nav className="mb-4">
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

      <div className="row g-5 align-items-start">
        {/* 📸 IMAGEN DEL PRODUCTO */}
        <div className="col-12 col-lg-6">
          <div className="card bg-dark border-primary position-relative p-3">
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
        </div>

        {/* 🧾 INFORMACIÓN DEL PRODUCTO */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-start">
          {/* 🏷️ Nombre */}
          <h1 className="display-6 fw-bold mb-3 text-light">{product.name}</h1>

          {/* 💰 Precio */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="fs-3 fw-bold text-success">
              {pesoCL(product.price ?? 0)}
            </span>
            {!inStock && (
              <span className="badge bg-secondary fs-6">Sin stock</span>
            )}
          </div>

          {/* 📝 Descripción */}
          {product.description && (
            <p className="text-secondary fs-5 mb-4">{product.description}</p>
          )}

          {/* 🔢 Cantidad */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <label className="form-label mb-0 fw-semibold">Cantidad:</label>
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
              className="form-control text-center"
              style={{ width: "100px" }}
            />
          </div>

          {/* 🛒 Botones */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            <button
              className="btn btn-primary btn-lg fw-bold"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              🛒 Añadir al carrito
            </button>

            <Link
              to="/products"
              className="btn btn-outline-light btn-lg fw-semibold"
            >
              ← Volver al catálogo
            </Link>
          </div>

          {/* 🧮 Stock */}
          <div className="small text-secondary mt-2">
            {inStock
              ? `Stock disponible: ${product.stock}`
              : "Este producto está temporalmente agotado."}
          </div>
        </div>
      </div>

      {/* 🔍 MODAL ZOOM (se mantiene) */}
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

      {/* ✅ TOAST flotante (se mantiene) */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1050 }}
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className={`toast align-items-center text-bg-success border-0 ${
            showToast ? "show" : "hide"
          }`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              ✅ <strong>{product.name}</strong> agregado al carrito.
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

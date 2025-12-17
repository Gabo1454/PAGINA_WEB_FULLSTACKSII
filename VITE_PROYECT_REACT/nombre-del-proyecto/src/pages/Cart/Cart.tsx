// src/pages/Cart/Cart.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../../context/ProductsContext";
import { useCart } from "../../context/CartContext";
import styles from "./Cart.module.css";

// Función para formatear a pesos chilenos
const pesoCL = (n: number) =>
  n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

export default function Cart() {
  const { state } = useProductStore();
  const {
    cart,
    addToCart: cartAddToCart,
    removeFromCart: cartRemoveFromCart,
    clearCart: cartClearCart,
    loading: cartLoading,
  } = useCart();

  const navigate = useNavigate();
  const all = state.products ?? [];

  // ==== Mapear items del carrito con info real del producto ====
  const items = cart.items
    .map((it) => {
      const pid = Number(it.productId);
      const p = all.find((pp) => pp.id === pid);
      if (!p) return null;

      const price = p.price ?? 0;
      const stock = p.stock ?? 0;

      return {
        id: String(p.id),
        name: p.name,
        price,
        image: p.image || "/imgs/placeholder.png",
        stock,
        qty: it.qty, // Cantidad en el carrito
        subtotal: price * it.qty, // Subtotal por producto
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // ==== Total del carrito ====
  const total =
    cart.total > 0 ? cart.total : items.reduce((acc, x) => acc + x.subtotal, 0);

  // ==== Función para actualizar cantidad de un producto ====
  const setQty = async (productId: string, qty: number) => {
    const safe = Math.max(0, Math.floor(qty));

    const current =
      cart.items.find((i) => String(i.productId) === String(productId))?.qty ??
      0;

    if (safe === current) return;

    const delta = safe - current;

    if (safe === 0) {
      await cartRemoveFromCart(productId); // eliminar si qty = 0
      return;
    }

    if (delta > 0) {
      await cartAddToCart(productId, delta); // agregar diferencia
    } else {
      // si disminuye, eliminamos y volvemos a agregar la cantidad correcta
      await cartRemoveFromCart(productId);
      if (safe > 0) await cartAddToCart(productId, safe);
    }
  };

  // Incrementar y decrementar cantidad
  const inc = (productId: string, current: number, stock: number) => {
    if (current >= stock) return;
    setQty(productId, current + 1);
  };

  const dec = (productId: string, current: number) => {
    setQty(productId, Math.max(0, current - 1));
  };

  // Eliminar producto
  const remove = async (productId: string) => {
    await cartRemoveFromCart(productId);
  };

  // Vaciar carrito
  const clear = async () => {
    if (items.length === 0) return;
    if (confirm("¿Vaciar el carrito?")) await cartClearCart();
  };

  // ==== Cupón y totales ====
  const [coupon, setCoupon] = useState("");
  const [couponOk, setCouponOk] = useState(false);

  const discountAmount = useMemo(
    () => (couponOk ? Math.floor(total * 0.1) : 0),
    [couponOk, total]
  );

  const grandTotal = Math.max(0, total - discountAmount);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponOk(coupon.trim().toUpperCase() === "LEVELUP10");
  };

  // ==== Renderizado si el carrito está vacío ====
  if (items.length === 0) {
    return (
      <section className="container-fluid px-4 py-5 text-white">
        <h1 className="h4 mb-3">Carrito</h1>
        <div className="alert alert-info bg-transparent border-info text-info">
          Tu carrito está vacío.
        </div>
        <Link to="/products" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </section>
    );
  }

  // ==== Renderizado del carrito con items ====
  return (
    <section className="container-fluid px-4 py-4 text-white">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Carrito</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light"
            onClick={() => navigate(-1)}
            disabled={cartLoading}
          >
            ← Seguir comprando
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={clear}
            disabled={cartLoading}
          >
            Vaciar
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Lista de items */}
        <div className="col-12 col-lg-8">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 80 }}></th>
                  <th>Producto</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center" style={{ width: 160 }}>
                    Cantidad
                  </th>
                  <th className="text-end">Subtotal</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{ width: 64, height: 64, objectFit: "contain" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/imgs/placeholder.png";
                        }}
                      />
                    </td>
                    <td>
                      <Link to={`/products/${it.id}`} className="link-primary">
                        {it.name}
                      </Link>
                      {it.stock <= 3 && it.stock > 0 && (
                        <span className="ms-2 badge bg-warning text-dark">
                          Poco stock
                        </span>
                      )}
                      {it.stock === 0 && (
                        <span className="ms-2 badge bg-secondary">
                          Sin stock
                        </span>
                      )}
                    </td>
                    <td className="text-end">{pesoCL(it.price)}</td>
                    <td className="text-center">
                      {/* Botones para cambiar cantidad */}
                      <div className={styles.qtyButtons}>
                        <button
                          className={styles.qtyBtn}
                          type="button"
                          onClick={() => dec(it.id, it.qty)}
                          title="Disminuir"
                          disabled={cartLoading || it.qty <= 0}
                        >
                          −
                        </button>
                        <span className={styles.qtyValue}>{it.qty}</span>
                        <button
                          className={styles.qtyBtn}
                          type="button"
                          onClick={() => inc(it.id, it.qty, it.stock)}
                          disabled={it.qty >= it.stock || cartLoading}
                          title="Aumentar"
                        >
                          +
                        </button>
                      </div>

                      {it.stock > 0 && (
                        <div className="small text-secondary mt-1">
                          Stock: {it.stock}
                        </div>
                      )}
                    </td>
                    <td className="text-end fw-bold text-success">
                      {/* Subtotal por producto */}
                      {pesoCL(it.subtotal)}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={() => remove(it.id)}
                        title="Eliminar"
                        disabled={cartLoading}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen / Panel derecho */}
        <div className="col-12 col-lg-4">
          <div className="card bg-dark border-primary">
            <div className="card-body">
              <h2 className="h5 text-center mb-3">Resumen</h2>

              {/* Cupón */}
              <form onSubmit={applyCoupon} className="mb-3">
                <label htmlFor="coupon" className="form-label mb-2">
                  Cupón de descuento
                </label>
                <div className="input-group">
                  <input
                    id="coupon"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="LEVELUP10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={cartLoading}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="submit"
                    disabled={cartLoading}
                  >
                    Aplicar
                  </button>
                </div>

                {couponOk && (
                  <small className="text-success d-block mt-1">
                    ✅ Cupón aplicado: -10%
                  </small>
                )}

                {!couponOk && coupon.trim() !== "" && (
                  <small className="text-secondary d-block mt-1">
                    Tip: usa <strong>LEVELUP10</strong>
                  </small>
                )}
              </form>

              {/* Totales */}
              <div className="d-flex justify-content-between my-2">
                <span>Items</span>
                <span>{cart.items.reduce((acc, i) => acc + i.qty, 0)}</span>
              </div>

              <div className="d-flex justify-content-between my-2">
                <span>Subtotal</span>
                <span className="fw-semibold">{pesoCL(total)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="d-flex justify-content-between my-2 text-success">
                  <span>Descuento</span>
                  <span>-{pesoCL(discountAmount)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between my-2">
                <span>Envío</span>
                <span className="text-secondary">Calculado en Checkout</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between my-2">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5 text-success">
                  {pesoCL(grandTotal)}
                </span>
              </div>

              {/* Botones */}
              <div className="d-grid mt-3">
                <Link
                  to="/checkout"
                  className="btn btn-primary"
                  style={{
                    pointerEvents:
                      cartLoading || items.length === 0 ? "none" : "auto",
                  }}
                >
                  Ir a pagar
                </Link>
              </div>

              <div className="d-grid mt-2">
                <Link to="/products" className="btn btn-outline-light">
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>

          <p className="small text-secondary mt-3 text-center mb-0">
            * Los montos finales pueden variar en Checkout según dirección y
            courier.
          </p>
        </div>
      </div>
    </section>
  );
}

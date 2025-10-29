import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../../context/ProductsContext";
import { products as productsRepo } from "../../lib/db";

const pesoCL = (n: number) =>
  n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

export default function Cart() {
  const { state, dispatch } = useProductStore();
  const navigate = useNavigate();

  // Traemos todos los productos para cruzar con el carrito
  const all = productsRepo.all();

  const items = state.cart
    .map((it) => {
      const p = all.find((pp) => pp.id === it.productId);
      if (!p) return null;

      const price = p.price ?? 0; //  asegura número
      const stock = p.stock ?? 0; //  asegura número

      return {
        id: p.id,
        name: p.name,
        price,
        image: p.image || "/imgs/placeholder.png",
        stock,
        qty: it.qty,
        subtotal: price * it.qty,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const total = items.reduce((acc, x) => acc + x.subtotal, 0);

  const setQty = (productId: string, qty: number) => {
    const safe = Math.max(0, Math.floor(qty));
    // 👉 ajusta el type según tu reducer si usas otro nombre:
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId, quantity: safe },
    });
  };

  const inc = (productId: string, current: number, stock: number) => {
    if (current >= stock) return;
    setQty(productId, current + 1);
  };

  const dec = (productId: string, current: number) => {
    const next = current - 1;
    if (next <= 0) {
      dispatch({ type: "REMOVE_ITEM_FROM_CART", payload: { productId } });
    } else {
      setQty(productId, next);
    }
  };

  const remove = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM_FROM_CART", payload: { productId } });
  };

  const clear = () => {
    if (items.length === 0) return;
    if (confirm("¿Vaciar el carrito?")) {
      dispatch;
    }
  };

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

  return (
    <section className="container-fluid px-4 py-4 text-white">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Carrito</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light"
            onClick={() => navigate(-1)}
          >
            ← Seguir comprando
          </button>
          <button className="btn btn-outline-danger" onClick={clear}>
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
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Cantidad"
                      >
                        <button
                          className="btn btn-outline-light"
                          onClick={() => dec(it.id, it.qty)}
                          title="Disminuir"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={Math.max(it.stock, 0)}
                          value={it.qty}
                          onChange={(e) => {
                            const n = Number(e.target.value || 0);
                            if (Number.isNaN(n)) return;
                            const capped = Math.min(
                              Math.max(0, n),
                              Math.max(it.stock, 0)
                            );
                            setQty(it.id, capped);
                          }}
                          className="form-control text-center"
                          style={{ width: 70 }}
                        />
                        <button
                          className="btn btn-outline-light"
                          onClick={() => inc(it.id, it.qty, it.stock)}
                          disabled={it.qty >= it.stock}
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
                      {pesoCL(it.subtotal)}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => remove(it.id)}
                        title="Eliminar"
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

        {/* Resumen */}
        <div className="col-12 col-lg-4">
          <div className="card bg-dark border-primary">
            <div className="card-body">
              <h2 className="h5">Resumen</h2>
              <div className="d-flex justify-content-between my-2">
                <span>Items</span>
                <span>{state.cart.reduce((acc, i) => acc + i.qty, 0)}</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span>Subtotal</span>
                <span className="fw-semibold">{pesoCL(total)}</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span>Envío</span>
                <span className="text-secondary">Calculado en Checkout</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between my-2">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5 text-success">
                  {pesoCL(total)}
                </span>
              </div>
              <div className="d-grid mt-3">
                <Link to="/checkout" className="btn btn-primary">
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

          <div className="small text-secondary mt-3">
            * Si cambias cantidades aquí, el total se actualiza al instante.
          </div>
        </div>
      </div>
    </section>
  );
}

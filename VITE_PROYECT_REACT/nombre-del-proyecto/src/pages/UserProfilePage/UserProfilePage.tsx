// src/pages/UserProfilePage/UserProfilePage.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./UserProfilePage.module.css";

export default function UserProfilePage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);

  if (!user) return <Navigate to="/login" replace />;

  // Iniciales del avatar
  const initials =
    user.fullName && user.fullName.trim().length > 0
      ? user.fullName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join("")
      : (user.username?.[0] || "?").toUpperCase();

  // Cargar órdenes del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error obteniendo órdenes:", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* Avatar */}
        <div className={styles.avatarCircle}>
          <span className={styles.avatarInitials}>{initials}</span>
        </div>

        <h1 className={styles.title}>{user.fullName || user.username}</h1>
        <p className={styles.subtitle}>Perfil de usuario Level-Up Gamer</p>

        {/* Info del usuario */}
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Usuario</span>
            <span className={styles.value}>@{user.username}</span>
          </div>

          {user.role && (
            <div className={styles.infoItem}>
              <span className={styles.label}>Rol</span>
              <span
                className={`${styles.badge} ${
                  user.role === "ROLE_ADMIN"
                    ? styles.badgeAdmin
                    : styles.badgeUser
                }`}
              >
                {user.role === "ROLE_ADMIN" ? "Administrador" : "Cliente"}
              </span>
            </div>
          )}
        </div>

        <div className={styles.metaBox}>
          <p className={styles.metaText}>
            Esta cuenta está autenticada mediante <strong>JWT</strong> y tus
            compras quedan asociadas para que puedas revisarlas aquí.
          </p>
        </div>

        {/* ==============================
            HISTORIAL DE COMPRAS
           ============================== */}
        <h2 className={styles.sectionTitle}>Mis compras</h2>

        {orders.length === 0 ? (
          <p className={styles.noOrders}>Aún no has realizado compras.</p>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((o: any) => (
              <div key={o.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>Orden #{o.id}</span>
                  <span
                    className={
                      o.status === "COMPLETED"
                        ? styles.orderStatusCompleted
                        : styles.orderStatusPending
                    }
                  >
                    {o.status === "COMPLETED" ? "Completada" : "Pendiente"}
                  </span>
                </div>

                <div className={styles.orderDetails}>
                  <p>
                    <strong>Total:</strong> ${o.total}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>

                <details className={styles.orderItems}>
                  <summary>Ver productos</summary>
                  {o.items.map((item: any) => (
                    <div key={item.id} className={styles.orderItem}>
                      <span>{item.productName}</span>
                      <span>x{item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </details>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => (window.location.href = "/cart")}
          >
            Ver mi carrito
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => (window.location.href = "/products")}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </section>
  );
}

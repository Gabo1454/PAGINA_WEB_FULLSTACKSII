// src/pages/UserProfilePage/UserProfilePage.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./UserProfilePage.module.css";

export default function UserProfilePage() {
  const { user } = useAuth();

  // Si no hay sesión, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const initials =
    user.fullName && user.fullName.trim().length > 0
      ? user.fullName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join("")
      : (user.username?.[0] || "?").toUpperCase();

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* Avatar con iniciales */}
        <div className={styles.avatarCircle}>
          <span className={styles.avatarInitials}>{initials}</span>
        </div>

        {/* Encabezado */}
        <h1 className={styles.title}>{user.fullName || user.username}</h1>
        <p className={styles.subtitle}>Perfil de usuario Level-Up Gamer</p>

        {/* Info principal */}
        <div className={styles.infoGrid}>
          {/* Usuario */}
          <div className={styles.infoItem}>
            <span className={styles.label}>Usuario</span>
            <span className={styles.value}>@{user.username}</span>
          </div>

          {/* Rol (si existe) */}
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

        {/* Meta / texto extra */}
        <div className={styles.metaBox}>
          <p className={styles.metaText}>
            Esta cuenta está autenticada mediante <strong>JWT</strong> y
            protegida con roles en el backend. Todos tus movimientos en el
            carrito y las órdenes se asocian a este perfil.
          </p>
        </div>

        {/* Acciones */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            Ver mi carrito
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </section>
  );
}

import { useLocation, Link } from "react-router-dom";
import styles from "./PaymentSuccess.module.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const { orderId, customerName, email } = location.state || {};

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>🎉</div>
        <h1 className={styles.title}>¡Pago Exitoso!</h1>
        <p className={styles.message}>
          Gracias por tu compra, <strong>{customerName || "cliente"}</strong>.
        </p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Número de Orden:</span>
            <span className={styles.detailValue}>
              {orderId || `ORD-${Date.now()}`}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email:</span>
            <span className={styles.detailValue}>
              {email || "No proporcionado"}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Fecha:</span>
            <span className={styles.detailValue}>
              {new Date().toLocaleDateString("es-ES")}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Estado:</span>
            <span className={styles.statusSuccess}>✅ Confirmado</span>
          </div>
        </div>

        <div className={styles.confirmation}>
          <p>
            📧 Hemos enviado un correo de confirmación con los detalles de tu
            pedido.
          </p>
          <p>🕒 Recibirás una actualización cuando tu pedido sea enviado.</p>
        </div>

        <div className={styles.actions}>
          <Link to="/products" className={styles.continueBtn}>
            🛒 Seguir Comprando
          </Link>
          <Link to="/orders" className={styles.ordersBtn}>
            📦 Ver Mis Pedidos
          </Link>
          <Link to="/" className={styles.homeBtn}>
            🏠 Ir al Inicio
          </Link>
        </div>

        <div className={styles.support}>
          <p>
            ¿Tienes preguntas?{" "}
            <Link to="/contact" className={styles.contactLink}>
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

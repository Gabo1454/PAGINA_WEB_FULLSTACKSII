// src/pages/PaymentFailed/PaymentFailed.tsx
import { useLocation, Link } from "react-router-dom";
import styles from "./PaymentFailed.module.css";

// Definición de tipo para location.state (buena práctica de TypeScript)
type FailedState = {
  error?: string;
  retryUrl?: string;
  customerName?: string; // Recibir el nombre
  suggestion?: string; // Recibir la sugerencia específica del error
};

export default function PaymentFailed() {
  const location = useLocation();
  // Desestructuramos todos los posibles campos
  const { error, retryUrl, customerName, suggestion } =
    (location.state as FailedState) || {};

  // Mensaje de error a mostrar (usamos el del estado o un fallback genérico)
  const displayError =
    error ||
    "Ha ocurrido un error inesperado al procesar tu pago. Te recomendamos intentar nuevamente.";

  // Sugerencia a mostrar (usamos la del estado o una lista genérica)
  const displaySuggestion =
    suggestion ||
    "Por favor, verifica los detalles de tu tarjeta e intenta nuevamente. Si el problema persiste, contacta a tu banco.";

  return (
    <div className={styles.failedContainer}>
      <div className={styles.failedCard}>
        <div className={styles.failedIcon}>⚠️</div>
        <h1 className={styles.title}>Pago Fallido</h1>

        <p className={styles.greetingMessage}>
          Lo sentimos, <strong>{customerName || "cliente"}</strong>. No pudimos
          completar tu pedido.
        </p>

        <div className={styles.errorSection}>
          <div className={styles.errorIcon}>💳</div>
          <p className={styles.errorMessage}>**Error:** {displayError}</p>
        </div>

        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Sugerencia</h3>
          <p className={styles.suggestionText}>{displaySuggestion}</p>

          <h3 className={styles.suggestionsTitle}>Verificaciones rápidas:</h3>
          <ul className={styles.suggestionsList}>
            <li>✅ Verifica que los datos de tu tarjeta sean correctos</li>
            <li>✅ Asegúrate de tener fondos suficientes</li>
            <li>✅ Revisa que la fecha de expiración sea válida</li>
            <li>✅ Intenta con otro método de pago</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link to={retryUrl || "/checkout"} className={styles.retryBtn}>
            🔄 Reintentar Pago
          </Link>

          <Link to="/cart" className={styles.cartBtn}>
            🛒 Volver al Carrito
          </Link>

          <Link to="/" className={styles.homeBtn}>
            🏠 Ir al Inicio
          </Link>
        </div>

        <div className={styles.support}>
          <p>
            ¿Necesitas ayuda?{" "}
            <Link to="/contact" className={styles.contactLink}>
              Contáctanos
            </Link>{" "}
            o llama al <strong className={styles.phone}>+1 800-LEVEL-UP</strong>
          </p>
        </div>

        <div className={styles.securityNote}>
          <p>
            🔒 Tu información está segura. No almacenamos datos de tu tarjeta.
          </p>
        </div>
      </div>
    </div>
  );
}

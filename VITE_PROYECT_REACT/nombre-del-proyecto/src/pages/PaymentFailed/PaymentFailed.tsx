import { useLocation, Link } from "react-router-dom";
import styles from "./PaymentFailed.module.css";

export default function PaymentFailed() {
  const location = useLocation();
  const { error, retryUrl } = location.state || {};

  const errorMessages = {
    "El pago fue rechazado por el banco":
      "Tu banco ha rechazado la transacción. Por favor, verifica los fondos o contacta con tu entidad bancaria.",
    "Error al procesar el pago":
      "Ha ocurrido un error inesperado. Por favor, intenta nuevamente en unos minutos.",
    default:
      "Ha ocurrido un problema al procesar tu pago. Te recomendamos intentar nuevamente.",
  };

  const getErrorMessage = () => {
    return (
      errorMessages[error as keyof typeof errorMessages] ||
      errorMessages.default
    );
  };

  return (
    <div className={styles.failedContainer}>
      <div className={styles.failedCard}>
        <div className={styles.failedIcon}>⚠️</div>
        <h1 className={styles.title}>Pago Fallido</h1>

        <div className={styles.errorSection}>
          <div className={styles.errorIcon}>💳</div>
          <p className={styles.errorMessage}>{getErrorMessage()}</p>
        </div>

        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>¿Qué puedes hacer?</h3>
          <ul className={styles.suggestionsList}>
            <li>✅ Verifica que los datos de tu tarjeta sean correctos</li>
            <li>✅ Asegúrate de tener fondos suficientes</li>
            <li>✅ Revisa que la fecha de expiración sea válida</li>
            <li>✅ Intenta con otro método de pago</li>
            <li>✅ Contacta con tu banco si el problema persiste</li>
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

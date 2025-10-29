import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";

type CheckoutForm = {
  // Información Personal
  fullName: string;
  email: string;
  phone: string;
  dni: string;

  // Dirección
  address: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;

  // Información de Pago
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  cardType: string;

  // Términos y condiciones
  acceptTerms: boolean;
  newsletter: boolean;
};

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>();

  // Para validación de confirmación de email
  const email = watch("email");

  // Simulación de pago más realista con diferentes escenarios
  const simulatePayment = async (
    formData: CheckoutForm
  ): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const random = Math.random();

        // Diferentes escenarios de resultado
        if (random < 0.6) {
          // 60% éxito
          resolve({
            success: true,
            message: "Pago procesado exitosamente",
          });
        } else if (random < 0.75) {
          // 15% fondos insuficientes
          resolve({
            success: false,
            message: "Fondos insuficientes en la cuenta",
          });
        } else if (random < 0.85) {
          // 10% tarjeta rechazada
          resolve({
            success: false,
            message: "Tarjeta rechazada por el banco emisor",
          });
        } else if (random < 0.92) {
          // 7% límite excedido
          resolve({
            success: false,
            message: "Límite de la tarjeta excedido",
          });
        } else if (random < 0.97) {
          // 5% error de conexión
          resolve({
            success: false,
            message: "Error de conexión con el procesador de pagos",
          });
        } else {
          // 3% tarjeta vencida
          resolve({
            success: false,
            message: "Tarjeta vencida",
          });
        }
      }, 3000); // Simula 3 segundos de procesamiento
    });
  };

  // Validación personalizada para DNI/RUT chileno
  const validateDNI = (dni: string) => {
    const dniRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
    if (!dniRegex.test(dni)) {
      return "Formato de RUT inválido (Ej: 12345678-9)";
    }
    return true;
  };

  // Validación para número de tarjeta (algoritmo de Luhn)
  const validateCardNumber = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    // Verificar que sean solo números y longitud válida
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return "Número de tarjeta inválido";
    }

    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 ? true : "Número de tarjeta inválido";
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);

    try {
      const paymentResult = await simulatePayment(data);

      if (paymentResult.success) {
        navigate("/payment-success", {
          state: {
            orderId: `ORD-${Date.now()}`,
            customerName: data.fullName,
            email: data.email,
            address: `${data.address}, ${data.city}`,
            total: "45.990", // Podrías calcular esto dinámicamente
            estimatedDelivery: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("es-CL"),
          },
        });
      } else {
        navigate("/payment-failed", {
          state: {
            error: paymentResult.message,
            retryUrl: "/checkout",
            customerName: data.fullName,
            suggestion: getSuggestion(paymentResult.message),
          },
        });
      }
    } catch (error) {
      navigate("/payment-failed", {
        state: {
          error: "Error inesperado al procesar el pago",
          retryUrl: "/checkout",
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Sugerencias específicas según el error
  const getSuggestion = (error: string): string => {
    const suggestions: { [key: string]: string } = {
      "Fondos insuficientes en la cuenta":
        "Verifica el saldo de tu cuenta o intenta con otra tarjeta.",
      "Tarjeta rechazada por el banco emisor":
        "Contacta a tu banco para autorizar la transacción.",
      "Límite de la tarjeta excedido":
        "Tu tarjeta ha alcanzado su límite de crédito.",
      "Error de conexión con el procesador de pagos":
        "Intenta nuevamente en unos minutos.",
      "Tarjeta vencida": "Verifica la fecha de expiración de tu tarjeta.",
    };

    return (
      suggestions[error] ||
      "Por favor, verifica tu información e intenta nuevamente."
    );
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.title}>🎯 Finalizar Compra</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* SECCIÓN 1: Información Personal */}
        <fieldset className={styles.fieldset}>
          <legend>👤 Información Personal</legend>

          <div className={styles.formGroup}>
            <label>Nombre Completo *</label>
            <input
              type="text"
              placeholder="Juan Pérez González"
              {...register("fullName", {
                required: "Nombre completo es requerido",
                minLength: { value: 5, message: "Mínimo 5 caracteres" },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: "Solo se permiten letras y espacios",
                },
              })}
              className={errors.fullName ? styles.error : ""}
            />
            {errors.fullName && (
              <span className={styles.errorText}>
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="juan.perez@correo.com"
                {...register("email", {
                  required: "Email es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email inválido",
                  },
                })}
                className={errors.email ? styles.error : ""}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Teléfono *</label>
              <input
                type="tel"
                placeholder="+56 9 1234 5678"
                {...register("phone", {
                  required: "Teléfono es requerido",
                  pattern: {
                    value: /^[\+]?[0-9\s\-\(\)]{8,}$/,
                    message: "Número de teléfono inválido",
                  },
                })}
                className={errors.phone ? styles.error : ""}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone.message}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>RUT/DNI *</label>
            <input
              type="text"
              placeholder="12345678-9"
              {...register("dni", {
                required: "RUT es requerido",
                validate: validateDNI,
              })}
              className={errors.dni ? styles.error : ""}
            />
            {errors.dni && (
              <span className={styles.errorText}>{errors.dni.message}</span>
            )}
          </div>
        </fieldset>

        {/* SECCIÓN 2: Dirección de Envío */}
        <fieldset className={styles.fieldset}>
          <legend>🏠 Dirección de Envío</legend>

          <div className={styles.formGroup}>
            <label>Dirección Completa *</label>
            <input
              type="text"
              placeholder="Calle Principal #123, Depto 45"
              {...register("address", {
                required: "Dirección es requerida",
                minLength: { value: 10, message: "Dirección muy corta" },
              })}
              className={errors.address ? styles.error : ""}
            />
            {errors.address && (
              <span className={styles.errorText}>{errors.address.message}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Ciudad *</label>
              <input
                type="text"
                placeholder="Santiago"
                {...register("city", {
                  required: "Ciudad es requerida",
                  pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: "Solo se permiten letras",
                  },
                })}
                className={errors.city ? styles.error : ""}
              />
              {errors.city && (
                <span className={styles.errorText}>{errors.city.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Región *</label>
              <select
                {...register("region", { required: "Región es requerida" })}
                className={errors.region ? styles.error : ""}
              >
                <option value="">Selecciona una región</option>
                <option value="arica">Arica y Parinacota</option>
                <option value="tarapaca">Tarapacá</option>
                <option value="antofagasta">Antofagasta</option>
                <option value="atacama">Atacama</option>
                <option value="coquimbo">Coquimbo</option>
                <option value="valparaiso">Valparaíso</option>
                <option value="metropolitana">Metropolitana</option>
                <option value="ohiggins">Libertador B. O'Higgins</option>
                <option value="maule">Maule</option>
                <option value="nuble">Ñuble</option>
                <option value="biobio">Biobío</option>
                <option value="araucania">La Araucanía</option>
                <option value="rios">Los Ríos</option>
                <option value="lagos">Los Lagos</option>
                <option value="aysen">Aysén</option>
                <option value="magallanes">Magallanes</option>
              </select>
              {errors.region && (
                <span className={styles.errorText}>
                  {errors.region.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Código Postal *</label>
              <input
                type="text"
                placeholder="8320000"
                {...register("zipCode", {
                  required: "Código postal es requerido",
                  pattern: {
                    value: /^[0-9]{7}$/,
                    message: "Código postal inválido (7 dígitos)",
                  },
                })}
                className={errors.zipCode ? styles.error : ""}
              />
              {errors.zipCode && (
                <span className={styles.errorText}>
                  {errors.zipCode.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>País *</label>
              <input
                type="text"
                value="Chile"
                readOnly
                {...register("country", { required: true })}
                className={styles.readOnly}
              />
            </div>
          </div>
        </fieldset>

        {/* SECCIÓN 3: Información de Pago */}
        <fieldset className={styles.fieldset}>
          <legend>💳 Información de Pago</legend>

          <div className={styles.formGroup}>
            <label>Nombre en la Tarjeta *</label>
            <input
              type="text"
              placeholder="JUAN P PEREZ"
              {...register("cardholderName", {
                required: "Nombre en la tarjeta es requerido",
                pattern: {
                  value: /^[A-Z\s]+$/,
                  message: "Solo mayúsculas y espacios",
                },
              })}
              className={errors.cardholderName ? styles.error : ""}
            />
            {errors.cardholderName && (
              <span className={styles.errorText}>
                {errors.cardholderName.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Número de Tarjeta *</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              {...register("cardNumber", {
                required: "Número de tarjeta es requerido",
                validate: validateCardNumber,
              })}
              className={errors.cardNumber ? styles.error : ""}
            />
            {errors.cardNumber && (
              <span className={styles.errorText}>
                {errors.cardNumber.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Fecha Expiración *</label>
              <input
                type="text"
                placeholder="MM/AA"
                {...register("expiryDate", {
                  required: "Fecha de expiración es requerida",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: "Formato MM/AA",
                  },
                  validate: (value) => {
                    const [month, year] = value.split("/");
                    const expDate = new Date(
                      2000 + parseInt(year),
                      parseInt(month) - 1
                    );
                    const today = new Date();
                    return expDate > today || "Tarjeta vencida";
                  },
                })}
                className={errors.expiryDate ? styles.error : ""}
              />
              {errors.expiryDate && (
                <span className={styles.errorText}>
                  {errors.expiryDate.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>CVV *</label>
              <input
                type="text"
                placeholder="123"
                {...register("cvv", {
                  required: "CVV es requerido",
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: "CVV inválido (3 o 4 dígitos)",
                  },
                })}
                className={errors.cvv ? styles.error : ""}
              />
              {errors.cvv && (
                <span className={styles.errorText}>{errors.cvv.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Tipo de Tarjeta *</label>
              <select
                {...register("cardType", {
                  required: "Tipo de tarjeta es requerido",
                })}
                className={errors.cardType ? styles.error : ""}
              >
                <option value="">Selecciona tipo</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
                <option value="diners">Diners Club</option>
              </select>
              {errors.cardType && (
                <span className={styles.errorText}>
                  {errors.cardType.message}
                </span>
              )}
            </div>
          </div>
        </fieldset>

        {/* SECCIÓN 4: Términos y Condiciones */}
        <fieldset className={styles.fieldset}>
          <legend>📋 Confirmación</legend>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                {...register("acceptTerms", {
                  required: "Debes aceptar los términos y condiciones",
                })}
              />
              <span>
                Acepto los{" "}
                <a href="/terms" target="_blank">
                  Términos y Condiciones
                </a>{" "}
                y la{" "}
                <a href="/privacy" target="_blank">
                  Política de Privacidad
                </a>{" "}
                *
              </span>
            </label>
            {errors.acceptTerms && (
              <span className={styles.errorText}>
                {errors.acceptTerms.message}
              </span>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" {...register("newsletter")} />
              <span>
                Deseo recibir ofertas especiales y novedades por email
              </span>
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={isProcessing}
          className={styles.submitButton}
        >
          {isProcessing ? "⏳ Procesando Pago..." : "💰 Pagar Ahora - $45.990"}
        </button>

        <div className={styles.securityNote}>
          🔒 Tus datos están protegidos con encriptación SSL. No almacenamos
          información de tu tarjeta.
        </div>
      </form>
    </div>
  );
}

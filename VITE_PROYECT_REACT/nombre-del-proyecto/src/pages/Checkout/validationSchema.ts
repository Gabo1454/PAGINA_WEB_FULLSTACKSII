// validationSchema.ts
import * as yup from "yup";

export const checkoutSchema = yup.object({
  fullName: yup
    .string()
    .required("Nombre completo es requerido")
    .min(3, "Mínimo 3 caracteres"),
  email: yup.string().email("Email inválido").required("Email es requerido"),
  phone: yup
    .string()
    .required("Teléfono es requerido")
    .matches(/^[0-9]+$/, "Solo números"),
  address: yup
    .string()
    .required("Dirección es requerida")
    .min(10, "Dirección muy corta"),
  city: yup.string().required("Ciudad es requerida"),
  zipCode: yup.string().required("Código postal es requerido"),
  cardNumber: yup
    .string()
    .required("Número de tarjeta es requerido")
    .length(16, "Debe tener 16 dígitos"),
  expiryDate: yup
    .string()
    .required("Fecha de expiración es requerida")
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Formato MM/YY"),
  cvv: yup
    .string()
    .required("CVV es requerido")
    .length(3, "Debe tener 3 dígitos"),
});

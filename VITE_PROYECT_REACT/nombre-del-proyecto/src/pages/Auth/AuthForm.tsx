// AuthForm.tsx - VERSIÓN CORREGIDA
import { useForm } from "react-hook-form";
import { useState } from "react";

type Mode = "login" | "register";
type Props = {
  mode: Mode;
  onSubmit: (data: any) => Promise<void>;
};

export default function AuthForm({ mode, onSubmit }: Props) {
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  // ✅ FUNCIÓN AUXILIAR para manejar errores de tipo
  const getErrorMessage = (error: any): string => {
    if (typeof error?.message === "string") return error.message;
    return "Error de validación";
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setError("");
        try {
          await onSubmit(data);
        } catch (e: any) {
          setError(e.message || "Error");
        }
      })}
      noValidate
    >
      {mode === "register" && (
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...register("username", {
              required: "Usuario requerido",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
            })}
          />
          {/* ✅ CORREGIDO: Convierte FieldError a string */}
          <div className="invalid-feedback">
            {errors.username && getErrorMessage(errors.username)}
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          {...register("email", {
            required: "Correo requerido",
            pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
          })}
        />
        {/* ✅ CORREGIDO */}
        <div className="invalid-feedback">
          {errors.email && getErrorMessage(errors.email)}
        </div>
      </div>

      {mode === "register" && (
        <div className="mb-3">
          <label className="form-label">Edad</label>
          <input
            type="number"
            className={`form-control ${errors.age ? "is-invalid" : ""}`}
            {...register("age", {
              required: "Edad requerida",
              min: { value: 18, message: "Debes ser mayor de 18 años" },
              valueAsNumber: true,
            })}
          />
          {/* ✅ CORREGIDO */}
          <div className="invalid-feedback">
            {errors.age && getErrorMessage(errors.age)}
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          {...register("password", {
            required: "Contraseña requerida",
            minLength: { value: 4, message: "Mínimo 4 caracteres" },
          })}
        />
        {/* ✅ CORREGIDO */}
        <div className="invalid-feedback">
          {errors.password && getErrorMessage(errors.password)}
        </div>
      </div>

      {mode === "register" && (
        <div className="mb-3">
          <label className="form-label">Código referido</label>
          <input
            className={`form-control ${errors.referral ? "is-invalid" : ""}`}
            {...register("referral", {
              required: "Código referido requerido",
              validate: (value) =>
                value === "Duoc2025" || "Código inválido. Usa: Duoc2025",
            })}
          />
          {/* ✅ CORREGIDO */}
          <div className="invalid-feedback">
            {errors.referral && getErrorMessage(errors.referral)}
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "PROCESANDO..."
          : mode === "login"
          ? "INICIAR SESIÓN"
          : "CREAR CUENTA"}
      </button>
    </form>
  );
}

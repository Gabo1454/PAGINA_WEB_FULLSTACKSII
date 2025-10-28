import { useForm } from "react-hook-form";
import { useState } from "react";

type Mode = "login" | "register";
type Props = { mode: Mode; onSubmit: (data: any) => Promise<void>; };
type Form = { name?: string; email: string; password: string; confirm?: string; };

export default function AuthForm({ mode, onSubmit }: Props) {
  const [error, setError] = useState<string>("");
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Form>();
  const pwd = watch("password");

  return (
    <form className="card bg-dark border-primary p-4" onSubmit={handleSubmit(async (data) => {
      setError("");
      try { await onSubmit(data); } catch (e:any) { setError(e.message || "Error"); }
    })} noValidate>
      <h1 className="h4 mb-3">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>

      {mode === "register" && (
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className={`form-control ${errors.name ? "is-invalid":""}`}
            {...register("name", { required: "Nombre requerido", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}/>
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input type="email" className={`form-control ${errors.email ? "is-invalid":""}`}
          {...register("email", { required: "Correo requerido", pattern: { value: /^\S+@\S+$/i, message: "Correo inválido"}})}/>
        <div className="invalid-feedback">{errors.email?.message}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input type="password" className={`form-control ${errors.password ? "is-invalid":""}`}
          {...register("password", { required: "Contraseña requerida", minLength: { value: 6, message: "Mínimo 6 caracteres"}})}/>
        <div className="invalid-feedback">{errors.password?.message}</div>
      </div>

      {mode === "register" && (
        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input type="password" className={`form-control ${errors.confirm ? "is-invalid":""}`}
            {...register("confirm", { required: "Confirma tu contraseña", validate: (v) => v === pwd || "No coincide" })}/>
          <div className="invalid-feedback">{errors.confirm?.message}</div>
        </div>
      )}

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="d-flex gap-2">
        <button className="btn btn-primary" disabled={isSubmitting}>
          {mode === "login" ? "Entrar" : "Registrarme"}
        </button>
      </div>
    </form>
  );
}

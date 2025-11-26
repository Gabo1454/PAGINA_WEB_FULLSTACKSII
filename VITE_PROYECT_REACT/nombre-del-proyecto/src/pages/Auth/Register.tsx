// Register.tsx
import AuthForm from "./AuthForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();

  return (
    <section
      className="container-fluid px-4 py-4 text-white"
      style={{ maxWidth: 640 }}
    >
      <AuthForm
        mode="register"
        onSubmit={async ({ username, email, password, age, referral }) => {
          await doRegister(username, email, password, Number(age), referral);
          navigate("/");
        }}
      />
      <p className="mt-3 text-muted">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}

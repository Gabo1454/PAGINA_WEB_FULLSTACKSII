import AuthForm from "./AuthForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <section
      className="container-fluid px-4 py-4 text-white"
      style={{ maxWidth: 640 }}
    >
      <AuthForm
        mode="login"
        onSubmit={async ({ email, password }) => {
          await login(email, password);
          navigate("/"); // o a /products
        }}
      />
      <p className="mt-3 text-muted">
        ¿No tienes cuenta? <Link to="/register">Crear una</Link>
      </p>
    </section>
  );
}

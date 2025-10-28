import AuthForm from "./AuthForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  return (
    <section className="container-fluid px-4 py-4 text-white" style={{ maxWidth: 640 }}>
      <AuthForm mode="register" onSubmit={async ({ name, email, password }) => {
        await doRegister(name!, email, password);
        navigate("/"); // o a /products
      }} />
      <p className="mt-3 text-muted">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </section>
  );
}

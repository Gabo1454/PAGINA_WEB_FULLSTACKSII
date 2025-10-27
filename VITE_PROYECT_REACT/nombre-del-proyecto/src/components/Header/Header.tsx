import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoPage from "../../assets/imgs/logo_level_up-removebg-preview.png";
import styles from "./Header.module.css";
import { useUser } from "../../pages/UserContext";

export default function Header() {
  const { user, setUser } = useUser();
  const [busquedaVisible, setBusquedaVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);

  const toggleBusqueda = () => setBusquedaVisible(!busquedaVisible);
  const toggleMenuUsuario = () => setMenuUsuarioVisible(!menuUsuarioVisible);

  const cerrarSesion = () => {
    setUser(null);
    localStorage.removeItem("usuarioActivo");
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioActivo");
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        if (usuario?.username) {
          setUser(usuario);
        }
      } catch (error) {
        console.error("Error al recuperar usuario:", error);
      }
    }
  }, [setUser]);

  return (
    <header className={styles.header_principal}>
      {/* LOGO */}
      <div className={styles.logoWeb}>
        <img src={logoPage} alt="Logo Level-Up Gamer" width={80} height={80} />
      </div>

      {/* NAV PRINCIPAL */}
      <nav className={styles.navBar}>
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/about-us">Nosotros</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contacto</Link>
      </nav>

      {/* CARRITO Y BÚSQUEDA */}
      <div className={styles.accionesHeader}>
        <button onClick={toggleBusqueda}>🔍</button>

        {busquedaVisible && (
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.inputBusquedaVisible}
          />
        )}

        <button>🛒</button>
        <button onClick={toggleMenuUsuario}>👤</button>

        {menuUsuarioVisible && (
          <div className={styles.menuUsuario}>
            {!user && (
              <>
                <Link to="/register">Crear cuenta</Link>
                <Link to="/login">Iniciar sesión</Link>
              </>
            )}
            {user && (
              <button onClick={cerrarSesion} className={styles.logoutButton}>
                Cerrar sesión
              </button>
            )}
          </div>
        )}
      </div>

      {user && (
        <div className={styles.usuarioActivo}>
          👋 Bienvenido, <strong>{user.username}</strong>
        </div>
      )}
    </header>
  );
}
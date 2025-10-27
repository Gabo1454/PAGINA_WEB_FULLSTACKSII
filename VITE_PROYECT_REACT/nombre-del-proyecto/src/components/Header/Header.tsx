import { useState } from "react";
import { Link } from "react-router-dom"; // <--- Para navegación SPA
import logoPage from "../../assets/imgs/logo_level_up-removebg-preview.png";
import styles from "./Header.module.css";

export default function Header() {
  const [busquedaVisible, setBusquedaVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  
  

  const toggleBusqueda = () => setBusquedaVisible(!busquedaVisible);

  // gregamos la funcionalidad de el boton de usuario
  const [menuUsuarioVisible, setMenuUsuarioVisible] = useState(false);
  const toggleMenuUsuario = () => setMenuUsuarioVisible(!menuUsuarioVisible);


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

        {/* input sobrepuesto para que no mueva los botones */}
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
        {/* aqui agrego la funcionalidad como tal del menu de usuario */}
        {menuUsuarioVisible && (
        <div className={styles.menuUsuario}>
        <Link to="/register">Crear cuenta</Link>
        <Link to="/login">Iniciar sesión</Link>
        </div>
        )}
      </div>
    </header>
  );
}



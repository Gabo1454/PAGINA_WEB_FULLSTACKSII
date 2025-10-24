import { useState } from "react";
import { Link } from "react-router-dom"; // <--- Para navegación SPA
import logoPage from "../../assets/imgs/logo_level_up-removebg-preview.png";
import styles from "./Header.module.css";

export default function Header() {
  const [busquedaVisible, setBusquedaVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [contadorCarrito, setContadorCarrito] = useState(0);

  const toggleBusqueda = () => setBusquedaVisible(!busquedaVisible);

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

        <button>🛒 {contadorCarrito}</button>
      </div>
    </header>
  );
}

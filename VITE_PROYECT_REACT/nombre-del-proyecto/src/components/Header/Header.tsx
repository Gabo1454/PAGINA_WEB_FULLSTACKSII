// src/components/Header/Header.tsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const logoPage = "/imgs/logo_level_up-removebg-preview.png";
import styles from "./Header.module.css";

export default function Header() {
  const [busquedaVisible, setBusquedaVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [contadorCarrito] = useState(0);

  // 🔹 Referencia al header para medir altura
  const headerRef = useRef<HTMLElement | null>(null);

  // 🔹 Actualiza el padding del body según la altura real del header
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () => {
      const h = el.offsetHeight || 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };

    apply(); // mide al montar
    const ro = new ResizeObserver(apply); // reacciona a cambios de altura
    ro.observe(el);
    window.addEventListener("resize", apply, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  // 🔹 Muestra/oculta el input de búsqueda
  const toggleBusqueda = () => setBusquedaVisible(!busquedaVisible);

  // 🔹 Cierra el menú hamburguesa si está abierto
  const closeNavbarIfOpen = () => {
    const el = document.getElementById("navbarSupportedContent");
    if (el && el.classList.contains("show")) el.classList.remove("show");
  };

  return (
    <header
      ref={headerRef}
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${styles.header_principal}`}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* 🔸 IZQUIERDA: LOGO + HAMBURGUESA */}
        <div className="d-flex align-items-center gap-2">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
            onClick={closeNavbarIfOpen}
          >
            <img
              src={logoPage}
              alt="Logo Level-Up Gamer"
              width={80}
              height={80}
              className={styles.logo}
            />
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* 🔸 CENTRO: NAVEGACIÓN */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${styles.navLink}`}
                onClick={closeNavbarIfOpen}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className={`nav-link ${styles.navLink}`}
                onClick={closeNavbarIfOpen}
              >
                Productos
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/about-us"
                className={`nav-link ${styles.navLink}`}
                onClick={closeNavbarIfOpen}
              >
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/blog"
                className={`nav-link ${styles.navLink}`}
                onClick={closeNavbarIfOpen}
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link ${styles.navLink}`}
                onClick={closeNavbarIfOpen}
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* 🔸 DERECHA: ACCIONES (BUSCAR + CARRITO) */}
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <button
              className={`btn ${styles.iconBtn}`}
              onClick={toggleBusqueda}
            >
              🔍
            </button>

            {busquedaVisible && (
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={`${styles.inputBusquedaVisible} form-control`}
              />
            )}
          </div>

          <Link to="/cart" className={`btn ${styles.iconBtn}`}>
            🛒 {contadorCarrito}
          </Link>
        </div>
      </div>
    </header>
  );
}

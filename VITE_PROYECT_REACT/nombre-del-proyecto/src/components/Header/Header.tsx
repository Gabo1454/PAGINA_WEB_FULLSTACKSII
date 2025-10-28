// src/components/Header/Header.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const logoPage = "/imgs/logo_level_up-removebg-preview.png";

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Estados
  const [busquedaVisible, setBusquedaVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioNombre, setUsuarioNombre] = useState<string | null>(null);
  // inicializador lazy: lee sessionStorage.usuarioActivo.puntos o usuarioPuntos
  const [usuarioPuntos, setUsuarioPuntos] = useState<number>(() => {
    try {
      const ua = sessionStorage.getItem("usuarioActivo");
      if (ua) {
        const parsed = JSON.parse(ua);
        if (parsed && typeof parsed.puntos !== "undefined")
          return Number(parsed.puntos) || 0;
      }
    } catch {
      /* ignore */
    }
    return Number(sessionStorage.getItem("usuarioPuntos") ?? 0) || 0;
  });
  const [menuUsuarioOpen, setMenuUsuarioOpen] = useState(false);

  /* Ajuste de variable CSS --header-h según la altura del header */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      const h = el.offsetHeight || 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /* Inicializar nombre/puntos desde sessionStorage y escuchar cambios de storage o eventos personalizados */
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const ua = sessionStorage.getItem("usuarioActivo");
        if (ua) {
          const parsed = JSON.parse(ua);
          setUsuarioNombre(parsed?.nombre ?? null);
          setUsuarioPuntos(
            Number(
              parsed?.puntos ?? sessionStorage.getItem("usuarioPuntos") ?? 0
            ) || 0
          );
          return;
        }
      } catch {
        /* ignore */
      }
      setUsuarioNombre(null);
      setUsuarioPuntos(
        Number(sessionStorage.getItem("usuarioPuntos") ?? 0) || 0
      );
    };

    const onStorage = (ev: StorageEvent) => {
      if (!ev.key) return;
      if (ev.key === "usuarioActivo" || ev.key === "usuarioPuntos")
        loadFromStorage();
    };

    const onUserUpdated = (ev: Event) => {
      const detail = (ev as CustomEvent<any>).detail;
      if (detail && typeof detail.puntos !== "undefined") {
        setUsuarioPuntos(Number(detail.puntos) || 0);
        setUsuarioNombre(detail.nombre ?? usuarioNombre);
        return;
      }
      loadFromStorage();
    };

    loadFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "user-points-updated",
      onUserUpdated as EventListener
    );
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "user-points-updated",
        onUserUpdated as EventListener
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleBusqueda = () => setBusquedaVisible((v) => !v);

  const closeNavbarIfOpen = () => {
    const el = document.getElementById("navbarSupportedContent");
    if (el && el.classList.contains("show")) el.classList.remove("show");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("usuarioActivo");
    sessionStorage.removeItem("usuarioPuntos");
    setUsuarioNombre(null);
    setUsuarioPuntos(0);
    setMenuUsuarioOpen(false);
    navigate("/");
  };

  const handleBusquedaChange = (v: string) => {
    setBusqueda(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("product-search", { detail: v.trim() })
      );
    }, 300);
  };

  return (
    <header
      ref={headerRef}
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${styles.header_principal}`}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* IZQUIERDA: LOGO + HAMBURGUESA */}
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
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        {/* CENTRO: NAVEGACIÓN */}
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
                to="/aboutus"
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

        {/* DERECHA: BUSCAR + CARRITO + AUTH */}
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative me-1">
            <button
              className={`btn ${styles.iconBtn}`}
              onClick={toggleBusqueda}
              aria-label="Buscar"
            >
              🔍
            </button>
            {busquedaVisible && (
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => handleBusquedaChange(e.target.value)}
                className={`${styles.inputBusquedaVisible} form-control`}
                aria-label="Buscar productos"
              />
            )}
          </div>

          <Link
            to="/cart"
            className={`btn ${styles.iconBtn}`}
            aria-label="Ir al carrito"
          >
            🛒
          </Link>

          {usuarioNombre ? (
            <div className={`position-relative ${styles.userWrapper}`}>
              <button
                className={`btn ${styles.userBtn}`}
                onClick={() => setMenuUsuarioOpen((v) => !v)}
                aria-expanded={menuUsuarioOpen}
                aria-haspopup="true"
              >
                {usuarioNombre}{" "}
                <span className="ms-1">({usuarioPuntos}) ▾</span>
              </button>

              {menuUsuarioOpen && (
                <ul className={styles.userMenu} role="menu">
                  <li role="menuitem">
                    <Link
                      to="/profile"
                      className={styles.userMenuItem}
                      onClick={() => setMenuUsuarioOpen(false)}
                    >
                      Perfil
                    </Link>
                  </li>
                  <li role="menuitem">
                    <button
                      className={styles.userMenuItem}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="d-flex gap-1 align-items-center">
              <Link
                to="/login"
                className={`btn btn-outline-light ${styles.authBtn}`}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className={`btn btn-primary ${styles.authBtn}`}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

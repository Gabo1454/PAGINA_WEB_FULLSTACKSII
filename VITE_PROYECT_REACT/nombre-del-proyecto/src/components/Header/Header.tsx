// src/components/Header/Header.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../pages/Register/UserContext"; // ajusta ruta si la tenés en otro lado
import styles from "./Header.module.css";

const logoPage = "/imgs/logo_level_up-removebg-preview.png";

export default function Header() {
  const { user, setUser } = useUser(); // si no lo tienes importalo o reemplaza
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

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
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const submitSearch = (q: string) => {
    const trimmed = (q ?? "").trim();
    // emitimos evento (para ProductDetail / ProductsIndex que escuchan)
    window.dispatchEvent(
      new CustomEvent("product-search", { detail: trimmed })
    );
    // navegamos a productos con query param
    navigate(`/products${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ""}`);
  };

  const onChange = (v: string) => {
    setQuery(v);
    // debounce para emitir búsqueda mientras escribe
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("product-search", { detail: v.trim() })
      );
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch(query);
    setSearchOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("usuarioActivo");
    } finally {
      setUser(null);
      // opcional: navigate('/')
    }
  };

  return (
    <header
      ref={headerRef}
      className={`navbar navbar-expand-lg navbar-dark fixed-top ${styles.header_principal}`}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* izquierda: logo + toggler */}
        <div className="d-flex align-items-center gap-2">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={logoPage}
              alt="Logo Level-Up"
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
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        {/* centro: nav (centrado via CSS del module) */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className={`navbar-nav mx-auto mb-2 mb-lg-0 ${styles.centerNav}`}>
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${styles.navLink}`}
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/products"
                className={`nav-link ${styles.navLink}`}
                onClick={() => setMenuOpen(false)}
              >
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/aboutus"
                className={`nav-link ${styles.navLink}`}
                onClick={() => setMenuOpen(false)}
              >
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/blog"
                className={`nav-link ${styles.navLink}`}
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link ${styles.navLink}`}
                onClick={() => setMenuOpen(false)}
              >
                Contacto
              </Link>
            </li>

            {/* --- AUTH en mobile: se muestran SOLO en pantallas pequeñas */}
            <li className="nav-item d-lg-none">
              {user ? (
                <>
                  <span className="nav-link">{user.username}</span>
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="nav-link">
                    Registrarse
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>

        {/* derecha: search (overlay), cart y auth (desktop) */}
        <div className="d-flex align-items-center gap-2 position-relative">
          {/* Search icon + overlay input (no desplaza) */}
          <form
            onSubmit={handleSubmit}
            className={styles.searchForm}
            role="search"
          >
            <button
              type="button"
              className={`btn ${styles.iconBtn}`}
              aria-label="Abrir búsqueda"
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen((v) => !v);
                //q foco cuando se abre
                setTimeout(() => {
                  const el = document.getElementById(
                    "hdr-search-input"
                  ) as HTMLInputElement | null;
                  if (el) el.focus();
                }, 0);
              }}
            >
              🔍
            </button>

            <input
              id="hdr-search-input"
              type="text"
              aria-label="Buscar productos"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              className={`${styles.searchInput} ${
                searchOpen ? styles.open : ""
              }`}
              placeholder="Buscar productos..."
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
                // Enter lo maneja el submit del form
              }}
            />
          </form>

          <Link
            to="/cart"
            className={`btn ${styles.iconBtn}`}
            aria-label="Carrito"
          >
            🛒
          </Link>

          {/* Auth desktop */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            {user ? (
              <div className={`position-relative ${styles.userWrapper}`}>
                <button
                  className={`btn ${styles.userBtn}`}
                  onClick={() => {
                    /* opcional abrir dropdown */
                  }}
                >
                  {user.username} ▾
                </button>
                <div className={styles.userMenu}>
                  <Link to="/profile" className={styles.userMenuItem}>
                    Perfil
                  </Link>
                  <button
                    className={styles.userMenuItem}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

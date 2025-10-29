import { useState } from "react";
const logoPage = "/imgs/logo_level_up-removebg-preview.png";
export { default as Footer } from "./Footer";
import styles from "./Footer.module.css";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setMensaje("Por favor ingresa un correo válido.");
      return;
    }
    setMensaje("¡Gracias por suscribirte!");
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} mt-auto`}>
      <div className="container py-4">
        <div className="row gy-4 align-items-start">
          {/* Logo + redes */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center text-center">
            <img
              src={logoPage}
              alt="Logo Level-Up Gamer"
              width={120}
              height={140}
              className={`${styles.logo}`}
            />

            <div className="mt-3">
              <h4 className={styles.redesTitulo}>Síguenos en redes sociales</h4>
              <div className="d-flex justify-content-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={styles.socialLink}
                >
                  <FaFacebook size={22} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={styles.socialLink}
                >
                  <FaInstagram size={22} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter/X"
                  className={styles.socialLink}
                >
                  <FaTwitter size={22} />
                </a>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="col-12 col-md-4">
            <h2 className={styles.sectionTitle}>Contacto</h2>
            <ul className={`list-unstyled mb-0 ${styles.contactList}`}>
              <li className="mb-2">
                <FaMapMarkerAlt /> <strong>Dirección:</strong> Av. Brasil 2021,
                Valparaíso
              </li>
              <li className="mb-2">
                <FaPhone /> <strong>Teléfono:</strong> +56 9 2014 1234
              </li>
              <li className="mb-2">
                <FaEnvelope /> <strong>Email:</strong> contacto@levelup.cl
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-md-4">
            <h2 className={styles.sectionTitle}>
              Suscríbete a nuestro Newsletter
            </h2>

            <form onSubmit={handleSubmit}>
              {/* En md+ usamos input-group; en xs-sm se apilan */}
              <div className="d-flex flex-column flex-sm-row gap-2">
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`form-control ${styles.newsletterInput}`}
                  aria-label="Correo electrónico para suscripción"
                />
                <button
                  type="submit"
                  className={`btn ${styles.newsletterBoton}`}
                  aria-label="Suscribirse al newsletter"
                >
                  Suscribirse
                </button>
              </div>
            </form>

            <p className={`mt-2 ${styles.mensajeNewsletter}`}>{mensaje}</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-12">
            <p className={`text-center mt-4 pt-3 ${styles.copyright}`}>
              &copy; {year} Level-Up Gamer. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

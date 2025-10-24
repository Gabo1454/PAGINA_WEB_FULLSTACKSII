import React, { useState } from "react";
import logoPage from "../../assets/imgs/logo_level_up-removebg-preview.png";
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
      setMensaje("Por favor ingresa un correo valido.");
      return;
    }

    //newsletter.
    setMensaje("¡Gracias por suscribirte!");
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContenido}>
        {/* LOGO */}
        <div className={styles.logoWeb}>
          <img
            src={logoPage}
            alt="Logo Level-Up Gamer"
            width={120}
            height={140}
          />

          {/* REDES SOCIALES */}
          <div className={styles.redesSocialesContainer}>
            <h4>Síguenos en redes sociales</h4>
            <div className={styles.redesSociales}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        {/* CONTACTO */}
        <div className={styles.footerContacto}>
          <h2>
            <strong>Contacto</strong>
          </h2>
          <p>
            <FaMapMarkerAlt /> <strong>Dirección:</strong> Av. Brasil 2021,
            Valparaíso
          </p>
          <p>
            <FaPhone /> <strong>Teléfono:</strong> +56 9 2014 1234
          </p>
          <p>
            <FaEnvelope /> <strong>Email:</strong> contacto@levelup.cl
          </p>
        </div>

        {/* NEWSLETTER */}
        <div className={styles.newsletter}>
          <h2>Suscríbete a nuestro Newsletter</h2>
          <form className={styles.newsletterForm} onSubmit={handleSubmit}>
            <input
              type="email"
              className={styles.newsletterInput}
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.newsletterBoton}>
              Suscribirse
            </button>
          </form>
          <p className={styles.mensajeNewsletter}>{mensaje}</p>
        </div>

        {/* COPYRIGHT */}
        <p className={styles.copyright}>
          &copy; 2027 Level-Up Gamer. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

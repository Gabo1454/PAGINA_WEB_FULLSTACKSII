import React, { useState } from "react";
import logoPage from "../../assets/imgs/logo_level_up-removebg-preview.png";
/*import "./Footer.css"*/

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
    <footer>
      <div className="footer-contenido">
        <div className="logo-web">
          <img
            src={logoPage}
            alt="Logo Level-Up Gamer"
            width={120}
            height={140}
          />
        </div>

        <div className="footer-contacto">
          <h2>
            <strong>Contacto</strong>
          </h2>
          <p>
            <strong>Dirección:</strong> Av. Brasil 2021, Valparaíso
          </p>
          <p>
            <strong>Teléfono:</strong> +56 9 2014 1234
          </p>
          <p>
            <strong>Email:</strong> contacto@levelup.cl
          </p>
        </div>

        <div className="newsletter">
          <h2>Suscríbete a nuestro Newsletter</h2>
          <form id="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              id="correo-newsletter"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Suscribirse</button>
          </form>
          <p id="mensaje-newsletter">{mensaje}</p>
        </div>

        <h4>Síguenos en redes sociales</h4>
        <div className="redes-sociales">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
        </div>

        <p>&copy; 2027 Level-Up Gamer. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

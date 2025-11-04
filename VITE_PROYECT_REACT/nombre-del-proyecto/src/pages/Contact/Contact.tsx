import { useState } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  const [message, setMessage] = useState("");
  const maxChars = 225;

  return (
    <div className={`container ${styles.page}`}>
      {/* Encabezado */}
      <header className="text-center mb-4">
        <h1 className={styles.title}>LEVEL-UP GAMER</h1>
        <p className={styles.subtitle}>
          ¿Dudas, feedback o cotizaciones? Escríbenos y te respondemos.
        </p>
      </header>

      {/* Datos + Formulario */}
      <div className="row g-4">
        {/* Columna info */}
        <aside className="col-12 col-lg-4">
          <div className={`p-4 h-100 ${styles.infoCard}`}>
            <h2 className={styles.sectionHeading}>Contacto</h2>
            <ul className={`list-unstyled m-0 ${styles.infoList}`}>
              <li className="d-flex align-items-center gap-3 mb-3">
                <span className={styles.iconBubble}>📍</span>
                <span>Av. Brasil 2021, Valparaíso</span>
              </li>
              <li className="d-flex align-items-center gap-3 mb-3">
                <span className={styles.iconBubble}>📞</span>
                <span>+56 9 2014 1234</span>
              </li>
              <li className="d-flex align-items-center gap-3 mb-3">
                <span className={styles.iconBubble}>✉️</span>
                <span>contacto@levelup.cl</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <span className={styles.iconBubble}>🌐</span>
                <span>Síguenos en redes sociales</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Columna formulario */}
        <section className="col-12 col-lg-8">
          <div className={`card bg-dark text-white ${styles.formCard}`}>
            <div className="card-body p-4 p-md-5">
              <h2 className={styles.sectionHeading}>Escríbenos</h2>

              <form
                className="row g-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("✅ Mensaje enviado. ¡Gracias!");
                }}
              >
                {/* Nombre */}
                <div className="col-12">
                  <label
                    htmlFor="name"
                    className={`form-label ${styles.label}`}
                  >
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`form-control ${styles.input}`}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                {/* Correo */}
                <div className="col-12">
                  <label
                    htmlFor="email"
                    className={`form-label ${styles.label}`}
                  >
                    Correo
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${styles.input}`}
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>

                {/* Mensaje */}
                <div className="col-12">
                  <label htmlFor="msg" className={`form-label ${styles.label}`}>
                    Contenido
                  </label>
                  <textarea
                    id="msg"
                    rows={5}
                    maxLength={maxChars}
                    className={`form-control ${styles.textarea}`}
                    placeholder="Escribe tu mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <div className="d-flex justify-content-end">
                    <small className={styles.counter}>
                      {message.length}/{maxChars}
                    </small>
                  </div>
                </div>

                {/* Botón */}
                <div className="col-12">
                  <button
                    type="submit"
                    className={`btn w-100 ${styles.submitBtn}`}
                  >
                    Enviar mensaje
                  </button>
                </div>

                {/* Aviso */}
                <div className="col-12">
                  <p className={`m-0 ${styles.muted}`}>
                    Usaremos tus datos solo para responder esta solicitud.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

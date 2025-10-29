import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 225) {
      setMessage(e.target.value);
    }
  };

  return (
    <div className={styles.contactWrapper}>
      <header className={styles.header}>
        <img
          src="./logo_level_up-removebg-preview.png"
          alt="Logo Level-Up Gamer"
          className={styles.logo}
        />
        <h1>LEVEL-UP GAMER</h1>
        <p>📍 Av. Brasil 2021, Valparaíso</p>
        <p>📞 +569 20141234</p>
        <p>📧 contacto@levelup.cl</p>
        <p>🌐 Síguenos en redes sociales</p>
      </header>

      <form className={styles.form}>
        <label>
          NOMBRE COMPLETO
          <input type="text" name="name" placeholder="Tu nombre" required />
        </label>

        <label>
          CORREO
          <input type="email" name="email" placeholder="ejemplo@correo.com" required />
        </label>

        <label>
          CONTENIDO
          <textarea
            name="message"
            value={message}
            onChange={handleChange}
            placeholder="Escribe tu mensaje..."
            required
          />
          <div className={styles.charCount}>{message.length}/225</div>
        </label>

        <button type="submit">🚀 ENVIAR MENSAJE</button>
      </form>

      <footer className={styles.footer}>
        © 2027 Level-Up Gamer. Todos los derechos reservados.
      </footer>
    </div>
  );
}

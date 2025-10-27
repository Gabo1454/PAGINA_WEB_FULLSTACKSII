import React, { useState } from 'react';
import styles from './Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [notification, setNotification] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (formData.username.trim() === '' || formData.password.trim() === '') {
      setNotification('⚠️ Debes completar ambos campos.');
      return;
    }

    // Simulación de éxito
    setNotification(`✅ Bienvenido, ${formData.username}. Has iniciado sesión correctamente.`);
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nombre de usuario
          <input
            type="text"
            name="username"
            placeholder='Ingresa tu nombre de usuario'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            placeholder='Ingresa tu contraseña'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Ingresar</button>
      </form>

      {notification && <div className={styles.notification}>{notification}</div>}
    </div>
  );
}
import React, { useState } from 'react';
import styles from './Register.module.css';
import { useUser } from '../pages/UserContext';

export default function Register() {
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    password: '',
    referral: '',
  });

  const [notification, setNotification] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18) {
      setNotification('⚠️ Debes tener al menos 18 años para registrarte.');
      return;
    }

    if (formData.referral !== 'Duoc2025') {
      setNotification('⚠️ Código referido inválido. Usa: "Duoc2025"');
      return;
    }

    if (formData.username.length < 3 || formData.password.length < 4) {
      setNotification('⚠️ El nombre debe tener al menos 3 letras y la contraseña 4.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('usuarios') || '[]');

    if (existingUsers.some((u: any) => u.username === formData.username)) {
      setNotification('⚠️ Este nombre de usuario ya está registrado.');
      return;
    }

    const updatedUsers = [...existingUsers, formData];
    localStorage.setItem('usuarios', JSON.stringify(updatedUsers));

    // ✅ Guardar en contexto y localStorage
    setUser({ username: formData.username });
    localStorage.setItem('usuarioActivo', JSON.stringify({ username: formData.username }));

    setNotification(`✅ Cuenta creada exitosamente. ¡Bienvenido, ${formData.username}!`);
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nombre de usuario
          <input
            type="text"
            name="username"
            placeholder="Tu nombre"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Edad
          <input
            type="number"
            name="age"
            placeholder="Tu edad"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            placeholder="Tu contraseña ej: GabrielAguila_Laser"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Código referido
          <input
            type="text"
            name="referral"
            placeholder="Ingresa el código referido"
            value={formData.referral}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Crear cuenta</button>
      </form>

      {notification && <div className={styles.notification}>{notification}</div>}
    </div>
  );
}
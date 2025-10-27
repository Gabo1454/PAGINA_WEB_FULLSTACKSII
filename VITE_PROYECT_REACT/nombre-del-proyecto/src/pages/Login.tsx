import { useState } from 'react';
import styles from './Login.module.css';
import { useUser } from '../pages/UserContext';

export default function Login() {
  const { setUser } = useUser();

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

    const { username, password } = formData;

    if (username.trim() === '' || password.trim() === '') {
      setNotification('⚠️ Debes completar ambos campos.');
      return;
    }

    if (username.length < 3 || password.length < 4) {
      setNotification('⚠️ El nombre debe tener al menos 3 letras y la contraseña 4.');
      return;
    }

    const usuariosGuardados = localStorage.getItem('usuarios');
    if (!usuariosGuardados) {
      setNotification('❌ No hay usuarios registrados.');
      return;
    }

    let usuarios: { username: string; password: string }[] = [];

    try {
      usuarios = JSON.parse(usuariosGuardados);
    } catch (error) {
      setNotification('❌ Error al leer usuarios registrados.');
      return;
    }

    const usuarioValido = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (!usuarioValido) {
      setNotification('❌ Usuario o contraseña incorrectos.');
      return;
    }

    setUser({ username });
    localStorage.setItem('usuarioActivo', JSON.stringify({ username }));

    setNotification(`✅ Bienvenido, ${username}. Has iniciado sesión correctamente.`);
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>🔐 Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nombre de usuario
          <input
            type="text"
            name="username"
            placeholder="Ingresa tu nombre"
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
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">🚀 INGRESAR</button>
      </form>

      {notification && <div className={styles.notification}>{notification}</div>}
    </div>
  );
}
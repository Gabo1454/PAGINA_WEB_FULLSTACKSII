import styles from './AboutUs.module.css';

export default function AboutUs() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Conócenos</h1>

      <section className={styles.section}>
        <h2>🎮 Sobre Level-Up Gamer</h2>
        <p>
          Nacimos de la pasión por los videojuegos y la tecnología. Nuestro objetivo es ofrecer a la comunidad gamer chilena productos de alta calidad, desde consolas y periféricos hasta figuras y ropa temática, garantizando una experiencia única y personalizada.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🚀 Nuestra Misión</h2>
        <p>
          Brindar a nuestros clientes un espacio donde puedan encontrar todo lo que necesitan para vivir su pasión por los videojuegos, fomentando la diversión, la competitividad y la conexión entre gamers.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🔭 Nuestra Visión</h2>
        <p>
          Ser la tienda gamer líder en Chile, reconocida por la calidad de sus productos, la atención personalizada y la innovación constante en la experiencia de compra.
        </p>
      </section>

      <section className={styles.section}>
        <h2>💡 Nuestros Valores</h2>
        <ul className={styles.values}>
          <li>🎮 Pasión por los videojuegos</li>
          <li>✅ Calidad y confiabilidad</li>
          <li>⚡ Innovación constante</li>
          <li>🤝 Compromiso con la comunidad gamer</li>
        </ul>
      </section>
    </div>
  );
}
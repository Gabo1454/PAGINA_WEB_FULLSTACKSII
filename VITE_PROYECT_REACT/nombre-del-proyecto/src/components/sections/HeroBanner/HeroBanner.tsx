import { Link } from "react-router-dom";
import styles from "./HeroBanner.module.css";

type Props = {
  imgSrc: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  /** Altura compacta tipo Steam */
  height?: string; // ej: "36vh"
  minHeight?: string; // ej: "260px"
  objectPosition?: string;
};

export default function HeroBanner({
  imgSrc,
  title,
  highlight,
  subtitle,
  ctaText = "Explorar catálogo",
  ctaHref = "/products",
  height = "36vh",
  minHeight = "260px",
  objectPosition = "center",
}: Props) {
  return (
    <section
      className={styles.hero}
      style={{ "--h": height, "--mh": minHeight } as React.CSSProperties}
    >
      {/* Capa media (imagen + overlay) */}
      <div className={styles.media}>
        <img
          src={imgSrc}
          alt=""
          className={styles.img}
          style={{ objectPosition }}
        />
        <div className={styles.overlay} />
      </div>

      {/* Contenido (con container de Bootstrap para alineación) */}
      <div className={styles.content}>
        <div className="container">
          <h1 className={styles.title}>
            {title}{" "}
            {highlight && <span className={styles.highlight}>{highlight}</span>}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {ctaText && (
            <Link to={ctaHref} className={styles.cta}>
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

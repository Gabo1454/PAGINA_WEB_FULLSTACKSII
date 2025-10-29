import { Link } from "react-router-dom";
import styles from "../../CategoryCard/categoryCard.module.css";

export interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
  ariaLabel?: string;
}

export default function CategoryCard({
  title,
  image,
  link,
  ariaLabel,
}: CategoryCardProps) {
  return (
    <Link
      to={link}
      className={styles.card}
      aria-label={ariaLabel ?? `Ir a ${title}`}
    >
      <img src={image} alt={title} className={styles.image} loading="lazy" />
      <div className={styles.overlay}>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </Link>
  );
}

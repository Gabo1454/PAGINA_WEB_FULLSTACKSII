import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Blog.module.css";

type Article = {
  imagen: string;
  titulo: string;
  detalle: string;
};

const initialArticles: Article[] = [
  {
    imagen: "/imgs/banner-jinx.jpeg",
    titulo: "2XKO: La Revolución de los Combates Virtuales",
    detalle:
      "Sumérgete en 2XKO, el juego de pelea de Riot Games que redefine la adrenalina, la estrategia y la competencia entre jugadores de todo el mundo. ¡Prepárate para no pestañear!",
  },
  {
    imagen: "/imgs/snake-delta.jpg",
    titulo: "Metal Gear Delta disponible",
    detalle: "Ya puedes conseguir Metal Gear Delta en nuestra tienda online.",
  },
  {
    imagen: "/imgs/hollow.jpg",
    titulo: "Hollow Knight: Silksong desata caos en tiendas digitales",
    detalle:
      "El esperado lanzamiento de Silksong provocó una avalancha de usuarios intentando comprar el juego, colapsando Steam, la eShop de Nintendo, la PlayStation Store y la Microsoft Store. Steam reportó más de 100 000 jugadores activos en tan solo 30 minutos. Un fenómeno merecedor de portada.",
  },
  {
    imagen: "/imgs/gta.jpg",
    titulo: "GTA VI como el primer juego “AAAAA”",
    detalle:
      "Rockstar está llevando GTA VI a otro nivel, describiéndolo como el primer título “AAAAA” de la historia — más allá del estándar AAA tradicional — gracias a su producción masiva, realismo extremo e inmersión sin precedentes.",
  },
];

function ArticleCard({
  article,
  onOpen,
}: {
  article: Article;
  onOpen: (a: Article) => void;
}) {
  return (
    <article
      className={styles.card}
      onClick={() => onOpen(article)}
      tabIndex={0}
      role="button"
      aria-pressed="false"
    >
      <img
        src={article.imagen}
        alt={article.titulo}
        className={styles.cardImage}
      />
      <h3 className={styles.cardTitle}>{article.titulo}</h3>
      <p className={styles.cardExcerpt}>{article.detalle.slice(0, 100)}...</p>
    </article>
  );
}

function Modal({
  open,
  article,
  onClose,
}: {
  open: boolean;
  article: Article | null;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onKey);
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastActiveRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !article) return null;

  return (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="presentation"
    >
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <button
          aria-label="Cerrar"
          className={styles.modalClose}
          onClick={onClose}
          ref={closeBtnRef}
        >
          ×
        </button>

        <img
          src={article.imagen}
          alt={article.titulo}
          className={styles.modalImage}
        />
        <h3 id="modal-title" className={styles.modalTitle}>
          {article.titulo}
        </h3>
        <p id="modal-desc" className={styles.modalText}>
          {article.detalle}
        </p>
      </div>
    </div>
  );
}

export default function Blog() {
  const [articles] = useState<Article[]>(initialArticles);
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  const { user } = useAuth();

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.heading}>
          Bienvenido{" "}
          <span className={styles.username}>
            {user ? user.fullName || user.username : "invitado"}
          </span>{" "}
          a Level-Up Gamer
        </h1>
        <p className={styles.points}>
          Puntos LevelUp: <span>0</span>
        </p>
      </header>

      <section aria-labelledby="latest-heading" className={styles.blogSection}>
        <h2 id="latest-heading" className={styles.sectionTitle}>
          Últimas Noticias
        </h2>
        <div className={styles.grid} id="lista-articulos">
          {articles.map((a) => (
            <ArticleCard key={a.titulo} article={a} onOpen={setOpenArticle} />
          ))}
        </div>
      </section>

      <Modal
        open={!!openArticle}
        article={openArticle}
        onClose={() => setOpenArticle(null)}
      />
    </main>
  );
}

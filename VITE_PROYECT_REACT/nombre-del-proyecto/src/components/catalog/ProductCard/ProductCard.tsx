import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import type { Product } from "../../../types/products";
import { useCart } from "../../../context/CartContext"; // 💡 Usamos el contexto de carrito
import styles from "./ProductCard.module.css";

const FALLBACK = "/imgs/placeholder.png";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart(); // Función real de tu carrito
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(String(product.id), 1); // Cantidad 1 por defecto

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formattedPrice = (product.price ?? 0).toLocaleString("es-CL", {
    maximumFractionDigits: 0,
  });

  const isInStock = (product.stock ?? 0) > 0;

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.cardLink}>
        <div className={styles.cardImageContainer}>
          {product.offer && (
            <span className={`${styles.offerBadge} badge bg-danger`}>
              OFERTA
            </span>
          )}

          <img
            src={product.image || FALLBACK}
            alt={product.name}
            className={styles.cardImage}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK;
            }}
          />

          {!isInStock && (
            <span className={styles.outOfStockBadge}>AGOTADO</span>
          )}
        </div>

        <div>
          <h3 className={styles.cardTitle}>{product.name}</h3>
          <p className={styles.cardPrice}>${formattedPrice}</p>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={!isInStock || isAdded}
        className={`${styles.addToCartButton} ${
          !isInStock
            ? styles.outOfStockButton
            : isAdded
            ? styles.added
            : styles.inStock
        }`}
      >
        {isAdded ? (
          <>
            <FaCheck className="me-2" /> Añadido
          </>
        ) : isInStock ? (
          <>
            <FaShoppingCart className="me-2" /> Añadir al Carrito
          </>
        ) : (
          "Sin Stock"
        )}
      </button>
    </div>
  );
};

export default ProductCard;

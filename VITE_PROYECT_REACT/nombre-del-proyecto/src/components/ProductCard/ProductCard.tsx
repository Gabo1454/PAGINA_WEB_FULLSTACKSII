import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../data/types";
import { useProductStore } from "../../context/ProductContext";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import styles from "./ProductCard.module.css";

const FALLBACK = "/imgs/placeholder.png";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useProductStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId: product.id, quantity: 1 },
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formattedPrice = product.price.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  const isInStock = (product.stock ?? 0) > 0;

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.cardImageContainer}>
        {product.offer && (
          <span className={`${styles.offerBadge} badge bg-danger`}>OFERTA</span>
        )}

        <img
          src={product.image || FALLBACK}
          alt={product.name}
          className={styles.cardImage}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK;
          }}
        />

        {!isInStock && <span className={styles.outOfStockBadge}>AGOTADO</span>}
      </div>

      <div className={styles.cardBody}>
        <div>
          <h3 className={styles.cardTitle}>{product.name}</h3>
          <p className={styles.cardPrice}>{formattedPrice}</p>
        </div>

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
    </Link>
  );
};

export default ProductCard;

import { useCart } from "../../context/CartProvider";
import { cart, products } from "../../lib/db";

const { cartItems, setQty, removeFromCart, clearCart, total } = useCart();
const all = products.all();

const items = cartItems
  .map((it) => {
    const p = all.find((pp) => pp.id === it.productId);
    if (!p) return null;
    const price = p.price ?? 0;
    const stock = p.stock ?? 0;
    return {
      id: p.id,
      name: p.name,
      image: p.image || "/imgs/placeholder.png",
      price,
      stock,
      qty: it.qty,
      subtotal: price * it.qty,
    };
  })
  .filter((x): x is NonNullable<typeof x> => x !== null);

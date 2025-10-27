import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./pages/CartContext.tsx"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider> {/* envolvemos la app con el contexto del carrito */}
      <App />
    </CartProvider>
  </StrictMode>
);
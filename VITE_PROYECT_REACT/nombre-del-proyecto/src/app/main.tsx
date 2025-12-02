// src/main.tsx
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProductsProvider } from "../context/ProductsContext";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <App />
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

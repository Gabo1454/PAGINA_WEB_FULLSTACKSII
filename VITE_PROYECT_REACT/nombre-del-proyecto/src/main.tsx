// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import App from "./App";
import { ProductStoreProvider } from "./context/ProductContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ProductStoreProvider>
        <App />
      </ProductStoreProvider>
    </AuthProvider>
  </StrictMode>
);

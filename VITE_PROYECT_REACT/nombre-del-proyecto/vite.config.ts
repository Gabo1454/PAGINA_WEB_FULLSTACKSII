import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🎯 NUEVA SECCIÓN: CONFIGURACIÓN DEL SERVIDOR DE DESARROLLO (VITE DEV SERVER)
  server: {
    proxy: {
      // Cuando el frontend solicita /api (ej: /api/products)...
      "/api": {
        // ...Vite lo redirige a http://localhost:8080
        target: "http://localhost:8080",
        changeOrigin: true, // Esto es crucial para simular que es el servidor real
        secure: false, // Puedes cambiar a true si tu backend usa HTTPS
        // Nota: Con esta configuración, la solicitud a /api/products
        // se convierte en http://localhost:8080/api/products en el backend.
      },
    },
  },
  // FIN DE LA SECCIÓN DE PROXY

  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    //setupFiles: "./src/tests/unit/setupTests.tsx",
    css: true,
  },
});

// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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

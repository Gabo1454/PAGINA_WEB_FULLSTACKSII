import "@testing-library/jest-dom"; // matchers como toBeInTheDocument
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Silenciar warnings ruidosos de React Router o Bootstrap si aparecen
const origError = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? "");
  if (msg.includes("React Router") || msg.includes("Not implemented")) return;
  origError(...args);
};

// Limpia el DOM tras cada test
afterEach(() => {
  cleanup();
});

// Mock muy básico para imports de assets si alguno se cuela
vi.stubGlobal("importMeta", import.meta);

// Opcional: mock del scroll/resize si algún comp lo usa
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

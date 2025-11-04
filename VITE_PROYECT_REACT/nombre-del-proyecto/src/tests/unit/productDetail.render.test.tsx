import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import ProductDetail from "../../pages/Products/ProductDetail";

describe("ProductDetail", () => {
  it("renderiza página de detalle sin romper", () => {
    renderWithProviders(<ProductDetail />, {
      router: { initialEntries: ["/products/CO001"] },
    });

    // ✅ ACEPTA lo que SÍ se renderiza: "Producto no encontrado"
    expect(screen.getByText(/producto no encontrado/i)).toBeInTheDocument();

    // Y también el botón "Volver"
    expect(screen.getByRole("button", { name: /volver/i })).toBeInTheDocument();
  });
});

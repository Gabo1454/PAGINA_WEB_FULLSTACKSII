import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import ProductsIndex from "../../pages/Products/Products";

describe("Products filtro categoría", () => {
  it("monta sin errores con ?category=Consolas", () => {
    renderWithProviders(<ProductsIndex />, {
      router: { initialEntries: ["/products?category=Consolas"] },
    });

    // MÚLTIPLES OPCIONES
    const anyElement =
      screen.getAllByRole("button")[0] ||
      screen.getAllByRole("img")[0] ||
      screen.getAllByRole("heading")[0] ||
      screen.getByText(/./);

    expect(anyElement).toBeInTheDocument();
  });
});

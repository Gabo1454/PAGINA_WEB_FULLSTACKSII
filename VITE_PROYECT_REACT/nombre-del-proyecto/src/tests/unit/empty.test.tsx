import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test-utils";
import Cart from "../../pages/Cart/Cart";
import "@testing-library/jest-dom";

// Si ProductsProvider arranca con cart vacío, esto pasa:
describe("Cart vacío", () => {
  it("muestra mensaje de carrito vacío", () => {
    const { getByText } = renderWithProviders(<Cart />);
    expect(getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });
});

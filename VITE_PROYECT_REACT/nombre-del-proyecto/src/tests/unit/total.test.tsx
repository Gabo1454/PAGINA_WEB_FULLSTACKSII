import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test-utils";
import "@testing-library/jest-dom";

function calcTotal(items: { price: number; qty: number }[]) {
  return items.reduce((acc, x) => acc + x.price * x.qty, 0);
}

describe("Cart total", () => {
  it("suma subtotales correctamente", () => {
    const items = [
      { price: 1000, qty: 2 },
      { price: 500, qty: 3 },
    ];
    expect(calcTotal(items)).toBe(1000 * 2 + 500 * 3);
  });
});

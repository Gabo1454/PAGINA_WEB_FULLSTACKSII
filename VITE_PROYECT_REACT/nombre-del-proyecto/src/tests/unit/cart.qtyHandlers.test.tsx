import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test-utils";
import "@testing-library/jest-dom";

const inc = (current: number, stock: number) =>
  current >= stock ? current : current + 1;

const dec = (current: number) => (current <= 1 ? 0 : current - 1);

describe("Cart qty handlers", () => {
  it("inc no sobrepasa stock", () => {
    expect(inc(2, 2)).toBe(2);
    expect(inc(1, 2)).toBe(2);
  });
  it("dec llega a 0 cuando baja de 1", () => {
    expect(dec(1)).toBe(0);
    expect(dec(3)).toBe(2);
  });
});

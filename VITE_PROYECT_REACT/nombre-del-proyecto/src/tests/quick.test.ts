import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("Test rápido sin setup", () => {
  it("funciona sin DOM", () => {
    expect(1 + 1).toBe(2);
  });

  it("pesoCL básico", () => {
    const pesoCL = (n = 0) =>
      n.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      });
    expect(pesoCL(10000)).toBe("$10.000");
  });
});

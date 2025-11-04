import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test-utils";
import "@testing-library/jest-dom";

const pesoCL = (n = 0) =>
  n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

describe("pesoCL", () => {
  it("formatea 10000 como CLP", () => {
    expect(pesoCL(10000)).toBe("$10.000");
  });
});

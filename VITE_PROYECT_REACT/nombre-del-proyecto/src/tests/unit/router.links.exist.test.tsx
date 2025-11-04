import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test-utils";
import App from "../../app/App";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Header links", () => {
  it("tiene links principales", () => {
    renderWithProviders(<App />);
    expect(
      screen.getByRole("link", { name: /productos/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nosotros/i })).toBeInTheDocument();
  });
});

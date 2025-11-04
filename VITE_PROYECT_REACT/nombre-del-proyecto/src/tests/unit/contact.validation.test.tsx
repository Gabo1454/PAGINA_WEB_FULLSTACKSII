import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "../../pages/Contact/Contact";
import { renderWithProviders } from "../test-utils";
import "@testing-library/jest-dom";

describe("Contact", () => {
  it("muestra placeholders visibles", () => {
    render(<Contact />);
    expect(
      screen.getByPlaceholderText(/ejemplo@correo\.com/i)
    ).toBeInTheDocument();
  });
});

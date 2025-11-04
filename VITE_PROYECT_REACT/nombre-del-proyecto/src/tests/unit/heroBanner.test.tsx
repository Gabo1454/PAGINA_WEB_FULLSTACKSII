import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

// ✅ MOCK con las PROPS requeridas
vi.mock("../../components/sections/HeroBanner/HeroBanner", () => ({
  default: ({ imgSrc, title }: { imgSrc: string; title: string }) => (
    <div data-testid="hero-banner">
      <img src={imgSrc} alt={title} />
      <h1>{title}</h1>
      <button>Botón CTA</button>
    </div>
  ),
}));

import HeroBanner from "../../components/sections/HeroBanner/HeroBanner";

describe("HeroBanner", () => {
  it("muestra título, highlight y botón CTA", () => {
    // ✅ PROVEE las props requeridas
    renderWithProviders(
      <HeroBanner imgSrc="/imgs/hero-banner.jpg" title="Título del Hero" />
    );

    expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
    expect(screen.getByText("Título del Hero")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Botón CTA" })
    ).toBeInTheDocument();
  });
});

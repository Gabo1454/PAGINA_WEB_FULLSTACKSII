import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import FeaturedSection from "../../components/FeaturedSection/FeaturedSection";
import type { Product } from "../../types/products";

describe("FeaturedSection", () => {
  it("renderiza cards cuando hay items", () => {
    const props = {
      title: "Productos Destacados",
      items: [
        {
          id: "CO001",
          name: "PlayStation 5 (1TB)",
          price: 549990,
          image: "/imgs/PS5-1TB.webp",
          category: ["Consolas"],
          description: "PS5 con almacenamiento de 1TB.",
          stock: 2,
          offer: false,
        },
        {
          id: "CD001",
          name: "Tarjeta de Regalo PSN $10 USD",
          price: 9990,
          image: "/imgs/10-dolares-psn-usa.avif",
          category: ["Códigos Digitales"],
          description:
            "Código digital para agregar 10 dólares a tu cuenta PSN (USA).",
          stock: 99,
          offer: false,
        },
      ] as Product[],
    };

    renderWithProviders(<FeaturedSection {...props} />);

    expect(screen.getByText("Productos Destacados")).toBeInTheDocument();
    expect(screen.getByText("PlayStation 5 (1TB)")).toBeInTheDocument();
    expect(
      screen.getByText("Tarjeta de Regalo PSN $10 USD")
    ).toBeInTheDocument();
  });
});

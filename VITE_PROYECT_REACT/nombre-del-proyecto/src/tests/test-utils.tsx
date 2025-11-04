import { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { ProductsProvider } from "../context/ProductsContext";
import "@testing-library/jest-dom";
// Si  AuthContext es requerido por algún componente, impórtar y envuélverlo también.
// import { AuthProvider } from "../context/AuthContext";

import { AuthProvider } from "../context/AuthContext"; // si no existe, comenta esta línea

type Options = {
  router?: MemoryRouterProps;
  withAuth?: boolean; // por si en algún test no quieres Auth
};

export function renderWithProviders(
  ui: React.ReactElement,
  { router, withAuth = true }: Options = {}
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const Providers = (
      <ProductsProvider>
        {withAuth ? <AuthProvider>{children}</AuthProvider> : children}
      </ProductsProvider>
    );
    return <MemoryRouter {...router}>{Providers}</MemoryRouter>;
  };

  return render(ui, { wrapper: Wrapper });
}

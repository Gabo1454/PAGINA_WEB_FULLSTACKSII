import { createContext, useContext, useMemo, useState } from "react";
import {
  currentUser,
  login as doLogin,
  logout as doLogout,
  register as doRegister,
  type AuthUser,
} from "../services/auth";

// ✅ ACTUALIZAR el tipo Ctx para que coincida con el servicio
type Ctx = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    age: number,
    referral: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(currentUser());

  const value = useMemo<Ctx>(
    () => ({
      user,
      login: async (email: string, password: string) => {
        const u = doLogin(email, password);
        setUser(u);
      },
      register: async (
        username: string,
        email: string,
        password: string,
        age: number,
        referral: string
      ) => {
        // ✅ Ahora coincide con el servicio actualizado
        const u = doRegister(username, email, password, age, referral);
        setUser(u);
      },
      logout: () => {
        doLogout();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

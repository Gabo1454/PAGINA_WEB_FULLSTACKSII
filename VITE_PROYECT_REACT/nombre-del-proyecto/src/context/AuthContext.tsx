import { createContext, useContext, useMemo, useState } from "react";
import { currentUser, login as doLogin, logout as doLogout, register as doRegister, type AuthUser } from "../data/auth";

type Ctx = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(currentUser());
  const value = useMemo<Ctx>(() => ({
    user,
    login: async (email, password) => { const u = doLogin(email, password); setUser(u); },
    register: async (name, email, password) => { const u = doRegister(name, email, password); setUser(u); },
    logout: () => { doLogout(); setUser(null); },
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

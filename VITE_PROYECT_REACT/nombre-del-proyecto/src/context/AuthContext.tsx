// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  currentUser,
  login as doLogin,
  logout as doLogout,
  register as doRegister,
  type AuthUser,
} from "../services/auth";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    age: number,
    referral: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(currentUser());

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      login: async (username: string, password: string) => {
        const u = await doLogin(username, password);
        setUser(u);
      },
      register: async (
        username: string,
        email: string,
        password: string,
        age: number,
        referral: string
      ) => {
        const u = await doRegister(username, email, password, age, referral);
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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

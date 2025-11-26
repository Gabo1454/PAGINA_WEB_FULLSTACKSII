// src/services/auth.ts
export type AuthUser = {
  id: number;
  username: string;
  fullName: string;
  role: string;
  token: string;
};

const API_URL = "http://localhost:8080/api";
const STORAGE_KEY = "levelup-auth";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ✅ Devuelve el usuario actual desde localStorage (para hidratar el contexto)
export function currentUser(): AuthUser | null {
  return safeParse<AuthUser>(localStorage.getItem(STORAGE_KEY));
}

// ✅ Login contra el backend real
export async function login(
  username: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Credenciales inválidas");
    }
    throw new Error("Error al iniciar sesión");
  }

  const data = await res.json(); // LoginResponse del backend

  const user: AuthUser = {
    id: data.userId,
    username: data.username,
    fullName: data.fullName,
    role: data.role,
    token: data.token,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

// ✅ Registro contra el backend real
export async function register(
  username: string,
  email: string,
  password: string,
  age: number,
  referral: string
): Promise<AuthUser> {
  // El backend NO usa email / age / referral. Los pedimos solo para tu UX.
  // Para el backend usamos username y un fullName sencillo:
  const body = {
    username,
    password,
    fullName: username, // podrías cambiarlo después a algo más elaborado
  };

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    throw new Error("El nombre de usuario ya existe");
  }

  if (!res.ok) {
    throw new Error("Error al registrar usuario");
  }

  // Después de registrar, iniciamos sesión automáticamente:
  return login(username, password);
}

// ✅ Logout → borra del localStorage
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

// (Opcional) helper para futuros fetch (carrito, órdenes, etc.)
export function authHeader() {
  const u = currentUser();
  if (!u) return {};
  return {
    Authorization: `Bearer ${u.token}`,
  };
}

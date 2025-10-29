// services/auth.ts - VERSIÓN ACTUALIZADA
export type AuthUser = {
  username: string; // que sea 'username' no 'name'
  email: string;
};

type StoredUser = AuthUser & {
  password: string;
  age: number;
  referral: string;
};

const KEY_USERS = "auth_users";
const KEY_SESSION = "auth_session";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_USERS) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(list: StoredUser[]) {
  localStorage.setItem(KEY_USERS, JSON.stringify(list));
}

function setSession(u: AuthUser | null) {
  if (u) localStorage.setItem(KEY_SESSION, JSON.stringify(u));
  else localStorage.removeItem(KEY_SESSION);
}

export function currentUser(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(KEY_SESSION) || "null");
  } catch {
    return null;
  }
}

export function register(
  username: string,
  email: string,
  password: string,
  age: number,
  referral: string
): AuthUser {
  const users = readUsers();

  // Validaciones
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("El correo ya está registrado.");
  }

  if (users.some((u) => u.username === username)) {
    throw new Error("El nombre de usuario ya existe.");
  }

  if (age < 18) {
    throw new Error("Debes tener al menos 18 años.");
  }

  if (referral !== "Duoc2025") {
    throw new Error('Código referido inválido. Usa: "Duoc2025"');
  }

  if (username.length < 3) {
    throw new Error("El nombre debe tener al menos 3 letras.");
  }

  if (password.length < 4) {
    throw new Error("La contraseña debe tener al menos 4 caracteres.");
  }

  const user: StoredUser = { username, email, password, age, referral };
  users.push(user);
  writeUsers(users);

  const auth = { username, email };
  setSession(auth);
  return auth;
}

export function login(email: string, password: string): AuthUser {
  const users = readUsers();
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) throw new Error("Credenciales inválidas.");

  const auth = { username: found.username, email: found.email };
  setSession(auth);
  return auth;
}

export function logout() {
  setSession(null);
}

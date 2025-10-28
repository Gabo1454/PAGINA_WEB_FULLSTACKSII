export type AuthUser = { name: string; email: string };
type StoredUser = AuthUser & { password: string };

const KEY_USERS = "auth_users";
const KEY_SESSION = "auth_session";

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(KEY_USERS) || "[]"); } catch { return []; }
}
function writeUsers(list: StoredUser[]) { localStorage.setItem(KEY_USERS, JSON.stringify(list)); }
function setSession(u: AuthUser | null) { 
  if (u) localStorage.setItem(KEY_SESSION, JSON.stringify(u));
  else localStorage.removeItem(KEY_SESSION);
}

export function currentUser(): AuthUser | null {
  try { return JSON.parse(localStorage.getItem(KEY_SESSION) || "null"); } catch { return null; }
}

export function register(name: string, email: string, password: string): AuthUser {
  const users = readUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("El correo ya está registrado.");
  }
  const user: StoredUser = { name, email, password };
  users.push(user);
  writeUsers(users);
  const auth = { name, email };
  setSession(auth);
  return auth;
}

export function login(email: string, password: string): AuthUser {
  const users = readUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!found) throw new Error("Credenciales inválidas.");
  const auth = { name: found.name, email: found.email };
  setSession(auth);
  return auth;
}

export function logout() { setSession(null); }

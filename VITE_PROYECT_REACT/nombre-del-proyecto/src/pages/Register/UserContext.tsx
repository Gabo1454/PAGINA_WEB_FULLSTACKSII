import { createContext, useContext, useState, useEffect } from 'react';

// Tipo de usuario
type User = {
  username: string;
};

// Tipo del contexto
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Proveedor del contexto
export const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      try {
        const usuarioParseado = JSON.parse(usuarioGuardado);
        if (usuarioParseado?.username) {
          setUser(usuarioParseado);
        }
      } catch (error) {
        console.error('Error al recuperar usuario:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};
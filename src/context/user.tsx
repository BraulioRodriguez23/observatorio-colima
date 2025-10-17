import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir el tipo para el usuario
interface User {
  id: number;
  name: string;
  email: string;
}

// Definir el tipo para el contexto
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Crear el Context con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del Context
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Estado para el usuario
  const [loading, setLoading] = useState(true); // Estado para el loading

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      const token = data.token as string;
      localStorage.setItem('token', token);
      // Obtener perfil
      const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) {
        throw new Error('No se pudo obtener el perfil del usuario');
      }
      const me = await meRes.json();
      setUser(me);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null); // Limpiar el usuario
    localStorage.removeItem('token'); // Eliminar el token
  };

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token');
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          const me = await meRes.json();
          setUser(me);
        }
      } catch (e) {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Valores que se compartirán en el Context
  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
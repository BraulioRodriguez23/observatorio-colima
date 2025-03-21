import React, { createContext, useState, ReactNode } from 'react';

// Definir el tipo para el estado y la función del contexto
interface UserContextType {
  estado: string;
  cambiarEstado: (nuevoEstado: string) => void;
}

// Crear el contexto, inicialmente undefined (sin valor)
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Tipar las props del Provider
interface UserProviderProps {
  children: ReactNode;
}

// Crear el Provider
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [estado, setEstado] = useState<string>('Hola, mundo');

  const cambiarEstado = (nuevoEstado: string) => {
    setEstado(nuevoEstado);
  };

  return (
    <UserContext.Provider value={{ estado, cambiarEstado }}>
      {children}
    </UserContext.Provider>
  );
};

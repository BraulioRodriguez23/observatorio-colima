// components/NavTabs.tsx
import { NavLink } from 'react-router-dom';

export default function NavTabs() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <NavLink 
            to="/"
            className="py-4 px-1 text-gray-500 hover:text-pink-600 border-b-2 border-transparent hover:border-pink-600"
          >
            Inicio
          </NavLink>
          <NavLink 
            to="/indicadores"
            className="py-4 px-1 text-pink-600 border-b-2 border-pink-600"
          >
            Indicadores
          </NavLink>
          <NavLink 
            to="/publicaciones"
            className="py-4 px-1 text-gray-500 hover:text-pink-600 border-b-2 border-transparent hover:border-pink-600"
          >
            Publicaciones
          </NavLink>
          <NavLink 
            to="/noticias"
            className="py-4 px-1 text-gray-500 hover:text-pink-600 border-b-2 border-transparent hover:border-pink-600"
          >
            Noticias
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
// HorizontalMenu.tsx (Versión mejorada con enrutamiento)
import path from 'path';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const HorizontalMenu: React.FC = () => {
  const location = useLocation();
  const tabs = [
    { name: 'Inicio', path: '/' },
    { name: 'Indicadores', path: '/inventario' },
    { name: 'Publicaciones', path: '/Publications' },
    { name: 'Noticias', path: '/News' },
    { name: 'Sobre Nosotros', path: '/Sobre_nosotros'},


  ];

  return (
    <nav className="flex space-x-3 md:space-x-4">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => 
            `py-3 px-4 md:px-6 rounded-full text-sm transition-all ${
              isActive || location.pathname === tab.path
                ? 'bg-gray-800 text-white font-semibold shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default HorizontalMenu;
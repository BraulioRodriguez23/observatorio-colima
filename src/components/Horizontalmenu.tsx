// HorizontalMenu.tsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // o puedes usar íconos propios

const HorizontalMenu: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { name: 'Inicio', path: '/' },
    { name: 'Indicadores', path: '/inventario' },
    { name: 'Publicaciones', path: '/Publications' },
    { name: 'Eventos', path: '/News' },
    { name: 'Sobre nosotros', path: '/Sobre_nosotros' },
  ];

  return (
    <div className="relative">
      {/* Botón hamburguesa en móvil */}
      <div className="md:hidden flex justify-end px-4 py-4">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú */}
      <nav
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col space-y-6 px-4 pb-4 md:flex md:flex-row md:space-x-4 md:space-y-0 md:pb-0`}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            onClick={() => setIsOpen(false)} // cerrar menú en móvil al dar clic
            className={({ isActive }) =>
              `py-2 px-4 rounded-full text-sm transition-all ${
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
    </div>
  );
};

export default HorizontalMenu;

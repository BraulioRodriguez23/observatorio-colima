import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    <div className="relative overflow-x-hidden">
      {/* Botón hamburguesa (móvil). Visible y con color explícito */}
      <div className="md:hidden flex items-center justify-start px-2 py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-800"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* NAV */}
      <nav
        id="mobile-nav"
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col space-y-1 w-full bg-white md:bg-transparent md:flex md:flex-row md:items-center md:space-x-0.5 md:space-y-0 md:justify-end md:w-auto
     fixed md:static inset-x-0 top-0 md:top-auto border-b shadow-md md:shadow-none z-[60] px-4 py-2 pt-16 md:px-0 md:py-0 max-h-[100svh] overflow-auto`}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `py-2 px-3 rounded-full text-sm transition-all
               ${
                 isActive || location.pathname === tab.path
                   ? 'bg-gray-800 text-white font-semibold shadow-md'
                   : 'text-gray-700 hover:bg-gray-200'
               }
               w-full text-left md:w-auto md:text-center`
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

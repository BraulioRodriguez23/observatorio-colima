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
    <div className="relative">
      {/* Botón hamburguesa (móvil). Está a la izquierda dentro del área del menú */}
      <div className="md:hidden flex items-center justify-start px-2 py-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* NAV */}
      <nav
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col space-y-2 w-full bg-white md:bg-transparent md:flex md:flex-row md:items-center md:space-x-2 md:space-y-0 md:justify-end md:w-auto
           absolute md:static left-0 top-full md:top-auto shadow-md md:shadow-none z-50 px-2 py-2 md:px-0 md:py-0`}
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

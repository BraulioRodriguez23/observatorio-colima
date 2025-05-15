import React from 'react';
import logo from '../images/colima-logo.png';
import logomnz from '../images/Manzanillo marca turística.png';
import logocomala from '../images/Comala Pueblo Mágico.png';
import HorizontalMenu from './Horizontalmenu';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 w-full bg-white bg-opacity-90 flex flex-wrap justify-between items-center px-4 py-2 shadow-md z-50">
      
      {/* Logos */}
      <div className="flex items-center space-x-2">
        {/* Colima – siempre visible en móvil, oculto en ≥sm si quieres */}
        <img
          src={logo}
          alt="Logo Colima"
          className="className=h-8 sm:h-10 object-contain sm:hidden"
        />

        {/* Manzanillo – aparece en ≥sm */}
        <img
          src={logomnz}
          alt="Logo Manzanillo"
          className="hidden sm:block h-11 sm:h-14 object-contain"
        />

        {/* Colima – vuelve a aparecer en ≥sm */}
        <img
          src={logo}
          alt="Logo Colima"
          className="hidden sm:block h-8 sm:h-10 object-contain"
        />

        {/* Comala – solo en ≥md */}
        <img
          src={logocomala}
          alt="Logo Comala"
          className="hidden md:block h-10 md:h-10 object-contain"
        />
      </div>

      {/* Menú */}
      <div className="w-full sm:w-auto mt-2 sm:mt-0">
        <HorizontalMenu />
      </div>
    </header>
  );
};

export default Header;

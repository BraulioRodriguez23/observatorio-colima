import React from 'react';
import logo from '../images/colima-logo.png';
import logomnz from '../images/Manzanillo -logo.png';
import logocomala from '../images/Comala Pueblo Mágico.png';
import HorizontalMenu from './Horizontalmenu';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 w-full bg-white bg-opacity-90 flex flex-wrap justify-between items-center px-4 py-2 shadow-md z-50">
      
     <div className="flex items-center space-x-1">
  {/* Colima – siempre visible en móvil, oculto en ≥sm si quieres */}
  <img
    src={logo}
    alt="Logo Colima"
    className="h-8 sm:h-10 object-contain sm:hidden"
  />
<img
  src={logomnz}
  alt="Logo Manzanillo"
  className="h-2 sm:h-24 object-contain -ml-2 -mr-2"
/>


  {/* Colima – vuelve a aparecer en ≥sm */}
  <img
    src={logo}
    alt="Logo Colima"
    className="hidden sm:block h-9 sm:h-12 object-contain"
  />

  {/* Comala – solo en ≥md */}
  <img
    src={logocomala}
    alt="Logo Comala"
    className="hidden md:block h-12 md:h-20 object-contain"
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

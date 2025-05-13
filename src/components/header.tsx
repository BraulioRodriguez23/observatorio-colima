import React from 'react';
import logo from '../images/colima-logo.png';
import logomnz from '../images/Manzanillo marca turística.png';
import logocomala from '../images/Comala Pueblo Mágico.png';
import HorizontalMenu from './Horizontalmenu';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 w-full bg-white bg-opacity-90 flex justify-between items-center px-6 py-3 shadow-md z-50">
      <div className="flex items-center justify-center space-x-4"> {/* Añadido space-x-4 para separación */}
        <div className="w-[150px] h-[60px] flex items-center justify-center">
          <img
            src={logo}
            alt="Logo Secretaría de Turismo"
            className="object-contain max-h-full"
          />
        </div>
        <div className="w-[150px] h-[60px] flex items-center justify-center">
          <img
            src={logomnz}
            alt="Logo Manzanillo"
            className="object-contain max-h-full"
          />
        </div>
        <div className="w-[150px] h-[60px] flex items-center justify-center">
          <img
            src={logocomala}
            alt="Logo Comala Pueblo Mágico"
            className="object-contain max-h-full"
          />
        </div>
      </div>

      <HorizontalMenu />
    </header>
  );
};

export default Header;
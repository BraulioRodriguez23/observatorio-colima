import React from 'react';
import logoColima from '../images/colima-logo.png';
import logoManzanillo from '../images/Manzanillo -logo.png';
import logoComala from '../images/Comala Pueblo Mágico.png';
import HorizontalMenu from './Horizontalmenu';
import udcLogo from '../images/UdeC_DosLineasIzq_Oro.png';
import gColimaLogo from '../images/Logo SUBSECRETARIA DE TURISMO.png';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 w-full bg-white bg-opacity-90 shadow-md z-50 px-4 py-2">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-2">
        {/* Logos (left) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src={logoColima}
            alt="Logo Colima"
            className="h-8 sm:h-10 md:h-12 object-contain max-w-[140px]"
          />

          <img
            src={logoManzanillo}
            alt="Logo Manzanillo"
            className="hidden sm:inline-block h-10 md:h-14 object-contain max-w-[120px]"
          />

          <img
            src={logoComala}
            alt="Logo Comala"
            className="hidden md:inline-block h-12 md:h-20 object-contain max-w-[140px]"
          />

          <img
            src={udcLogo}
            alt="Logo UdeC"
            className="hidden sm:inline-block h-10 md:h-11 object-contain max-w-[140px]"
          />

          <img
            src={gColimaLogo}
            alt="Logo Gobierno de Colima"
            className="hidden md:inline-block h-12 md:h-10 object-contain max-w-[140px]"
          />
        </div>

        {/* Menú (right) */}
        <div className="w-full sm:w-auto sm:ml-auto">
          <HorizontalMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

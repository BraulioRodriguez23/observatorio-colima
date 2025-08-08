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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        {/* Logos */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
          {/* Logo Colima – siempre visible */}
          <img
            src={logoColima}
            alt="Logo Colima"
            className="h-8 sm:h-10 md:h-12 object-contain"
          />

          {/* Manzanillo */}
          <img
            src={logoManzanillo}
            alt="Logo Manzanillo"
            className="hidden sm:block h-10 md:h-14 object-contain"
          />

          {/* Comala */}
          <img
            src={logoComala}
            alt="Logo Comala"
            className="hidden md:block h-12 md:h-18 object-contain"
          />

          {/* UdeC */}
          <img
            src={udcLogo}
            alt="Logo UdeC"
            className="hidden sm:block h-10 md:h-8 object-contain"
          />

          {/* Gobierno Colima */}
          <img
            src={gColimaLogo}
            alt="Logo Gobierno de Colima"
            className="hidden md:block h-12 md:h-6 object-contain"
          />
        </div>

        {/* Menú */}
        <div className="w-full sm:w-auto">
          <HorizontalMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

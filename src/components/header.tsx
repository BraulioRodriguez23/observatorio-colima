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
      <div className="flex flex-wrap justify-between items-center">
        {/* Logos */}
        <div className="flex items-center space-x-3">
          {/* Logo Colima – visible siempre, cambia tamaño según pantalla */}
          <img
            src={logoColima}
            alt="Logo Colima"
            className="h-8 sm:h-10 md:h-12 object-contain"
          />

          {/* Manzanillo – visible en sm+ */}
          <img
            src={logoManzanillo}
            alt="Logo Manzanillo"
            className="hidden sm:block h-10 md:h-16 object-contain"
          />

          {/* Comala – visible en md+ */}
          <img
            src={logoComala}
            alt="Logo Comala"
            className="hidden md:block h-12 md:h-20 object-contain"
          />

          {/* UdeC */}
          <img
            src={udcLogo}
            alt="Logo UdeC"
            className="hidden sm:block h-10 md:h-10 object-contain"
          />

          {/* Gobierno de Colima */}
          <img
            src={gColimaLogo}
            alt="Logo Gobierno de Colima"
            className="hidden md:block h-12 md:h-10 object-contain"
          />
        </div>

        {/* Menú */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <HorizontalMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

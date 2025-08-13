import React from 'react';
import logoColima from '../images/colima-logo.png';
import logoManzanillo from '../images/Manzanillo -logo.png';
import logoComala from '../images/Comala Pueblo Mágico.png';
import HorizontalMenu from './Horizontalmenu';
import udcLogo from '../images/UdeC_DosLineasIzq_Oro.png';
import gColimaLogo from '../images/Logo SUBSECRETARIA DE TURISMO.png';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 w-full bg-white bg-opacity-90 shadow-md z-50">
      <div className="flex items-center w-full">
        {/* ===== LOGOS: fuera del contenedor centrado para que queden pegados al borde ===== */}
        <div className="flex items-center gap-3 flex-shrink-0 pl-0">
          <img
            src={logoColima}
            alt="Logo Colima"
            className="h-8 sm:h-10 md:h-12 object-contain max-w-[180px] block"
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
            className="hidden sm:inline-block h-10 md:h-12 object-contain max-w-[160px]"
          />
          <img
            src={gColimaLogo}
            alt="Logo Gobierno de Colima"
            className="hidden md:inline-block h-20 md:h-14 object-contain max-w-[300px]"
          />
        </div>

        {/* ===== MENÚ: ocupa el resto y está contenido/centrado hasta un ancho máximo ===== */}
        <div className="flex-1">
          {/* Mantengo el menú dentro de un contenedor centrado pero con margen derecho. */}
          <div className="w-full max-w-screen-xl mx-auto flex justify-end pr-1">
            <HorizontalMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

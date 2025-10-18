import React from 'react';
import HorizontalMenu from './Horizontalmenu';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 w-full bg-white bg-opacity-90 shadow-md z-50 text-gray-800 overflow-x-hidden">
      <div className="flex items-center w-full">
        {/* ===== LOGOS: fuera del contenedor centrado para que queden pegados al borde ===== */}
        <div className="flex items-center gap-3 flex-shrink-0 pl-0">
          <img
            src="/images/colima-logo.webp"
            alt="Logo Colima"
            className="h-8 sm:h-10 md:h-12 object-contain max-w-[180px] block"
          />
          <img
            src="/images/Manzanillo-logo.webp"
            alt="Logo Manzanillo"
            className="hidden sm:inline-block h-10 md:h-14 object-contain max-w-[120px]"
          />
          <img
            src="/images/Comala-Pueblo Mágico.webp"
            alt="Logo Comala"
            className="hidden md:inline-block h-12 md:h-20 object-contain max-w-[140px]"
          />
          <img
            src="/images/UdeC_DosLineasIzq_Oro.webp"
            alt="Logo UdeC"
            className="hidden sm:inline-block h-10 md:h-12 object-contain max-w-[160px]"
          />
          <img
            src="/images/Logo-SUBSECRETARIA-DE-TURISMO.webp"
            alt="Logo Gobierno de Colima"
            className="hidden md:inline-block h-20 md:h-14 object-contain max-w-[280px]"
          />
        </div>

        {/* ===== MENÚ: ocupa el resto y está contenido/centrado hasta un ancho máximo ===== */}
        <div className="flex-1">
          <div className="w-full max-w-screen-xl mx-auto flex justify-end pr-1">
            <HorizontalMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

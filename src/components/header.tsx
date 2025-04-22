import React, { useEffect, useState } from 'react';
import logo from '../images/colima-logo.png';
import logomnz from '../images/Manzanillo marca turística.png'
import logocomala from '../images/Comala Pueblo Mágico.png'
import HorizontalMenu from './Horizontalmenu';



const logos = [logo, logomnz, logocomala];

const Header: React.FC = () => {
  const [currentLogo, setCurrentLogo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo(prev => (prev + 1) % logos.length);
    }, 3000); // cambia cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 left-0 w-full bg-white bg-opacity-90 flex justify-between items-center px-6 py-3 shadow-md z-50">
     <div className="w-[150px] h-[60px] flex items-center justify-center">
  <img
    src={logos[currentLogo]}
    alt="Logo Secretaría de Turismo"
    className="object-contain transition-opacity duration-500"
  />
</div>

      <HorizontalMenu />
    </header>
  );
};

export default Header;

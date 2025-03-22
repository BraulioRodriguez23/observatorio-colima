import React from 'react';
import logo from '../images/colima-logo.png';
import HorizontalMenu from './Horizontalmenu';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 flex justify-between items-center px-6 py-3 shadow-md z-50">
      <img 
        src={logo} 
        alt="Logo Secretaría de Turismo" 
        className="w-[80px] md:w-[150px]"
      />
      <HorizontalMenu />
    </header>
  );
};

export default Header;
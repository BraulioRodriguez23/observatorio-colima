import React from 'react';
import logo from '../images/colima-logo.png';
import '../index.css';
import './Horizontalmenu';
import HorizontalMenu from './Horizontalmenu';


export default function Home() {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full flex justify-between items-start">
        <img 
          src={logo} 
          alt="logo secretaria de turismo" 
          className="w-[80px] md:w-[150px] ml-1 mt-2"
        />
        <HorizontalMenu />
      </div>
    </div>
  );
}
import React from 'react';
import manzanillo from '../images/manzanillo.jpg'
export default function Mision() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6 text-pink-600">Bienvenidos!</h1>

      {/* Texto centrado con ancho controlado */}
      <p className="text-center max-w-3xl text-gray-700 mb-12">
        Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.
      </p>

      {/* Sección de Misión */}
      <section className="flex flex-col md:flex-row items-center mb-12">
        <img src={manzanillo} alt="Manzanillo" className="mb-4 md:mb-0 md:mr-4 w-full md:w-1/2 rounded" />
        <div className="text-gray-700 md:w-1/2">
          <h2 className="text-2xl  text-start font-bold text-pink-600 mb-1 underline">Misión</h2>
          <p className="leading-relaxed">
            Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.
          </p>
        </div>
      </section>

      {/* Sección de Visión */}
      <section className="flex flex-col md:flex-row-reverse items-center">
        <img src={manzanillo} alt="Manzanillo"  className="mb-2 md:mb-0 md:mr-4 w-full md:w-1/2 rounded" />
        <div className="text-gray-700 md:w-1/2">
          <h2 className="text-2xl text-start font-bold text-pink-600 mb-2 underline">Visión</h2>
          <p className="leading-relaxed">
            Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500.
          </p>
        </div>
      </section>
    </div>
  );
}

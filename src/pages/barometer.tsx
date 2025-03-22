import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../index.css';
import Header from '../components/header';
import Footer from '../components/piedepagina';
import Top from '../components/top';

const Barometer = () => {
  // Datos de ejemplo para el gráfico
  const data = [
    { name: 'Ene', Visitantes: 4000, Ocupación: 65 },
    { name: 'Feb', Visitantes: 3000, Ocupación: 70 },
    { name: 'Mar', Visitantes: 5000, Ocupación: 75 },
    { name: 'Abr', Visitantes: 4500, Ocupación: 60 },
    { name: 'May', Visitantes: 6000, Ocupación: 80 },
    { name: 'Jun', Visitantes: 7000, Ocupación: 85 },
  ];

  return (
    <div className="relative">
      <Header />
      <Top />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">Barómetro Turístico</h1>

        {/* Sección de métricas */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tarjeta 1: Visitantes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Visitantes</h2>
            <p className="text-3xl text-pink-600 font-bold">12,345</p>
            <p className="text-gray-500">Total este año</p>
          </div>

          {/* Tarjeta 2: Ocupación hotelera */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Ocupación Hotelera</h2>
            <p className="text-3xl text-pink-600 font-bold">75%</p>
            <p className="text-gray-500">Promedio mensual</p>
          </div>

          {/* Tarjeta 3: Satisfacción del turista */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Satisfacción del Turista</h2>
            <p className="text-3xl text-pink-600 font-bold">4.5/5</p>
            <p className="text-gray-500">Calificación promedio</p>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Visitantes y Ocupación Hotelera</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Visitantes" fill="#8884d8" />
              <Bar dataKey="Ocupación" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Otra sección de métricas */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Otras Métricas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta 4: Gasto promedio */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Gasto Promedio</h2>
            <p className="text-3xl text-pink-600 font-bold">$1,200</p>
            <p className="text-gray-500">Por turista</p>
          </div>

          {/* Tarjeta 5: Duración de la estancia */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Duración de la Estancia</h2>
            <p className="text-3xl text-pink-600 font-bold">4.2 días</p>
            <p className="text-gray-500">Promedio</p>
          </div>

          {/* Tarjeta 6: Origen de los turistas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Origen de los Turistas</h2>
            <p className="text-3xl text-pink-600 font-bold">60% Nacional</p>
            <p className="text-gray-500">40% Internacional</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Barometer;

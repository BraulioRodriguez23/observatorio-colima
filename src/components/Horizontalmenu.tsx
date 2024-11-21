import React, { useState } from 'react';

const HorizontalMenu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Inicio'); // Estado para la pestaña activa

  const tabs = [
    'Inicio',
    'Indicadores',
    'Inventario Turístico',
    'Barómetro Turístico',
    'Publicaciones',
  ];

  return (
    <div className="flex space-x-4 p-1 rounded-full justify-center">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(tab)}
          className={`py-1 px-5 rounded-full text-sm ${
            activeTab === tab ? 'bg-grey-950 text-white font-semibold shadow-sm' : 'bg-gray-500 text-gray-800'
          } hover:bg-white-400 transition-all`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default HorizontalMenu;

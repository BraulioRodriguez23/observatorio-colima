import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/piedepagina";
import MensualIndicador from "../components/MensualIndicador";
import TemporadaIndicador from "../components/TemporadaIndicador";
import FinesSemanaIndicador from "../components/FinesSemanaIndicador";

const TABS = [
  { label: "Corte mensual", value: "mensual" },
  { label: "Temporadas vacacionales", value: "temporada" },
  { label: "Fines de semana largos", value: "puentes" },
];

const IndicadoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].value);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex justify-center mt-6 mb-2">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`px-6 py-2 rounded-lg border-b-4 mx-2 transition-all duration-200 ${
              activeTab === tab.value
                ? "bg-pink-100 border-pink-500 text-pink-700 font-bold"
                : "bg-white border-transparent text-gray-500 hover:text-pink-600"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <main className="flex-grow max-w-7xl mx-auto w-full py-10">
        {activeTab === "mensual" && <MensualIndicador />}
        {activeTab === "puentes" && <FinesSemanaIndicador />}
        {activeTab === "temporada" && (
          <TemporadaIndicador
            data={[]} // Replace with your actual data array
            dataKey="" // Replace with the correct dataKey string
            xKey="" // Replace with the correct xKey string
            labelX="" // Replace with the correct labelX string
            labelY="" // Replace with the correct labelY string
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IndicadoresPage;

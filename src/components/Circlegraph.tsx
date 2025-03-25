// components/Indicators.tsx
import { motion } from "framer-motion";

// Importa tus imágenes
import OccupiedIcon from "../images/cuartos.svg";
import TouristIcon from "../images/llegada_turistas.svg";
import NightIcon from "../images/turistas_noche.svg";
import ChartIcon from "../images/porcentaje_ocupacion.svg";
import StayIcon from "../images/estadia_promedio.svg";
import DensityIcon from "../images/densidad.svg";
import VisitorsIcon from "../images/afluencia_visitantes.svg";
import MoneyIcon from "../images/derrama_economica.svg";
import { Link } from 'react-router-dom'; 

export default function CircleGraph() {
  const indicators = [
    { 
      title: "Cuartos ocupados", 
      value: "3,481,583",
      progress: 49.31,
      icon: OccupiedIcon
    },
    { 
      title: "Llegadas de turistas", 
      value: "5,360,574",
      progress: 78,
      icon: TouristIcon
    },
    { 
      title: "Turistas noche", 
      value: "9,790,310",
      progress: 85,
      icon: NightIcon
    },
    { 
      title: "Porcentaje de ocupación", 
      value: "49.31%",
      progress: 49.31,
      icon: ChartIcon
    },
    { 
      title: "Stadía promedio", 
      value: "1.83",
      progress: 60,
      icon: StayIcon
    },
    { 
      title: "Densidad de ocupación", 
      value: "2.81",
      progress: 70,
      icon: DensityIcon
    },
    { 
      title: "Afluencia de visitantes", 
      value: "13,852,823",
      progress: 90,
      icon: VisitorsIcon
    },
    { 
      title: "Derrama económica", 
      value: "15,041,035,829",
      progress: 100,
      icon: MoneyIcon
    }
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-800 mb-12 text-center">
          INDICADORES TURÍSTICOS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {indicators.map((indicator, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                {/* Círculo de fondo */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="#f3d7d5"
                    strokeWidth="8"
                  />
                </svg>

                {/* Círculo animado */}
                <motion.svg 
                  className="absolute top-0 left-0 w-full h-full transform -rotate-90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="#C70039"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                    animate={{ 
                      strokeDashoffset: 283 * (1 - indicator.progress / 100),
                      transition: { duration: 1.5 }
                    }}
                  />
                </motion.svg>

                {/* Contenido central */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-2">
                  <img 
                    src={indicator.icon} 
                    className="w-8 h-8 md:w-12 md:h-12 mb-2"
                    alt={indicator.title}
                  />
                  <span className="text-pink-800 font-bold text-xl md:text-2xl text-center">
                    {indicator.value}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-center text-sm md:text-base font-medium px-2 uppercase">
                {indicator.title}
              </p>
            </div>
          ))}
        </div>

        <Link 
          to="/inventario" 
          className="flex justify-center mb-8"
        >
          <button className="bg-pink-700 hover:bg-pink-800 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2">
            Ver más gráficas
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </Link>
      </div>
    </section>
  );
}
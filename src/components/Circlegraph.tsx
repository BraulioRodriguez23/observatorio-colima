// components/Indicators.tsx
import { motion } from "framer-motion";
import OccupiedIcon from "../../public/images/cuartos.svg";
import TouristIcon from "../../public/images/llegada_turistas.svg";
import NightIcon from "../../public/images/turistas_noche.svg";
import planeicon from "../../public/images/airplane_icon_strong_magenta.svg";
//import ChartIcon from "../images/porcentaje_ocupacion.svg";
import StayIcon from "../../public/images/estadia_promedio.svg";
import DensityIcon from "../../public/images/densidad.svg";
//import VisitorsIcon from "../images/afluencia_visitantes.svg";
import MoneyIcon from "../../public/images/derrama_economica.svg";
//import { Link } from 'react-router-dom'; 

export default function CircleGraph() {
  const generalIndicators = [
    { 
      title: "Afluencia turistica", 
      value: "1,564,622",
      progress: 49.31,
      icon: DensityIcon
    },
    { 
      title: "Derrama económica", 
      value: "5,375 mdp",
      progress: 78,
      icon: MoneyIcon
    },
    { 
      title: "Ocupacion hotelera", 
      value: "51.08%",
      progress: 51.08,
      icon: NightIcon
    },
    { 
      title: "Establecimientos de hospedaje", 
      value: "265",
      progress: 49.31,
      icon: StayIcon
    },
    { 
      title: "Oferta hotelera de cuartos", 
      value: "8,166",
      progress: 60,
      icon: OccupiedIcon
    },
    { 
      title: "Llegada de pasajeros en vuelos comerciales a Colima", 
      value: "102,271",
      progress: 70,
      icon: TouristIcon
    },
    { 
      title: "Llegada de pasajeros en vuelos comerciales a Manzanillo", 
      value: "104,136",
      progress: 90,
      icon: TouristIcon
    },
    { 
      title: "Llegada de vuelos comerciales a Colima", 
      value: "877",
      progress: 87.7,
      icon: planeicon
    },
    { 
      title: "Llegada de vuelos comerciales a Manzanillo", 
      value: "1,161",
      progress: 87.7,
      icon: planeicon
    },
    { 
      title: "Personas Beneficiadas con acciones de capacitacion turística", 
      value: "2,447",
      progress: 90,
      icon: DensityIcon
    }
  ];

  const manzanilloIndicators = [
    { 
      title: "Afluencia turística ", 
      value: "1,269,841",
      progress: 88,
      icon: DensityIcon
    },
    { 
      title: "Derrama económica ", 
      value: "4,752mdp",
      progress: 72.3,
      icon: MoneyIcon
    },
    { 
      title: "Ocupación hotelera", 
      value: "56.84%",
      progress: 56.84,
      icon: NightIcon
    },
    { 
      title: "Establecimientos de hospedaje", 
      value: "102",
      progress: 77.8,
      icon: StayIcon
    },
    { 
      title: "Oferta hotelera de cuartos", 
      value: "4,621",
      progress: 97,
      icon: OccupiedIcon
    },
    
  ];

  const IndicatorItem = ({ indicator }: { indicator: typeof generalIndicators[0] }) => (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
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
  );

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Sección de Indicadores Generales */}
        <h2 className="text-3xl font-bold text-pink-800 mb-12 text-center">
          INDICADORES TURÍSTICOS DEL ESTADO  DE COLIMA, CIERRE 2024
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {generalIndicators.map((indicator, index) => (
            <IndicatorItem key={`general-${index}`} indicator={indicator} />
          ))}
        </div>

        {/* Sección de Indicadores de Manzanillo */}
        <h2 className="text-3xl font-bold text-pink-800 mb-12 text-center">
          INDICADORES TURÍSTICOS DE MANZANILLO, CIERRE 2024
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {manzanilloIndicators.map((indicator, index) => (
            <IndicatorItem key={`manzanillo-${index}`} indicator={indicator} />
          ))}
        </div>

    
      </div>
    </section>
  );
}
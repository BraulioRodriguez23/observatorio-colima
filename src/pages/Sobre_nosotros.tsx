// src/pages/HeroSection.tsx

import { motion } from 'framer-motion';
import Header from '../components/header';
import Footer from '../components/piedepagina';

export default function HeroSection() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER fijo arriba */}
      <header className="z-10">
        <Header />
      </header>

      {/* CONTENIDO PRINCIPAL crece para llenar el espacio disponible */}
      <main className="flex-grow bg-gradient-to-r from-pink-700 to-pink-900 py-16 px-4 text-white">
        <div className="max-w-6xl mx-auto">
          {/* Título y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Observatorio Turístico de Colima
            </h1>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-justify">
            El Observatorio turístico del estado de Colima surge como una respuesta estratégica a la necesidad de contar con información confiable, sistematizada y útil sobre el comportamiento del turismo en la entidad. Esta iniciativa, impulsada por la Subsecretaría de Turismo de Gobierno del Estado en coordinación con la Universidad de Colima a través de la Facultad de Turismo, tiene como principal propósito apoyar la mejora continua del sector mediante un sistema de gestión de la información que permita el seguimiento regular de indicadores clave de desempeño turístico.
              </p>
            </div>
          </motion.div>

          {/* Descripción extendida */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Objetivo principal
            </h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-justify">
                  El monitoreo constante al sector turístico estatal, así como la generación de datos actuales para la toma de decisiones, pues esta información ayudará para la planeación y creación de estrategias que impulsen de diferentes formas el turismo en Colima.
            </p>
          </motion.div>

          {/* Decoración */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-16 h-1 bg-pink-300 rounded-full"></div>
          </motion.div>
        </div>
      </main>

      {/* FOOTER fijo abajo */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

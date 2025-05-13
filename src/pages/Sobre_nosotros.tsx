
import { motion } from 'framer-motion';

export default function HeroSection() {
return (
    <section className="bg-gradient-to-r from-pink-700 to-pink-900 py-16 px-4 text-white">
    <div className="max-w-6xl mx-auto">
        {/* Objetivo principal */}
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
        >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Observatorio Turístico de Colima
        </h1>
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
            <p className="text-xl md:text-2xl font-medium text-center leading-relaxed">
            "El monitoreo constante al sector turístico estatal, así como la generación de datos actuales para la toma de decisiones, pues esta información ayudará para la planeación y creación de estrategias que impulsen de diferentes formas el turismo en Colima."
            </p>
        </div>
        </motion.div>

        {/* Descripción del observatorio */}
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
        >
        <p className="text-lg md:text-xl leading-relaxed">
            El Observatorio turístico del estado de Colima surge como una respuesta estratégica a la necesidad de contar con información confiable, sistematizada y útil sobre el comportamiento del turismo en la entidad. Esta iniciativa, impulsada por la Subsecretaría de Turismo del Gobierno del Estado en coordinación con la Universidad de Colima a través de la Facultad de Turismo, tiene como principal propósito apoyar la mejora continua del sector mediante un sistema de gestión de la información que permita el seguimiento regular de indicadores clave de desempeño turístico.
        </p>
        </motion.div>

        {/* Elemento decorativo */}
        <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center mt-12"
        >
        <div className="w-16 h-1 bg-pink-300 rounded-full"></div>
        </motion.div>
    </div>
    </section>
);
}
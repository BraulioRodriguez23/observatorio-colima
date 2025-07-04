import { useState, useEffect } from 'react';
import '../index.css';
import Hero from '../components/Hero';
import Header from '../components/header';
import Indicators from '../components/Circlegraph';
import Footer from '../components/piedepagina';
import Disclaimer from '../components/disclaimer'; // importa el componente
import manza from '../images/Tecomán-Estero El chupadero.jpg';
import comala from '../images/fondo.jpg';

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Para no mostrarlo otra vez si ya fue aceptado
  useEffect(() => {
    const accepted = localStorage.getItem("disclaimerAccepted");
    if (accepted) {
      setShowDisclaimer(false);
    }
  }, []);

  const handleAccept = () => {
    setShowDisclaimer(false);
    localStorage.setItem("disclaimerAccepted", "true");
  };

  return (
    <div className="relative">
      {showDisclaimer && <Disclaimer onAccept={handleAccept} />}
      
      {!showDisclaimer && (
        <>
          <Header />
          <Hero />

          {/* Sección Misión y Visión */}
          <section className="py-16 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto space-y-20">
              <h1 className='text-pink-500 text-center font-bold'>Bienvenidos</h1>

              {/* Misión */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <img 
                  src={manza}
                  alt="Misión Manzanillo"
                  className="w-full rounded-xl shadow-md"
                />
                <div>
                  <p className="text-gray-800 leading-relaxed text-justify">
                    {/* ... tu texto ... */}
                  </p>
                </div>
              </div>

              {/* Visión */}
              <div className="grid md:grid-cols-2 gap-8 items-center ">
                <div>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {/* ... tu texto ... */}
                  </p>
                </div>
                <img 
                  src={comala}
                  alt="Visión Colima"
                  className="w-full rounded-xl shadow-md -mt-20"
                />
              </div>
            </div>
          </section>

          <Indicators />
          <Footer />
        </>
      )}
    </div>
  );
}

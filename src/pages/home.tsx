import '../index.css';
import Hero from '../components/Hero';
import Header from '../components/header';
import Indicators from '../components/Circlegraph';
import Footer from '../components/piedepagina';
import volcan from '../images/volcan.jpg';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <Hero />

      {/* Sección Bienvenido */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center">Bienvenidos</h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-gray-700">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Colima es un tesoro gastronómico, en sus “cenadurías” se conserva la autenticidad 
                de la cocina Colimota, en ellas podrás saborear los sopitos colimotes, las enchiladas 
                y también el pozole seco, que se ha convertido en uno de los platillos más icónicos 
                de la región.
              </p>
              <p className="text-lg leading-relaxed">
                A través de las actividades de la comunidad, nosotros somos diferentes tipos de 
                recursos que se encuentran en el mundo. El centro de los recursos humanos es un 
                sistema de trabajo y la vida de nuestros objetivos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={volcan} 
                alt="Turismo Colima"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <Link to="/inventario">
                <button className="w-full py-3.5 bg-pink-700 hover:bg-pink-800 text-white rounded-lg 
                               transition-all font-semibold text-lg">
                  Conoce más
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Indicadores */}
      <Indicators />

      <Footer />
    </div>
  );
}
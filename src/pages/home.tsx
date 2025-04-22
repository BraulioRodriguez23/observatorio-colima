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
              La suma de características naturales y económicas, aunadas a la riqueza cultural de diversas localidades del Estado, han significado un atractivo que motiva la llegada de visitantes y turistas, tanto nacionales como internacionales. De esta manera, el turismo se ha posicionado, desde principios del siglo XX, como una de las actividades económicas y sociales más importantes del estado de Colima. Destinos como Manzanillo, Cuyutlán, Tecomán, Colima, Villa de Álvarez y Comala, albergan una amplia variedad de experiencias que abarcan desde sol y playa, gastronomía, negocios hasta turismo cultural, natural, rural y de aventura. 

              </p>
              <p className="text-lg leading-relaxed">
              Sin embargo, uno de los principales retos que enfrenta el sector turismo es la falta de datos confiables en el Estado, situación que obstaculiza la toma de decisiones informadas para impulsar una gestión turística más competitiva y sostenible. Esta problemática ha sido reconocida en el Plan Estatal de Desarrollo 2021-2027, que plantea la cultura del dato como un eje fundamental para el mejoramiento del desempeño del destino.
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
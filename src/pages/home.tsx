import '../index.css';
import Hero from '../components/Hero';
import Header from '../components/header';
import Indicators from '../components/Circlegraph';
import Footer from '../components/piedepagina';
import volcan from '../images/volcan.jpg';


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
              La suma de características naturales y económicas, aunadas a la riqueza cultural de diversas localidades del Estado, han significado un atractivo que motiva la llegada de visitantes y turistas, tanto nacionales como internacionales. De esta manera, el turismo se ha posicionado, desde principios del siglo XX, como una de las actividades económicas y sociales más importantes del estado de Colima. Destinos como Manzanillo, Armería , Tecomán, Colima, Villa de Álvarez y Comala, albergan una amplia variedad de experiencias que abarcan desde sol y playa, gastronomía, negocios hasta turismo cultural, natural, rural y de aventura. 

              </p>
              <p className="text-lg leading-relaxed">
              Sin embargo, uno de los principales retos que enfrenta el sector turismo es la falta de datos confiables en el Estado, situación que obstaculiza la toma de decisiones informadas para impulsar una gestión turística más competitiva y sostenible. Esta problemática ha sido reconocida en el Plan Estatal de Desarrollo 2021-2027, que plantea la cultura del dato como un eje fundamental para el mejoramiento del desempeño del destino.
              </p>
              <p className="text-lg leading-relaxed">
              Este sitio web tiene como propósito hacer publica la visión integral y actualizada del comportamiento de la actividad turística en los destinos del Estado, compartiendo análisis e interpretación de datos, e investigaciones confiables y de vanguardia que contribuyan a la toma de decisiones estratégicas por parte de autoridades, prestadores de servicios turísticos, académicos y demás actores involucrados en el desarrollo de nuestro sector turismo. 
              <br></br>
              <a>     Ing. Jorge Padilla Castillo</a>
              <br></br>
              <a>Subsecretario de Turismo de la Secretaría de Desarrollo Económico </a>
              <br></br>
              <a>Gobierno del Estado de Colima</a>
              </p>
            </div>
            
          <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
  <img 
    src={volcan} 
    alt="Turismo Colima"
    className="w-full h-full object-cover rounded-xl"
  />
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
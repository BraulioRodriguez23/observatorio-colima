import '../index.css';
import Hero from '../components/Hero';
import Header from '../components/header';
import Indicators from '../components/Circlegraph';
import Footer from '../components/piedepagina';
import manza from '../images/Tecomán-Estero El chupadero.jpg';
import comala from '../images/fondo.jpg'


export default function Home() {
  return (
    <div className="relative">
      <Header />
      <Hero />

{/* Sección Misión y Visión */}
<section className="py-16 px-4 bg-slate-50">
  <div className="max-w-6xl mx-auto space-y-20">

    <h1 className='text-pink-500 text-center font-bold'>Bienvenidos</h1>

    {/* Misión */}
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <img 
        src={manza} // Reemplaza con tu imagen real
        alt="Misión Manzanillo"
        className="w-full rounded-xl shadow-md"
      />
      <div>
       
        <p className="text-gray-800 leading-relaxed text-justify">
        La suma de características naturales y económicas, aunadas a la riqueza cultural de diversas localidades del Estado, han significado un atractivo que motiva la llegada de visitantes y turistas, tanto nacionales como internacionales. De esta manera, el turismo se ha posicionado, desde principios del siglo XX, como una de las actividades económicas y sociales más importantes del estado de Colima. Destinos como Manzanillo, Armería, Tecomán, Colima, Villa de Álvarez y Comala, albergan una amplia variedad de experiencias que abarcan desde sol y playa, gastronomía, negocios hasta turismo cultural, natural, rural y de aventura. 
<br />
Sin embargo, uno de los principales retos que enfrenta el sector turismo es la falta de datos confiables en el Estado, situación que obstaculiza la toma de decisiones informadas para impulsar una gestión turística más competitiva y sostenible. Esta problemática ha sido reconocida en el Plan Estatal de Desarrollo 2021-2027, que plantea la cultura del dato como un eje fundamental para el mejoramiento del desempeño del destino
        </p>
      </div>
    </div>

    {/* Visión */}
    <div className="grid md:grid-cols-2 gap-8 items-center ">
      <div>
        
        <p className="text-gray-700 leading-relaxed text-justify">
        En este contexto, el Observatorio Turístico del Estado de Colima representa una herramienta clave, que en este primer ejercicio 2024-2025 nos permite conocer a profundidad el “Perfil y grado de satisfacción de los turistas que visitan el estado en temporadas vacacionales” brindando información desagregada por municipio y por temporada, cuyo resultado permite caracterizar a los visitantes nacionales e internacionales, conocer sus hábitos de viaje, motivaciones, nivel de gasto, medios de transporte utilizados, satisfacción con los servicios recibidos y disposición a recomendar el destino, entre otros indicadores.
<br />
Este sitio web tiene como propósito hacer publica la visión integral y actualizada del comportamiento de la actividad turística en los destinos del Estado, compartiendo análisis e interpretación de datos, e investigaciones confiables y de vanguardia que contribuyan a la toma de decisiones estratégicas por parte de autoridades, prestadores de servicios turísticos, académicos y demás actores involucrados en el desarrollo de nuestro sector turismo. 
     <br />
     <b>Ing. Jorge Padilla Castillo</b>
     <br />
     <b>Subsecretario de Turismo de la Secretaría de Desarrollo Económico 
     de Gobierno del Estado de Colima </b>

        </p>
        
      </div>
      <img 
        src={comala} // Reemplaza con tu imagen real
        alt="Visión Colima"
        className="w-full rounded-xl shadow-md -mt-20"
      />
    </div>

  </div>
</section>


      {/* Sección de Indicadores */}
      <Indicators />

      <Footer />
    </div>
  );
}
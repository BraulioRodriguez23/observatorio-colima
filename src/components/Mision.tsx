import imagencol from '../images/volcan.jpg'; // Nombre más descriptivo

export default function MisionVision() {
  // Contenido real para reemplazar lorem ipsum
  const contenido = {
    bienvenida: "Bienvenidos al Observatorio Turístico de Colima",
    descripcion: "Somos el organismo encargado de promover y analizar el desarrollo turístico de nuestro estado.",
    mision: {
      titulo: "Misión",
      texto: "Impulsar el crecimiento sostenible del sector turístico mediante el análisis estratégico y la colaboración intersectorial."
    },
    vision: {
      titulo: "Visión",
      texto: "Ser el referente nacional en la gestión turística innovadora para el año 2025."
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="container max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-xl">
        {/* Encabezado */}
        <h1 className="text-4xl font-bold mb-6 text-rose-600 text-center">
          {contenido.bienvenida}
        </h1>

        {/* Descripción principal */}
        <p className="text-center max-w-3xl text-gray-600 text-lg mb-12 mx-auto leading-relaxed">
          {contenido.descripcion}
        </p>

        {/* Sección de Misión */}
        <section className="flex flex-col md:flex-row items-center mb-12 gap-8">
          <img 
            src={imagencol} 
            alt="Atractivos turísticos de Colima" 
            className="w-full md:w-1/2 h-64 object-cover rounded-xl shadow-md"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-rose-600 mb-4 border-b-2 border-rose-500 pb-2">
              {contenido.mision.titulo}
            </h2>
            <p className="text-gray-600 leading-relaxed text-justify">
              {contenido.mision.texto}
            </p>
          </div>
        </section>

        {/* Sección de Visión */}
        <section className="flex flex-col md:flex-row-reverse items-center gap-8">
          <img 
            src={imagencol} 
            alt="Cultura colimenssse" 
            className="w-full h-auto object-cover rounded-xl"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-rose-600 mb-4 border-b-2 border-rose-500 pb-2">
              {contenido.vision.titulo}
            </h2>
            <p className="text-gray-600 leading-relaxed text-justify">
              {contenido.vision.texto}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
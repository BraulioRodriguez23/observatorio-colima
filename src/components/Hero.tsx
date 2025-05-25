// Hero.tsx (Componente actualizado)import ballenaImg from '../assets/ballena.jpg';
import ballenaImg from '../images/Manzanillo-LasHadasClubdeYates.jpg';
export default function Hero() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${ballenaImg})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
          Observatorio Turístico del Estado de Colima
        </h1>
        
        <div className="max-w-3xl space-y-4 mb-8">
          <p className="text-xl md:text-2xl">
            Espacio de análisis técnico e interdisciplinario para el desarrollo turístico
          </p>
         
        </div>
      </div>
    </div>
  );
}

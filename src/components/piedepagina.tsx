

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Sección Superior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Información */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Sobre Nosotros</h3>
            <p className="mt-4 text-sm">
              Somos un observatorio turístico comprometido con el desarrollo turístico sostenible en Colima.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Enlaces útiles</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">Inicio</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Indicadores</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Mapa</a>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Síguenos</h3>
            <div className="flex justify-center md:justify-start mt-4 space-x-4">
              <a href="#" className="hover:text-pink-400">
                <i className="fab fa-facebook"></i> Facebook
              </a>
              <a href="#" className="hover:text-pink-400">
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Observatorio Turístico de Colima. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

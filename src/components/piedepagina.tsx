export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Sección Superior */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Información */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Sobre Nosotros</h3>
            <p className="mt-4 text-sm">
              El Observatorio turístico del estado de Colima surge como una respuesta estratégica a la necesidad de contar con información confiable, sistematizada y útil sobre el comportamiento del turismo en la entidad. Esta iniciativa, impulsada por la Subsecretaría de Turismo del Gobierno del Estado en coordinación con la Universidad de Colima a través de la Facultad de Turismo, tiene como principal propósito apoyar la mejora continua del sector mediante un sistema de gestión de la información que permita el seguimiento regular de indicadores clave de desempeño turístico.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Enlaces útiles</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">Inicio</a></li>
              <li><a href="#" className="hover:underline">Indicadores</a></li>
              <li><a href="#" className="hover:underline">Mapa</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Síguenos</h3>
            <div className="flex flex-col items-center md:items-start mt-4 space-y-2">
              <a href="https://www.facebook.com/SecturColimaOficial?locale=es_LA" className="hover:text-pink-400">
                <i className="fab fa-facebook"></i> Facebook
              </a>
              <a href="https://x.com/Colima_Turismo" className="hover:text-pink-400">
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a href="https://www.instagram.com/turismo_colima/" className="hover:text-pink-400">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://www.youtube.com/@turismocolima2042" className="hover:text-pink-400">
                <i className="fab fa-youtube"></i> YouTube
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Contáctanos</h3>
            <p className="mt-4 text-sm">
              Complejo Administrativo de Gobierno del Estado de Colima, edificio A, segundo piso, Tercer Anillo Periférico Esq. Ejército Mexicano S/N<br />
              Colonia El Diezmo | C.P. 28010 | Colima, Colima, México<br />
              Tel: 312 316 2000 ext. 25006 y 25033<br />
              Directo: 312 316 2021<br />
              Correo: <a href="mailto:sectur.estadisticas@gmail.com" className="underline hover:text-pink-400">sectur.estadisticas@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Observatorio Turístico de Colima. Todos los derechos reservados.<br />
            Subsecretaría de Turismo del Gobierno del Estado de Colima.
          </p>
        </div>
      </div>
    </footer>
  );
}

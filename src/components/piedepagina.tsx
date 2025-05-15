import udcLogo from '../images/logoudc.png'
import gColimaLogo from '../images/escudo1.jpg';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">

       

        {/* Sección Superior */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Sobre Nosotros</h3>
            <p className="mt-4 text-sm">
              El Observatorio turístico del estado de Colima surge como una respuesta estratégica a la necesidad de contar con información confiable, sistematizada y útil sobre el comportamiento del turismo en la entidad. Esta iniciativa, impulsada por la Subsecretaría de Turismo del Gobierno del Estado en coordinación con la Universidad de Colima a través de la Facultad de Turismo, tiene como principal propósito apoyar la mejora continua del sector mediante un sistema de gestión de la información que permita el seguimiento regular de indicadores clave de desempeño turístico.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Enlaces útiles</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="https://visitacolima.mx/" className="hover:underline">Visita Colima</a></li>
              <li><a href="https://visitmanzanillo.mx/" className="hover:underline">Visita Manzanillo</a></li>
              <li><a href="https://www.gob.mx/sectur" className="hover:underline">Sectur</a></li>
              <li><a href="https://cedocvirtual.sectur.gob.mx/janium-bin/janium_login.pl" className="hover:underline">Cedoc</a></li>
              <li><a href="https://atlasturistico.sectur.gob.mx" className="hover:underline">Atlas Turístico</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Síguenos</h3>
            <div className="flex flex-col items-center md:items-start mt-2 space-y-2">
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
           {/* Logos */}
        <div className="flex justify-center md:justify-start space-x-6 mb-7">
         

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
        <div className="border-t border-gray-700 mt-4 pt-2 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Observatorio Turístico de Colima. Todos los derechos reservados.<br />
            Subsecretaría de Turismo de Gobierno del Estado de Colima.
          </p>
        </div>
         <img 
            src={udcLogo}
            alt="Universidad de Colima"
            className="h-15 object-contain "
          />
          
          <img
            src={gColimaLogo}
            alt="Gobierno del Estado de Colima"
            className="h-15 object-contain"
          />
        </div>
      </div>
    </footer>
  );
}

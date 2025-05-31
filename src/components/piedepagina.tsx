
import udcLogo from '../images/UdeC_DosLineasIzq_Oro.png';
import gColimaLogo from '../images/Logo SUBSECRETARIA DE TURISMO.png';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Sección Superior: 3 columnas centradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-8">

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Enlaces útiles</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="https://visitacolima.mx/" className="hover:underline">Visita Colima</a></li>
              <li><a href="https://visitmanzanillo.mx/" className="hover:underline">Visita Manzanillo</a></li>
              <li><a href="https://www.gob.mx/sectur" className="hover:underline">Sectur Federal</a></li>
              <li><a href="https://cedocvirtual.sectur.gob.mx/janium-bin/janium_login.pl" className="hover:underline">Cedoc virtual</a></li>
              <li><a href="https://atlasturistico.sectur.gob.mx" className="hover:underline">Atlas turístico</a></li>
              <li><a href="https://www.gob.mx/sectur/acciones-y-programas/instituto-de-competitividad-turistica" className="hover:underline">Instituto de competitividad turística</a></li>
              <li><a href="https://www.gob.mx/tramites/ficha/inscripcion-a-la-red-de-investigadores-y-centros-de-investigacion-en-turismo-ricit/ICTUR6101" className="hover:underline">RICIT</a></li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400">Síguenos Visita Colima</h3>
            <div className="flex flex-col items-center mt-2 space-y-2">
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

        {/* Logos alineados */}
        <div className="flex justify-center items-center space-x-4 mb-4">
          <img
            src={udcLogo}
            alt="Universidad de Colima"
            className="h-20 object-contain"
          />
          <img
            src={gColimaLogo}
            alt="Gobierno del Estado de Colima"
            className="h-20 object-contain"
          />
        </div>

        {/* Sección Inferior */}
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Observatorio Turístico de Colima. Todos los derechos reservados.<br />
            Subsecretaría de Turismo de Gobierno del Estado de Colima.
          </p>
        </div>
      </div>
    </footer>
  );
}

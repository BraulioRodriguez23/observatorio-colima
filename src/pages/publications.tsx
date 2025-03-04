import '../index.css';

import Header from '../components/header';
import Footer from '../components/piedepagina';
import Top from '../components/top';

export default function Publications() {
  return (
    <div className="relative">
      <Header />
      <Top />
      
      <section className="bg-blue-50 py-4">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center">Últimas Publicaciones</h2>
          <h3 className="text-3xl font-bold text-pink-600 mb-8 text-left">Ve las últimas noticias turísticas</h3>            
        </div>
      </section>
      
      <section className="py-8 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img 
                src={`../images/colima-logo.png${item}`} 
                alt="Noticia turística" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-800">Título de la Noticia {item}</h4>
                <p className="text-gray-600 mt-2">Descripción breve de la noticia turística para atraer la atención del lector.</p>
                <a href="#" className="text-blue-500 hover:underline mt-2 block">Leer más...</a>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

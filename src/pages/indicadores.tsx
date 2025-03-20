// pages/indicadores.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from '../components/header';
import TourismChart from '../components/TourismChart';
import Footer from '../components/piedepagina';

const Indicadores: React.FC = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Visitantes');
  const [municipio, setMunicipio] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [errorFecha, setErrorFecha] = useState<string>('');

  const municipiosColima: string[] = [
    'Colima',
    'Tecomán',
    'Manzanillo',
    'Villa de Álvarez',
    'Coquimatlán',
    'Comala',
    'Cuauhtémoc',
    'Armería',
    'Ixtlahuacán',
    'Minatitlán',
  ];

  const handleCategoriaClick = (categoria: string): void => {
    setCategoriaSeleccionada(categoria);
  };

  const handleFechaInicioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const nuevaFechaInicio = e.target.value;
    const fechaActual = new Date().toISOString().split('T')[0];

    if (nuevaFechaInicio < fechaActual) {
      setErrorFecha('La fecha de inicio no puede ser anterior a la fecha actual.');
    } else {
      setErrorFecha('');
      setFechaInicio(nuevaFechaInicio);
    }
  };

  const handleFechaFinChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFechaFin(e.target.value);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (!municipio || !fechaInicio || !fechaFin) {
      setErrorFecha('Todos los campos son obligatorios.');
      return;
    }

    if (fechaInicio > fechaFin) {
      setErrorFecha('La fecha de inicio no puede ser mayor a la fecha de fin.');
      return;
    }

    setErrorFecha('');
    // Aquí iría la llamada a tu API
    console.log('Filtrar datos:', { municipio, fechaInicio, fechaFin });
  };

  return (
    <div className="relative">
      <Header />
      
      {/* Botones de categorías */}
      <section className="bg-blue-50 py-4">
        <div className="max-w-6xl mx-auto flex justify-center space-x-4">
          {[
            'Visitantes',
            'Personas Ocupadas',
            'Economía',
            'Sensibilización',
            'Inversión',
            'Hospedaje',
            'Calidad de vida',
          ].map((categoria) => (
            <button
              key={categoria}
              className={`bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition shadow-md ${
                categoriaSeleccionada === categoria ? 'bg-pink-700' : ''
              }`}
              onClick={() => handleCategoriaClick(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </section>

      {/* Sección principal */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Gráfico */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center">
              Gráfica de Turismo
            </h2>
            <TourismChart
              categoria={categoriaSeleccionada}
              municipio={municipio}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
            />
          </div>

          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Filtrar datos
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">
                  Municipio
                </label>
                <select
                  id="municipio"
                  className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  value={municipio}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setMunicipio(e.target.value)}
                >
                  <option value="">Seleccione un municipio</option>
                  {municipiosColima.map((mun) => (
                    <option key={mun} value={mun}>
                      {mun}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fecha-inicio" className="block text-sm font-medium text-gray-700">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="fecha-inicio"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  value={fechaInicio}
                  onChange={handleFechaInicioChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label htmlFor="fecha-fin" className="block text-sm font-medium text-gray-700">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  id="fecha-fin"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  value={fechaFin}
                  onChange={handleFechaFinChange}
                />
              </div>

              {errorFecha && <p className="text-red-500 text-sm">{errorFecha}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Aplicar filtro
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Indicadores;
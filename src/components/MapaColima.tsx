import React, { useState } from 'react';
import { ReactComponent as ColimaMap } from '../assets/colima-municipios.svg';

interface Municipio {
  id: string;
  nombre: string;
  porcentaje: string;
}

const municipios: Municipio[] = [
  { id: 'manzanillo', nombre: 'Manzanillo', porcentaje: '42.00%' },
  { id: 'tecoman', nombre: 'Tecomán', porcentaje: '35.00%' },
  { id: 'armeria', nombre: 'Armería', porcentaje: '37.00%' },
  { id: 'colima', nombre: 'Colima', porcentaje: '39.00%' },
  { id: 'villa', nombre: 'Villa de Álvarez', porcentaje: '41.00%' },
  { id: 'comala', nombre: 'Comala', porcentaje: '33.00%' },
  { id: 'coquimatlan', nombre: 'Coquimatlán', porcentaje: '30.00%' },
  { id: 'cuauhtemoc', nombre: 'Cuauhtémoc', porcentaje: '38.00%' },
  { id: 'ixtlahuacan', nombre: 'Ixtlahuacán', porcentaje: '36.00%' },
  { id: 'minatitlan', nombre: 'Minatitlán', porcentaje: '32.00%' },
];

const MapaColima: React.FC = () => {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const municipioSeleccionado = municipios.find(m => m.id === seleccionado);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Mapa Interactivo de Colima</h2>
      <div className="flex gap-8">
        {/* Mapa SVG */}
        <div className="w-1/2 border p-2">
          <ColimaMap
            className="w-full h-auto cursor-pointer"
            onClick={(event) => {
              const target = event.target as SVGElement;
              const municipioId = target.id; // El ID de cada municipio en el SVG
              if (municipios.some(m => m.id === municipioId)) {
                setSeleccionado(municipioId);
              }
            }}
          />
        </div>

        {/* Información del municipio */}
        <div className="w-1/3 border p-4 bg-gray-100">
          <h3 className="text-lg font-semibold">Información</h3>
          {municipioSeleccionado ? (
            <div>
              <p className="font-medium">Municipio: {municipioSeleccionado.nombre}</p>
              <p className="text-blue-600">Visitas: {municipioSeleccionado.porcentaje}</p>
            </div>
          ) : (
            <p className="text-gray-500">Selecciona un municipio en el mapa</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapaColima;

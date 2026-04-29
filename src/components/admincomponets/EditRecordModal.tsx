import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

type ExcelType = 'mensual' | 'temporada' | 'puentes';

interface Props {
  excelType: ExcelType;
  record: any;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onClose: () => void;
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const TEMPORADAS = ['Semana Santa','Verano','Navidad','Año Nuevo','Día de Muertos'];
const MUNICIPIOS = ['Colima','Manzanillo','Comala','Cuauhtémoc','Armería','Tecomán','Villa de Álvarez','Ixtlahuacán','Minatitlán','Coquimatlán'];

const ROUTE_MAP: Record<ExcelType, string> = {
  mensual: 'monthly-stats',
  temporada: 'season-stats',
  puentes: 'long-weekend-stats',
};

export const EditRecordModal: React.FC<Props> = ({ excelType, record, onSuccess, onError, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({ ...record });

  // Update formData if record changes
  useEffect(() => {
    setFormData({ ...record });
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const route = ROUTE_MAP[excelType];
      
      let body: Record<string, unknown> = { ...formData };
      
      // Ensure numeric fields are numbers
      Object.keys(body).forEach(key => {
        if (key !== 'month' && key !== 'season' && key !== 'municipality' && key !== 'bridge_name' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'id') {
           body[key] = Number(body[key]);
        }
      });

      const res = await fetch(`${API_URL}/${route}/${record.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al actualizar el registro.');
      }

      onSuccess('Registro actualizado correctamente.');
      onClose();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800">
            Editar registro — {excelType === 'mensual' ? 'Corte mensual' : excelType === 'temporada' ? 'Temporada vacacional' : 'Fin de semana largo'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            {/* ── MENSUAL ── */}
            {excelType === 'mensual' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="number" required className={inputClass} value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Mes *</label>
                  <select className={inputClass} value={formData.month || ''} onChange={e => setFormData({ ...formData, month: e.target.value })}>
                    {MESES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select className={inputClass} value={formData.municipality || ''} onChange={e => setFormData({ ...formData, municipality: e.target.value })}>
                    {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ocupación (%)</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.occupancyRate ?? formData.occupancy_rate ?? ''} onChange={e => setFormData({ ...formData, occupancyRate: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Turistas</label>
                  <input type="number" className={inputClass} value={formData.touristFlow ?? formData.tourist_flow ?? ''} onChange={e => setFormData({ ...formData, touristFlow: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Impacto Económico</label>
                  <input type="number" className={inputClass} value={formData.economicImpact ?? formData.economic_impact ?? ''} onChange={e => setFormData({ ...formData, economicImpact: e.target.value })} />
                </div>
              </div>
            )}

            {/* ── TEMPORADA ── */}
            {excelType === 'temporada' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="number" required className={inputClass} value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Temporada *</label>
                  <select className={inputClass} value={formData.season || ''} onChange={e => setFormData({ ...formData, season: e.target.value })}>
                    {TEMPORADAS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select className={inputClass} value={formData.municipality || ''} onChange={e => setFormData({ ...formData, municipality: e.target.value })}>
                    {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ocupación (%)</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.occupancyRate ?? ''} onChange={e => setFormData({ ...formData, occupancyRate: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Afluencia Turística</label>
                  <input type="number" className={inputClass} value={formData.touristFlow ?? ''} onChange={e => setFormData({ ...formData, touristFlow: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Derrama Económica</label>
                  <input type="number" className={inputClass} value={formData.economicImpact ?? ''} onChange={e => setFormData({ ...formData, economicImpact: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Oferta de Cuartos</label>
                  <input type="number" className={inputClass} value={formData.roomOffer ?? ''} onChange={e => setFormData({ ...formData, roomOffer: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Ocupados</label>
                  <input type="number" className={inputClass} value={formData.occupiedRooms ?? ''} onChange={e => setFormData({ ...formData, occupiedRooms: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Disponibles</label>
                  <input type="number" className={inputClass} value={formData.availableRooms ?? ''} onChange={e => setFormData({ ...formData, availableRooms: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Estadía promedio</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.stay ?? ''} onChange={e => setFormData({ ...formData, stay: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Densidad</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.density ?? ''} onChange={e => setFormData({ ...formData, density: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Turistas/noche</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.touristsPerNight ?? ''} onChange={e => setFormData({ ...formData, touristsPerNight: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Gasto promedio</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.avgSpending ?? ''} onChange={e => setFormData({ ...formData, avgSpending: e.target.value })} />
                </div>
              </div>
            )}

            {/* ── PUENTES ── */}
            {excelType === 'puentes' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="number" required className={inputClass} value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Nombre del Puente *</label>
                  <input type="text" required className={inputClass} value={formData.bridge_name || ''} onChange={e => setFormData({ ...formData, bridge_name: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select className={inputClass} value={formData.municipality || ''} onChange={e => setFormData({ ...formData, municipality: e.target.value })}>
                    {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ocupación (%)</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.occupancy_rate ?? ''} onChange={e => setFormData({ ...formData, occupancy_rate: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Afluencia Turística</label>
                  <input type="number" className={inputClass} value={formData.tourist_flow ?? ''} onChange={e => setFormData({ ...formData, tourist_flow: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Impacto Económico</label>
                  <input type="number" className={inputClass} value={formData.economic_impact ?? ''} onChange={e => setFormData({ ...formData, economic_impact: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Oferta de Cuartos</label>
                  <input type="number" className={inputClass} value={formData.room_offer ?? ''} onChange={e => setFormData({ ...formData, room_offer: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Ocupados</label>
                  <input type="number" className={inputClass} value={formData.occupied_rooms ?? ''} onChange={e => setFormData({ ...formData, occupied_rooms: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Disponibles</label>
                  <input type="number" className={inputClass} value={formData.available_rooms ?? ''} onChange={e => setFormData({ ...formData, available_rooms: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Estadía promedio</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.average_stay ?? ''} onChange={e => setFormData({ ...formData, average_stay: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Densidad de Ocupación</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.occupancy_density ?? ''} onChange={e => setFormData({ ...formData, occupancy_density: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Noches</label>
                  <input type="number" className={inputClass} value={formData.nights ?? ''} onChange={e => setFormData({ ...formData, nights: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Turistas/noche</label>
                  <input type="number" className={inputClass} value={formData.tourists_per_night ?? ''} onChange={e => setFormData({ ...formData, tourists_per_night: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Gasto diario promedio</label>
                  <input type="number" step="0.01" className={inputClass} value={formData.daily_avg_spending ?? ''} onChange={e => setFormData({ ...formData, daily_avg_spending: e.target.value })} />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6 border-t border-gray-200 pt-5">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;

import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL;

type ExcelType = 'mensual' | 'temporada' | 'puentes';

interface Props {
  excelType: ExcelType;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const TEMPORADAS = ['Semana Santa','Verano','Navidad','Año Nuevo','Día de Muertos'];
const MUNICIPIOS = ['Colima','Manzanillo','Comala','Cuauhtémoc','Armería','Tecomán','Villa de Álvarez','Ixtlahuacán','Minatitlán','Coquimatlán'];

const initialMensual = { year: '', month: 'Enero', municipality: 'Colima', occupancyRate: '', touristFlow: '', economicImpact: '' };
const initialTemporada = { year: '', season: 'Semana Santa', municipality: 'Colima', occupancyRate: '', touristFlow: '', economicImpact: '', roomOffer: '', occupiedRooms: '', availableRooms: '', stay: '', density: '', touristsPerNight: '', avgSpending: '' };
const initialPuentes = { year: '', bridge_name: '', municipality: 'Colima', occupancy_rate: '', tourist_flow: '', economic_impact: '', room_offer: '', occupied_rooms: '', available_rooms: '', average_stay: '', occupancy_density: '', nights: '', tourists_per_night: '', daily_avg_spending: '' };

const ROUTE_MAP: Record<ExcelType, string> = {
  mensual: 'monthly-stats',
  temporada: 'season-stats',
  puentes: 'long-weekend-stats',
};

export const SingleRecordForm: React.FC<Props> = ({ excelType, onSuccess, onError }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensual, setMensual] = useState({ ...initialMensual });
  const [temporada, setTemporada] = useState({ ...initialTemporada });
  const [puentes, setPuentes] = useState({ ...initialPuentes });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || '';
      const route = ROUTE_MAP[excelType];
      let body: Record<string, unknown> = {};

      if (excelType === 'mensual') {
        body = { ...mensual, year: Number(mensual.year), occupancyRate: Number(mensual.occupancyRate), touristFlow: Number(mensual.touristFlow), economicImpact: Number(mensual.economicImpact) };
      } else if (excelType === 'temporada') {
        body = { ...temporada, year: Number(temporada.year), occupancyRate: Number(temporada.occupancyRate), touristFlow: Number(temporada.touristFlow), economicImpact: Number(temporada.economicImpact), roomOffer: Number(temporada.roomOffer), occupiedRooms: Number(temporada.occupiedRooms), availableRooms: Number(temporada.availableRooms), stay: Number(temporada.stay), density: Number(temporada.density), touristsPerNight: Number(temporada.touristsPerNight), avgSpending: Number(temporada.avgSpending) };
      } else {
        body = { ...puentes, year: Number(puentes.year), occupancy_rate: Number(puentes.occupancy_rate), tourist_flow: Number(puentes.tourist_flow), economic_impact: Number(puentes.economic_impact), room_offer: Number(puentes.room_offer), occupied_rooms: Number(puentes.occupied_rooms), available_rooms: Number(puentes.available_rooms), average_stay: Number(puentes.average_stay), occupancy_density: Number(puentes.occupancy_density), nights: Number(puentes.nights), tourists_per_night: Number(puentes.tourists_per_night), daily_avg_spending: Number(puentes.daily_avg_spending) };
      }

      const res = await fetch(`${API_URL}/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al guardar el registro.');
      }

      // Reset form
      if (excelType === 'mensual') setMensual({ ...initialMensual });
      else if (excelType === 'temporada') setTemporada({ ...initialTemporada });
      else setPuentes({ ...initialPuentes });

      setOpen(false);
      onSuccess('Registro agregado correctamente.');
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Agregar registro individual
      </button>

      {open && (
        <div className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
          <h3 className="text-base font-bold text-gray-700 mb-4">
            Nuevo registro — {excelType === 'mensual' ? 'Corte mensual' : excelType === 'temporada' ? 'Temporada vacacional' : 'Fin de semana largo'}
          </h3>
          <form onSubmit={handleSubmit}>
            {/* ── MENSUAL ── */}
            {excelType === 'mensual' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="number" required placeholder="2024" className={inputClass} value={mensual.year} onChange={e => setMensual(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Mes *</label>
                  <select className={inputClass} value={mensual.month} onChange={e => setMensual(f => ({ ...f, month: e.target.value }))}>
                    {MESES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select className={inputClass} value={mensual.municipality} onChange={e => setMensual(f => ({ ...f, municipality: e.target.value }))}>
                    {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ocupación (%)</label>
                  <input type="number" step="0.01" placeholder="28.18" className={inputClass} value={mensual.occupancyRate} onChange={e => setMensual(f => ({ ...f, occupancyRate: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Turistas</label>
                  <input type="number" placeholder="12783" className={inputClass} value={mensual.touristFlow} onChange={e => setMensual(f => ({ ...f, touristFlow: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Impacto Económico</label>
                  <input type="number" placeholder="26004568" className={inputClass} value={mensual.economicImpact} onChange={e => setMensual(f => ({ ...f, economicImpact: e.target.value }))} />
                </div>
              </div>
            )}

            {/* ── TEMPORADA ── */}
            {excelType === 'temporada' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="number" required placeholder="2024" className={inputClass} value={temporada.year} onChange={e => setTemporada(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Temporada *</label>
                  <select className={inputClass} value={temporada.season} onChange={e => setTemporada(f => ({ ...f, season: e.target.value }))}>
                    {TEMPORADAS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select className={inputClass} value={temporada.municipality} onChange={e => setTemporada(f => ({ ...f, municipality: e.target.value }))}>
                    {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ocupación (%)</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={temporada.occupancyRate} onChange={e => setTemporada(f => ({ ...f, occupancyRate: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Afluencia Turística</label>
                  <input type="number" placeholder="0" className={inputClass} value={temporada.touristFlow} onChange={e => setTemporada(f => ({ ...f, touristFlow: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Derrama Económica</label>
                  <input type="number" placeholder="0" className={inputClass} value={temporada.economicImpact} onChange={e => setTemporada(f => ({ ...f, economicImpact: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Oferta de Cuartos</label>
                  <input type="number" placeholder="0" className={inputClass} value={temporada.roomOffer} onChange={e => setTemporada(f => ({ ...f, roomOffer: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Ocupados</label>
                  <input type="number" placeholder="0" className={inputClass} value={temporada.occupiedRooms} onChange={e => setTemporada(f => ({ ...f, occupiedRooms: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Disponibles</label>
                  <input type="number" placeholder="0" className={inputClass} value={temporada.availableRooms} onChange={e => setTemporada(f => ({ ...f, availableRooms: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Estadía promedio</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={temporada.stay} onChange={e => setTemporada(f => ({ ...f, stay: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Densidad</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={temporada.density} onChange={e => setTemporada(f => ({ ...f, density: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Turistas/noche</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={temporada.touristsPerNight} onChange={e => setTemporada(f => ({ ...f, touristsPerNight: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Gasto promedio</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={temporada.avgSpending} onChange={e => setTemporada(f => ({ ...f, avgSpending: e.target.value }))} />
                </div>
              </div>
            )}

            {/* ── PUENTES ── */}
            {excelType === 'puentes' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Año *</label>
                  <input type="number" required placeholder="2024" className={inputClass} value={puentes.year} onChange={e => setPuentes(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Nombre del Puente *</label>
                  <input type="text" required placeholder="Ej. Semana Santa" className={inputClass} value={puentes.bridge_name} onChange={e => setPuentes(f => ({ ...f, bridge_name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Municipio *</label>
                  <select className={inputClass} value={puentes.municipality} onChange={e => setPuentes(f => ({ ...f, municipality: e.target.value }))}>
                    {MUNICIPIOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Ocupación (%)</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={puentes.occupancy_rate} onChange={e => setPuentes(f => ({ ...f, occupancy_rate: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Afluencia Turística</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.tourist_flow} onChange={e => setPuentes(f => ({ ...f, tourist_flow: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Impacto Económico</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.economic_impact} onChange={e => setPuentes(f => ({ ...f, economic_impact: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Oferta de Cuartos</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.room_offer} onChange={e => setPuentes(f => ({ ...f, room_offer: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Ocupados</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.occupied_rooms} onChange={e => setPuentes(f => ({ ...f, occupied_rooms: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Cuartos Disponibles</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.available_rooms} onChange={e => setPuentes(f => ({ ...f, available_rooms: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Estadía promedio</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={puentes.average_stay} onChange={e => setPuentes(f => ({ ...f, average_stay: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Densidad de Ocupación</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={puentes.occupancy_density} onChange={e => setPuentes(f => ({ ...f, occupancy_density: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Noches</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.nights} onChange={e => setPuentes(f => ({ ...f, nights: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Turistas/noche</label>
                  <input type="number" placeholder="0" className={inputClass} value={puentes.tourists_per_night} onChange={e => setPuentes(f => ({ ...f, tourists_per_night: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Gasto diario promedio</label>
                  <input type="number" step="0.01" placeholder="0" className={inputClass} value={puentes.daily_avg_spending} onChange={e => setPuentes(f => ({ ...f, daily_avg_spending: e.target.value }))} />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar registro'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SingleRecordForm;

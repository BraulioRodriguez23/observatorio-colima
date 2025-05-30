import React, { useState, useEffect } from 'react';

// ------------ CONFIGURACIÓN DE TIPOS Y ENDPOINTS --------------
const excelTypes = [
  { value: "Corte mensual",   route: "monthly-stats",   label: "Mensual"      },
  { value: "Temporada vacacion", route: "season-stats",    label: "Temporada"    },
  { value: "Fines de semana largos",   route: "info-injection",  label: "Puentes"      },
];

type ExcelType = typeof excelTypes[number]["value"];

type ExcelRecord = Record<string, string | number | null | undefined>;

interface ExcelUploadProps {
  excelType: ExcelType;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onUploadComplete: () => void;
}

// ------------ COMPONENTE DE SUBIDA ---------------
export const ExcelUpload: React.FC<ExcelUploadProps> = ({
  excelType,
  onSuccess,
  onError,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && !/\.(xlsx|xls)$/.test(selected.name)) {
      onError('Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Por favor selecciona un archivo');
      return;
    }
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuario no autenticado');

      const config = excelTypes.find(e => e.value === excelType);
      if (!config) throw new Error('Tipo de Excel no válido');
      const url = `${import.meta.env.VITE_API_BASE_URL}/${config.route}/upload-excel`;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error subiendo archivo');
      }

      onSuccess('Archivo subido exitosamente');
      onUploadComplete();
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Seleccionar archivo Excel
      </label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Subiendo...' : 'Subir Archivo'}
      </button>
    </div>
  );
};

// ----------- COMPONENTE DE TABLA DINÁMICA (RESULTADOS) -----------
const ExcelTable: React.FC<{ records: ExcelRecord[] }> = ({ records }) => {
  if (!records.length) return null;
  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="font-bold mb-2">Registros subidos:</h3>
      <table className="min-w-full border bg-white">
        <thead>
          <tr>
            {Object.keys(records[0]).map((key) => (
              <th key={key} className="border px-2 py-1">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((val, i) => (
                <td key={i} className="border px-2 py-1">{val != null ? String(val) : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ------------- PADRE: MANEJA EL TIPO, FEEDBACK Y DATOS ----------
const ExcelUploadManager: React.FC = () => {
  const [excelType, setExcelType] = useState<ExcelType>("mensual");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [records, setRecords] = useState<ExcelRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar registros de la tabla según tipo seleccionado
  const fetchRecords = async () => {
    setLoading(true);
    setRecords([]);
    setErr(null);
    try {
      const config = excelTypes.find(e => e.value === excelType);
      if (!config) throw new Error('Tipo de Excel no válido');
      const url = `${import.meta.env.VITE_API_BASE_URL}/${config.route}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudieron obtener los registros');
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setErr(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Refresca registros cada vez que cambia el tipo
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [excelType]);

  // Mensajes de éxito/error
  const handleSuccess = (txt: string) => {
    setMsg(txt);
    setErr(null);
    fetchRecords();
  };
  const handleError = (txt: string) => {
    setErr(txt);
    setMsg(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Subir y consultar archivos Excel</h1>

      <label className="block mb-2">Tipo de Excel</label>
      <select
        value={excelType}
        onChange={e => setExcelType(e.target.value as ExcelType)}
        className="mb-4 block p-2 border rounded w-full"
      >
        {excelTypes.map(opt => (
          <option value={opt.value} key={opt.value}>{opt.label}</option>
        ))}
      </select>

      <ExcelUpload
        excelType={excelType}
        onSuccess={handleSuccess}
        onError={handleError}
        onUploadComplete={fetchRecords}
      />

      {msg && <div className="mt-4 text-green-600">{msg}</div>}
      {err && <div className="mt-4 text-red-600">{err}</div>}

      {loading && <div className="mt-4">Cargando registros...</div>}

      <ExcelTable records={records} />
    </div>
  );
};

export default ExcelUploadManager;

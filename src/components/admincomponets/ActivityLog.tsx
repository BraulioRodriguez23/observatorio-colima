import React, { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_BASE_URL;
interface LogEntry {
    id: number;
    user: string;
    action: string;
    section: string;
    details: string;
    createdAt: string;
}
const ACTION_COLORS: Record<string, string> = {
    'Subió Excel': 'bg-blue-100 text-blue-700',
    'Eliminó registro': 'bg-red-100 text-red-700',
    'Eliminó lote completo': 'bg-red-200 text-red-800',
    'Creó usuario': 'bg-green-100 text-green-700',
    'Editó registro': 'bg-yellow-100 text-yellow-700',
};
const ActivityLogPanel: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/activity-logs`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setLogs(data);
                } else {
                    console.error("La API no devolvió un arreglo:", data);
                    setLogs([]);
                }
            })
            .catch(err => {
                console.error(err);
                setLogs([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className='text-gray-500 p-4'>Cargando registros...</p>;
    return (
        <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'></h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full text-sm'>
                    <thead className='bg-gray-50 text-gray-600'>
                        <tr>
                            <th className='py-2 px-4 text-left'>Fecha</th>
                            <th className='py-2 px-4 text-left'>Usuario</th>
                            <th className='py-2 px-4 text-left'>Acción</th>
                            <th className='py-2 px-4 text-left'>Sección</th>
                            <th className='py-2 px-4 text-left'>Detalles</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {logs.map(log => (
                            <tr key={log.id} className='hover:bg-gray-50'>
                                <td className="py-2 px-4 text-gray-500 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleDateString('es-MX')}
                                </td>
                                <td className='py-2 px-4 font medium text-gray-900'>{log.user}</td>
                                <td className='py-2 px-4'>
                                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${ACTION_COLORS[log.action] || ""}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className='py-2 px-4 text-gray-600'>
                                    {log.section}
                                </td>
                                <td className='py-2 px-4 text-gray-700'>
                                    {log.details}
                                </td>


                            </tr>

                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className='py-8 px-4 text-center text-gray-500'>
                                    No hay registros.
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ActivityLogPanel;
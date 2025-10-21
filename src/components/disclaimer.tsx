interface DisclaimerProps {
  onAccept: () => void;
}

export default function Disclaimer({ onAccept }: DisclaimerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4 text-black">Aviso importante</h2>
        <p className="mb-4 text-black">
        La información publicada en el Observatorio Turístico de Colima está sujeta a revisión y actualización constante, la Subsecretaría de Turismo del Estado de Colima trabaja de manera continua en el cruce de datos, y la verificación de cifras para garantizar su confiabilidad.
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onAccept}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

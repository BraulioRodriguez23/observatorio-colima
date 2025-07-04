interface DisclaimerProps {
  onAccept: () => void;
}

export default function Disclaimer({ onAccept }: DisclaimerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4 text-black">Aviso Importante</h2>
        <p className="mb-4 text-black">
         El contenido publicado en el Observatorio Turístico de Colima se encuentra actualmente en fase de pruebas y validación. Aunque la plataforma es de acceso público, la información que aquí se presenta está sujeta a revisión, verificación y actualización constante.

La Subsecretaría de Turismo del Estado de Colima trabaja de manera continua en el cruce de datos, la revisión de artículos y la verificación de cifras para garantizar su precisión y confiabilidad.

Por lo anterior, la información disponible en esta página no debe considerarse definitiva ni oficial para efectos jurídicos o administrativos. Su consulta es de carácter informativo y está destinada a facilitar el análisis y la retroalimentación mientras se completa el proceso de validación.

La Subsecretaría de Turismo no asume responsabilidad alguna por decisiones que se tomen con base en los datos o contenidos aquí publicados en esta etapa preliminar.
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

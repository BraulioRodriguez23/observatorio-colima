// components/Indicators.tsx
export default function CircleGraph() {
  const indicators = [
    { title: "cuartos ocupados", value: "3800" },
    { title: "llegadas de turistas", value: "10,200" },
    { title: "Turistas de noche", value: "5000" },
    { title: "Porcentaje de ocupacion", value: "20%" },
    { title: "Estadia", value: "1.8" },
    { title: "Densidad de ocupacion", value: "2.2" },
    { title: "Afluencia de visitantes", value: "20000" },
    { title: "Derrama economica", value: "15,000,000" }
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-600 mb-12 text-center">
          Principales indicadores turísticos
        </h2>

        {/* Círculos de indicadores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-4
                border-4 border-blue-200">
                <span className="text-blue-600 font-bold text-xl text-center">
                  {indicator.value}
                </span>
              </div>
              <p className="text-gray-700 text-center text-sm px-2">
                {indicator.title}
              </p>
            </div>
          ))}
        </div>

        {/* Lista de municipios */}
        {/* <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-center mb-6">
            Porcentaje de visitas turísticas por municipio
          </h3>
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            {[
              { name: "Zigzano", code: "2005-29-0004" },
              { name: "Julia", code: "2005-30-0004" },
              { name: "Junio", code: "2005-30-0004" },
              { name: "Mayo", code: "2005-30-0004" },
              { name: "Ante", code: "2005-30-0004" }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 text-sm">{item.code}</span>
              </div>
            ))}
          </div>
          
          <button className="mt-8 w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg
            hover:bg-blue-50 transition-colors font-medium">
            Ver más indicadores
          </button>
        </div> */}
      </div>
    </section>
  );
}
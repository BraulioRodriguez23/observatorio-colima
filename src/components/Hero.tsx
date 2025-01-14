import React from 'react'

export default function Hero() {
  return (
    <div className=" bg-hero-pattern bg-cover "> {}
      <h1 className=" mt-20 p-8 text-3xl font-semibold text-center max-w-2xl mx-auto">
        OBSERVATORIO TURÍSTICO DEL ESTADO DE COLIMA
      </h1>
      <h2 className="p-4 text-lg font-semibold text-center max-w-2xl mx-auto">
        ¿Qué es el Observatorio del Estado de Colima?
      </h2>
      <h3 className="px-4 py-2 max-w-2xl mx-auto font-semibold">
        Es un espacio de análisis, técnico, intersectorial e interdisciplinario bajo el cual un grupo de personas y/o entidades se agrupan y organizan con el propósito de vigilar, medir y verificar la evolución del sector turismo en el Estado de Colima.
      </h3>
      <div className="mt-8 text-center">
        <button className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
          Explora aquí
        </button>
      </div>
    </div>
  )
}

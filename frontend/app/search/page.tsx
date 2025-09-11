"use client"
import { useSearchParams } from "next/navigation"
import casas from "@/casas.json"
import Image from "next/image"
import { Button } from "@/components/ui/button"

function filtrarCasas({ municipio, habitaciones, precio }) {
  return casas.filter(casa => {
    const matchMunicipio = municipio ? casa.municipio?.toLowerCase() === municipio.toLowerCase() : true
    const matchHabitaciones = habitaciones ? casa.habitaciones >= parseInt(habitaciones) : true
    const matchPrecio = precio ? casa.precio <= precio * 1000 : true
    return matchMunicipio && matchHabitaciones && matchPrecio
  })
}

export default function SearchPage() {
  const params = useSearchParams()
  const municipio = params.get("municipio")
  const habitaciones = params.get("habitaciones")
  const precio = params.get("precio")

  const resultados = filtrarCasas({ municipio, habitaciones, precio })

  return (
    <section className="min-h-screen bg-blue-900 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Resultados de búsqueda</h2>
        {resultados.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-blue-900 shadow-lg">
            No se encontraron inmuebles con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultados.map(casa => (
              <div key={casa.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
                <div className="relative w-full h-48">
                  <Image src={casa.foto || "/placeholder.jpg"} alt={casa.descripcion} fill className="object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-blue-900 text-lg mb-2">{casa.tipo} en {casa.zona}, {casa.municipio}</h3>
                  <p className="text-gray-700 mb-2">{casa.descripcion}</p>
                  <div className="flex gap-4 text-sm text-blue-900 mb-2">
                    <span>Habitaciones: {casa.habitaciones}</span>
                    <span>Baños: {casa.banos}</span>
                    <span>{casa.metros_cuadrados} m²</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-amber-600 text-xl">${casa.precio.toLocaleString()} USD</span>
                    <Button className="bg-blue-900 text-white">Ver detalles</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

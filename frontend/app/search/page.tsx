"use client"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useApi, type Property, type PropertySearchParams } from "@/lib/api"

export default function SearchPage() {
  const params = useSearchParams()
  const [resultados, setResultados] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { searchProperties } = useApi()

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const searchParams: PropertySearchParams = {
          ciudad: params.get("municipio") || undefined,
          habitaciones: params.get("habitaciones") ? parseInt(params.get("habitaciones")!) : undefined,
          precio_max: params.get("precio") ? parseInt(params.get("precio")!) * 1000 : undefined,
        }

        const properties = await searchProperties(searchParams)
        setResultados(properties)
      } catch (err) {
        console.error("Error en búsqueda:", err)
        setError("Error al realizar la búsqueda. Por favor, inténtalo de nuevo.")
        setResultados([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [params, searchProperties])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-blue-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Resultados de búsqueda</h2>
          <div className="bg-white rounded-lg p-8 text-center text-blue-900 shadow-lg">
            <p>Cargando resultados...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen bg-blue-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Resultados de búsqueda</h2>
          <div className="bg-white rounded-lg p-8 text-center text-red-600 shadow-lg">
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-900 hover:bg-blue-800 text-white"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </section>
    )
  }

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
            {resultados.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
                <div className="relative w-full h-48">
                  <Image 
                    src={property.image || "/placeholder.jpg"} 
                    alt={property.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-blue-900 text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-700 mb-2">{property.description}</p>
                  <div className="flex gap-4 text-sm text-blue-900 mb-2">
                    <span>Habitaciones: {property.bedrooms}</span>
                    <span>Baños: {property.bathrooms}</span>
                    <span>{property.size} m²</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-amber-600 text-xl">{formatPrice(property.price)}</span>
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

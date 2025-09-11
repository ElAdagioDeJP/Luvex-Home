"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bed, Bath, Maximize, MapPin, Heart, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useApi, type Property } from "@/lib/api"

export default function PropertyList() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getProperties } = useApi()

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        const properties = await getProperties()
        setFilteredProperties(properties)
      } catch (err) {
        console.error("Error al cargar propiedades:", err)
        setError("Error al cargar las propiedades. Por favor, inténtalo de nuevo.")
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, []) // Removemos getProperties de las dependencias

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // PAGINACIÓN: mostrar 6 propiedades por página y botón para cambiar de página
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const paginatedProperties = filteredProperties.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return (
      <section id="propiedades" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Propiedades Destacadas</h2>
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="propiedades" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Propiedades Destacadas</h2>
            <p className="text-red-600">{error}</p>
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
    <section id="propiedades" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Propiedades Destacadas</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de propiedades premium en las mejores ubicaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative h-64 w-full">
                <img
                  src={property.image || "/placeholder.svg?height=400&width=600&text=Casa"}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                />
                <button
                  title="Agregar a favoritos"
                  onClick={() => toggleFavorite(property.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={20}
                    className={favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
                <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md font-medium">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{property.location}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Bed size={18} className="text-blue-900 mr-1" />
                      <span className="text-gray-600">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={18} className="text-blue-900 mr-1" />
                      <span className="text-gray-600">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize size={18} className="text-blue-900 mr-1" />
                      <span className="text-gray-600">{property.size} m²</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                      onClick={() => setSelectedProperty(property)}
                    >
                      Ver Detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl">
                    {selectedProperty && selectedProperty.id === property.id && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-blue-900">
                            {selectedProperty.title}
                          </DialogTitle>
                          <DialogDescription className="text-gray-500">{selectedProperty.location}</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="relative h-80 w-full rounded-lg overflow-hidden">
                            <img
                              src={selectedProperty.image || "/placeholder.svg?height=400&width=600&text=Casa"}
                              alt={selectedProperty.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                            />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-amber-500 mb-4">
                              {formatPrice(selectedProperty.price)}
                            </div>
                            <p className="text-gray-700 mb-6">{selectedProperty.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center">
                                <Bed size={20} className="text-blue-900 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Habitaciones</p>
                                  <p className="font-medium">{selectedProperty.bedrooms}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Bath size={20} className="text-blue-900 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Baños</p>
                                  <p className="font-medium">{selectedProperty.bathrooms}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Maximize size={20} className="text-blue-900 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Superficie</p>
                                  <p className="font-medium">{selectedProperty.size} m²</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                              <Button className="bg-blue-900 hover:bg-blue-800 text-white">Solicitar visita</Button>
                              <Button
                                variant="outline"
                                className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                              >
                                Contactar agente
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-blue-100 text-blue-900 hover:bg-blue-200"
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-blue-900 font-semibold">Página {page} de {totalPages}</span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-blue-100 text-blue-900 hover:bg-blue-200"
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

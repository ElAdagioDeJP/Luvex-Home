"use client"

import { useState, useEffect } from "react"
import path from "path"
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

export default function PropertyList() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    // Cargar casas desde la API interna
    fetch("/api/casas")
      .then((res) => res.json())
      .then((data) => setFilteredProperties(data))
      .catch(() => setFilteredProperties([]))
  }, [])

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

  // Mostrar solo 6 propiedades si showAll es false
  const propertiesToShow = showAll ? filteredProperties : filteredProperties.slice(0, 6)

  // Función para corregir la ruta de la imagen
  const getImageSrc = (foto: string) => {
    if (!foto) return "/placeholder.svg?height=400&width=600"
    // Si la imagen está en /Imagenes, usar /Imagenes/...
    if (foto.startsWith("/Imagenes/")) return foto
    // Si la imagen está en public/images, usar /images/...
    if (foto.startsWith("/images/")) return foto
    // Si la imagen está en public, usar /...
    return foto
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
          {propertiesToShow.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Property Image */}
              <div className="relative h-64 w-full">
                <img
                  src={getImageSrc(property.foto)}
                  alt={property.tipo + ' en ' + property.ciudad}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                />
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={20}
                    className={favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
                <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-md font-medium">
                  {formatPrice(property.precio)}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{property.tipo + ' en ' + property.ciudad}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{property.zona + ', ' + property.ciudad}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{property.descripcion}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Bed size={18} className="text-blue-900 mr-1" />
                      <span className="text-gray-600">{property.habitaciones}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={18} className="text-blue-900 mr-1" />
                      <span className="text-gray-600">{property.banos}</span>
                    </div>
                    <div className="flex items-center">
                      <Maximize size={18} className="text-blue-900 mr-1" />
                      <span className="text-gray-600">{property.metros_cuadrados} m²</span>
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
                            {selectedProperty.tipo + ' en ' + selectedProperty.ciudad}
                          </DialogTitle>
                          <DialogDescription className="text-gray-500">{selectedProperty.direccion}</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="relative h-80 w-full rounded-lg overflow-hidden">
                            <img
                              src={getImageSrc(selectedProperty.foto)}
                              alt={selectedProperty.tipo + ' en ' + selectedProperty.ciudad}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                            />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-amber-500 mb-4">
                              {formatPrice(selectedProperty.precio)}
                            </div>
                            <p className="text-gray-700 mb-6">{selectedProperty.descripcion}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center">
                                <Bed size={20} className="text-blue-900 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Habitaciones</p>
                                  <p className="font-medium">{selectedProperty.habitaciones}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Bath size={20} className="text-blue-900 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Baños</p>
                                  <p className="font-medium">{selectedProperty.banos}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Maximize size={20} className="text-blue-900 mr-2" />
                                <div>
                                  <p className="text-sm text-gray-500">Superficie</p>
                                  <p className="font-medium">{selectedProperty.metros_cuadrados} m²</p>
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

        <div className="text-center mt-12">
          {!showAll && filteredProperties.length > 6 && (
            <Button
              variant="outline"
              className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
              onClick={() => setShowAll(true)}
            >
              Ver Todas las Propiedades
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

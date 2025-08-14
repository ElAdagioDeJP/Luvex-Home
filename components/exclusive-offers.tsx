"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Lock, MapPin, Bed, Bath, Maximize } from "lucide-react"
import Image from "next/image"
import LoginModal from "./login-modal"
import { useState } from "react"
import { exclusiveProperties } from "@/lib/data"

export default function ExclusiveOffers() {
  const { user } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Si el usuario no tiene tokens, mostramos el contenido bloqueado
  if (!user || user.tokens <= 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Ofertas Exclusivas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Accede a nuestras propiedades exclusivas con descuentos especiales
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Lock size={24} className="text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Contenido Exclusivo</h3>
              <p className="text-gray-600 mb-6">
                Inicia sesión y utiliza nuestro asistente virtual para desbloquear ofertas exclusivas y propiedades
                premium.
              </p>
              <Button onClick={() => setIsLoginModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>

        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </section>
    )
  }


  // ...existing code...

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-sm font-medium mb-2">
            Exclusivo para usuarios
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Ofertas Especiales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estas propiedades premium están disponibles con condiciones especiales por tiempo limitado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exclusiveProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-100"
            >
              {/* Property Image */}
              <div className="relative h-64 w-full">
                <Image
                  src={property.image || "/placeholder.svg?height=400&width=600"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-md font-medium">
                  {property.discount}% DCTO
                </div>
                <div className="absolute bottom-4 left-4 bg-blue-900 text-white px-3 py-1 rounded-md font-medium">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{property.title}</h3>

                {property.location && (
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin size={16} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                )}

                <p className="text-gray-600 mb-4">{property.description}</p>

                {(property.bedrooms || property.bathrooms || property.size) && (
                  <div className="flex items-center space-x-4 mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed size={18} className="text-blue-900 mr-1" />
                        <span className="text-gray-600">{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath size={18} className="text-blue-900 mr-1" />
                        <span className="text-gray-600">{property.bathrooms}</span>
                      </div>
                    )}
                    {property.size && (
                      <div className="flex items-center">
                        <Maximize size={18} className="text-blue-900 mr-1" />
                        <span className="text-gray-600">{property.size} m²</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Oferta válida hasta: <span className="font-medium">{property.validUntil}</span>
                  </div>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">Ver Oferta</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

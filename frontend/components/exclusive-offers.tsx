"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Lock, MapPin, Bed, Bath, Maximize } from "lucide-react"
import Image from "next/image"
import LoginModal from "./login-modal"
import { useState } from "react"
import casas from "@/casas.json"

export default function ExclusiveOffers() {
  const { user } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
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

  // Mostrar solo 3 propiedades (sin paginación)
  const paginatedCasas = [...casas]
    .filter(c => typeof c.precio === "number")
    .sort((a, b) => a.precio - b.precio)
    .slice(0, 3)

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-sm font-medium mb-2">
            Propiedades más baratas
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Ofertas Especiales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estas propiedades económicas están disponibles por tiempo limitado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCasas.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-amber-100"
            >
              {/* Property Image */}
              <div className="relative h-64 w-full">
                <Image
                  src={property.foto || "/placeholder.svg?height=400&width=600"}
                  alt={property.descripcion}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-blue-900 text-white px-3 py-1 rounded-md font-medium">
                  {formatPrice(property.precio)}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">{property.tipo} en {property.zona}, {property.municipio}</h3>
                <p className="text-gray-600 mb-4">{property.descripcion}</p>
                <div className="flex items-center space-x-4 mb-4">
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
                <div className="flex justify-end">
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

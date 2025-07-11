"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function Hero() {
  const [priceRange, setPriceRange] = useState([0])
  const [location, setLocation] = useState("")
  const [bedrooms, setBedrooms] = useState("")

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value * 10000)
  }

  return (
    <section className="relative bg-blue-900 text-white">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          opacity: 0.2,
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Encuentra tu hogar ideal con ayuda de IA</h1>
          <p className="text-xl text-blue-100">
            Nuestra tecnología de inteligencia artificial te ayuda a encontrar la propiedad perfecta
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="madrid">Madrid</SelectItem>
                  <SelectItem value="barcelona">Barcelona</SelectItem>
                  <SelectItem value="valencia">Valencia</SelectItem>
                  <SelectItem value="sevilla">Sevilla</SelectItem>
                  <SelectItem value="malaga">Málaga</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nº de habitaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 o más</SelectItem>
                  <SelectItem value="2">2 o más</SelectItem>
                  <SelectItem value="3">3 o más</SelectItem>
                  <SelectItem value="4">4 o más</SelectItem>
                  <SelectItem value="5">5 o más</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo: {formatPrice(priceRange[0])}
              </label>
              <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Buscar por palabras clave (ej: jardín, piscina, garaje...)"
              className="flex-grow"
            />
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function Hero() {
  const [priceRange, setPriceRange] = useState([25])
  const [location, setLocation] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [keyword, setKeyword] = useState("")

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value * 1000)
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
                <SelectTrigger className="w-full text-blue-900">
                  <SelectValue placeholder="Municipio" className="!text-blue-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bejuma" className="text-blue-900">Bejuma</SelectItem>
                  <SelectItem value="carlos-arvelo" className="text-blue-900">Carlos Arvelo</SelectItem>
                  <SelectItem value="diego-ibarra" className="text-blue-900">Diego Ibarra</SelectItem>
                  <SelectItem value="guacara" className="text-blue-900">Guacara</SelectItem>
                  <SelectItem value="juan-jose-mora" className="text-blue-900">Juan José Mora</SelectItem>
                  <SelectItem value="los-guayos" className="text-blue-900">Los Guayos</SelectItem>
                  <SelectItem value="libertador" className="text-blue-900">Libertador</SelectItem>
                  <SelectItem value="miguel-pena" className="text-blue-900">Miguel Peña</SelectItem>
                  <SelectItem value="miranda" className="text-blue-900">Miranda</SelectItem>
                  <SelectItem value="montalban" className="text-blue-900">Montalbán</SelectItem>
                  <SelectItem value="naguanagua" className="text-blue-900">Naguanagua</SelectItem>
                  <SelectItem value="puerto-cabello" className="text-blue-900">Puerto Cabello</SelectItem>
                  <SelectItem value="san-diego" className="text-blue-900">San Diego</SelectItem>
                  <SelectItem value="san-joaquin" className="text-blue-900">San Joaquín</SelectItem>
                  <SelectItem value="valencia" className="text-blue-900">Valencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full text-blue-900">
                  <SelectValue placeholder="Nº de habitaciones" className="!text-blue-900" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-blue-900">1 o más</SelectItem>
                  <SelectItem value="2" className="text-blue-900">2 o más</SelectItem>
                  <SelectItem value="3" className="text-blue-900">3 o más</SelectItem>
                  <SelectItem value="4" className="text-blue-900">4 o más</SelectItem>
                  <SelectItem value="5" className="text-blue-900">5 o más</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo: {formatPrice(priceRange[0])}
              </label>
              <Slider
                defaultValue={[25]}
                min={10}
                max={5000}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-full flex justify-center mt-6">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-10 py-4 rounded-xl shadow-lg"
                style={{ minWidth: "220px" }}
                disabled={!location || !bedrooms || !priceRange[0]}
                onClick={() => {
                  const params = new URLSearchParams({
                    municipio: location,
                    habitaciones: bedrooms,
                    precio: priceRange[0].toString()
                  })
                  window.location.href = `/paginas/searchPage?${params.toString()}`
                }}
              >
                <Search className="mr-2 h-6 w-6" /> Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

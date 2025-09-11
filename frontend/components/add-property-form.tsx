"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useApi } from "@/lib/api"
import { 
  Home, MapPin, DollarSign, Ruler, Bed, Bath, Car, Calendar,
  AlertCircle, CheckCircle, Upload, X, Plus, Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface Estado {
  id: number
  nombre_estado: string
}

interface Ciudad {
  id: number
  nombre_ciudad: string
  estado: number
}

interface Municipio {
  id: number
  nombre_municipio: string
  ciudad: number
}

interface TipoInmueble {
  id: number
  nombre_tipo: string
}

interface Caracteristica {
  id: number
  nombre_caracteristica: string
}

const AddPropertyForm = () => {
  const { user } = useAuth()
  const router = useRouter()
  const api = useApi()
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState(false)

  // Estados para los datos de selección
  const [estados, setEstados] = useState<Estado[]>([])
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [tiposInmueble, setTiposInmueble] = useState<TipoInmueble[]>([])
  const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([])

  // Estado del formulario
  const [form, setForm] = useState({
    titulo_publicacion: "",
    descripcion_publica: "",
    tipo_inmueble_id: "",
    estado_id: "",
    ciudad_id: "",
    municipio_id: "",
    direccion_exacta: "",
    precio: "",
    superficie_terreno: "",
    superficie_construccion: "",
    habitaciones: "",
    banos: "",
    puestos_estacionamiento: "",
    ano_construccion: "",
    caracteristicas_seleccionadas: [] as number[],
    caracteristicas_valores: {} as {[key: number]: string}
  })

  // Cargar datos iniciales
  useEffect(() => {
    if (!user) {
      router.push('/register')
      return
    }

    const loadInitialData = async () => {
      try {
        const [estadosData, tiposData, caracteristicasData] = await Promise.all([
          api.getEstados(),
          api.getTiposInmueble(),
          api.getCaracteristicas()
        ])
        
        setEstados(estadosData)
        setTiposInmueble(tiposData)
        setCaracteristicas(caracteristicasData)
      } catch (error) {
        console.error('Error cargando datos iniciales:', error)
        setErrors({ general: 'Error cargando datos iniciales' })
      }
    }

    loadInitialData()
  }, [user, router]) // Removemos 'api' de las dependencias

  // Cargar ciudades cuando cambie el estado
  useEffect(() => {
    if (form.estado_id) {
      const loadCiudades = async () => {
        try {
          const ciudadesData = await api.getCiudadesByEstado(parseInt(form.estado_id))
          setCiudades(ciudadesData)
          setForm(prev => ({ ...prev, ciudad_id: "", municipio_id: "" }))
        } catch (error) {
          console.error('Error cargando ciudades:', error)
        }
      }
      loadCiudades()
    } else {
      setCiudades([])
      setMunicipios([])
    }
  }, [form.estado_id]) // Removemos 'api' de las dependencias

  // Cargar municipios cuando cambie la ciudad
  useEffect(() => {
    if (form.ciudad_id) {
      const loadMunicipios = async () => {
        try {
          const municipiosData = await api.getMunicipiosByCiudad(parseInt(form.ciudad_id))
          setMunicipios(municipiosData)
          setForm(prev => ({ ...prev, municipio_id: "" }))
        } catch (error) {
          console.error('Error cargando municipios:', error)
        }
      }
      loadMunicipios()
    } else {
      setMunicipios([])
    }
  }, [form.ciudad_id]) // Removemos 'api' de las dependencias

  const handleChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleCaracteristicaChange = (caracteristicaId: number, checked: boolean) => {
    if (checked) {
      setForm(prev => ({
        ...prev,
        caracteristicas_seleccionadas: [...prev.caracteristicas_seleccionadas, caracteristicaId]
      }))
    } else {
      setForm(prev => ({
        ...prev,
        caracteristicas_seleccionadas: prev.caracteristicas_seleccionadas.filter(id => id !== caracteristicaId),
        caracteristicas_valores: { ...prev.caracteristicas_valores, [caracteristicaId]: "" }
      }))
    }
  }

  const handleCaracteristicaValorChange = (caracteristicaId: number, valor: string) => {
    setForm(prev => ({
      ...prev,
      caracteristicas_valores: { ...prev.caracteristicas_valores, [caracteristicaId]: valor }
    }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!form.titulo_publicacion.trim()) {
      newErrors.titulo_publicacion = "El título es requerido"
    }

    if (!form.descripcion_publica.trim()) {
      newErrors.descripcion_publica = "La descripción es requerida"
    }

    if (!form.tipo_inmueble_id) {
      newErrors.tipo_inmueble_id = "El tipo de inmueble es requerido"
    }

    if (!form.estado_id) {
      newErrors.estado_id = "El estado es requerido"
    }

    if (!form.ciudad_id) {
      newErrors.ciudad_id = "La ciudad es requerida"
    }

    if (!form.municipio_id) {
      newErrors.municipio_id = "El municipio es requerido"
    }

    if (!form.direccion_exacta.trim()) {
      newErrors.direccion_exacta = "La dirección es requerida"
    }

    if (!form.precio || parseFloat(form.precio) <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0"
    }

    if (!form.superficie_construccion || parseFloat(form.superficie_construccion) <= 0) {
      newErrors.superficie_construccion = "La superficie construida es requerida"
    }

    if (!form.habitaciones || parseInt(form.habitaciones) < 0) {
      newErrors.habitaciones = "El número de habitaciones es requerido"
    }

    if (!form.banos || parseInt(form.banos) < 0) {
      newErrors.banos = "El número de baños es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const propertyData = {
        titulo_publicacion: form.titulo_publicacion,
        descripcion_publica: form.descripcion_publica,
        tipo_inmueble_id: parseInt(form.tipo_inmueble_id),
        municipio_id: parseInt(form.municipio_id),
        direccion_exacta: form.direccion_exacta,
        precio: parseFloat(form.precio),
        superficie_terreno: form.superficie_terreno ? parseFloat(form.superficie_terreno) : null,
        superficie_construccion: parseFloat(form.superficie_construccion),
        habitaciones: parseInt(form.habitaciones),
        banos: parseInt(form.banos),
        puestos_estacionamiento: parseInt(form.puestos_estacionamiento) || 0,
        ano_construccion: form.ano_construccion ? parseInt(form.ano_construccion) : null,
        estatus_venta: 'Disponible',
        estatus_moderacion: 'Pendiente'
      }

      await api.createProperty(propertyData)
      setSuccess(true)
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error: any) {
      console.error('Error creando inmueble:', error)
      setErrors({ general: error.message || 'Error al crear el inmueble' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (success) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              ¡Inmueble Creado Exitosamente!
            </h2>
            <p className="text-gray-600 mb-4">
              Tu inmueble ha sido enviado para moderación. Te notificaremos cuando sea aprobado.
            </p>
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2">
              <Home className="w-8 h-8" />
              Agregar Inmueble
            </CardTitle>
            <CardDescription className="text-gray-600">
              Publica tu propiedad y encuentra el comprador ideal
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Información Básica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo_publicacion" className="text-sm font-medium text-gray-700">
                      Título de la Publicación *
                    </Label>
                    <Input
                      id="titulo_publicacion"
                      value={form.titulo_publicacion}
                      onChange={(e) => handleChange('titulo_publicacion', e.target.value)}
                      placeholder="Ej: Hermosa casa en Valencia"
                      className={errors.titulo_publicacion ? 'border-red-500' : ''}
                    />
                    {errors.titulo_publicacion && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.titulo_publicacion}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tipo_inmueble_id" className="text-sm font-medium text-gray-700">
                      Tipo de Inmueble *
                    </Label>
                    <Select value={form.tipo_inmueble_id} onValueChange={(value) => handleChange('tipo_inmueble_id', value)}>
                      <SelectTrigger className={errors.tipo_inmueble_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposInmueble.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.nombre_tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipo_inmueble_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.tipo_inmueble_id}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion_publica" className="text-sm font-medium text-gray-700">
                    Descripción *
                  </Label>
                  <Textarea
                    id="descripcion_publica"
                    value={form.descripcion_publica}
                    onChange={(e) => handleChange('descripcion_publica', e.target.value)}
                    placeholder="Describe tu inmueble en detalle..."
                    rows={4}
                    className={errors.descripcion_publica ? 'border-red-500' : ''}
                  />
                  {errors.descripcion_publica && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.descripcion_publica}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Ubicación */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="estado_id" className="text-sm font-medium text-gray-700">
                      Estado *
                    </Label>
                    <Select value={form.estado_id} onValueChange={(value) => handleChange('estado_id', value)}>
                      <SelectTrigger className={errors.estado_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado.id} value={estado.id.toString()}>
                            {estado.nombre_estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.estado_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.estado_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ciudad_id" className="text-sm font-medium text-gray-700">
                      Ciudad *
                    </Label>
                    <Select 
                      value={form.ciudad_id} 
                      onValueChange={(value) => handleChange('ciudad_id', value)}
                      disabled={!form.estado_id}
                    >
                      <SelectTrigger className={errors.ciudad_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona la ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {ciudades.map((ciudad) => (
                          <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                            {ciudad.nombre_ciudad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ciudad_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.ciudad_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="municipio_id" className="text-sm font-medium text-gray-700">
                      Municipio *
                    </Label>
                    <Select 
                      value={form.municipio_id} 
                      onValueChange={(value) => handleChange('municipio_id', value)}
                      disabled={!form.ciudad_id}
                    >
                      <SelectTrigger className={errors.municipio_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecciona el municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {municipios.map((municipio) => (
                          <SelectItem key={municipio.id} value={municipio.id.toString()}>
                            {municipio.nombre_municipio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.municipio_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.municipio_id}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="direccion_exacta" className="text-sm font-medium text-gray-700">
                    Dirección Exacta *
                  </Label>
                  <Input
                    id="direccion_exacta"
                    value={form.direccion_exacta}
                    onChange={(e) => handleChange('direccion_exacta', e.target.value)}
                    placeholder="Calle, número, sector, referencia..."
                    className={errors.direccion_exacta ? 'border-red-500' : ''}
                  />
                  {errors.direccion_exacta && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.direccion_exacta}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Precio y características físicas */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Precio y Características
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precio" className="text-sm font-medium text-gray-700">
                      Precio (USD) *
                    </Label>
                    <Input
                      id="precio"
                      type="number"
                      value={form.precio}
                      onChange={(e) => handleChange('precio', e.target.value)}
                      placeholder="50000"
                      className={errors.precio ? 'border-red-500' : ''}
                    />
                    {errors.precio && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.precio}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="superficie_construccion" className="text-sm font-medium text-gray-700">
                      Superficie Construida (m²) *
                    </Label>
                    <Input
                      id="superficie_construccion"
                      type="number"
                      value={form.superficie_construccion}
                      onChange={(e) => handleChange('superficie_construccion', e.target.value)}
                      placeholder="120"
                      className={errors.superficie_construccion ? 'border-red-500' : ''}
                    />
                    {errors.superficie_construccion && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.superficie_construccion}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="superficie_terreno" className="text-sm font-medium text-gray-700">
                      Superficie del Terreno (m²)
                    </Label>
                    <Input
                      id="superficie_terreno"
                      type="number"
                      value={form.superficie_terreno}
                      onChange={(e) => handleChange('superficie_terreno', e.target.value)}
                      placeholder="200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ano_construccion" className="text-sm font-medium text-gray-700">
                      Año de Construcción
                    </Label>
                    <Input
                      id="ano_construccion"
                      type="number"
                      value={form.ano_construccion}
                      onChange={(e) => handleChange('ano_construccion', e.target.value)}
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="habitaciones" className="text-sm font-medium text-gray-700">
                      Habitaciones *
                    </Label>
                    <Input
                      id="habitaciones"
                      type="number"
                      value={form.habitaciones}
                      onChange={(e) => handleChange('habitaciones', e.target.value)}
                      placeholder="3"
                      min="0"
                      className={errors.habitaciones ? 'border-red-500' : ''}
                    />
                    {errors.habitaciones && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.habitaciones}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="banos" className="text-sm font-medium text-gray-700">
                      Baños *
                    </Label>
                    <Input
                      id="banos"
                      type="number"
                      value={form.banos}
                      onChange={(e) => handleChange('banos', e.target.value)}
                      placeholder="2"
                      min="0"
                      className={errors.banos ? 'border-red-500' : ''}
                    />
                    {errors.banos && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.banos}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="puestos_estacionamiento" className="text-sm font-medium text-gray-700">
                      Estacionamientos
                    </Label>
                    <Input
                      id="puestos_estacionamiento"
                      type="number"
                      value={form.puestos_estacionamiento}
                      onChange={(e) => handleChange('puestos_estacionamiento', e.target.value)}
                      placeholder="1"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Características adicionales */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Características Adicionales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caracteristicas.map((caracteristica) => (
                    <div key={caracteristica.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`caracteristica-${caracteristica.id}`}
                        checked={form.caracteristicas_seleccionadas.includes(caracteristica.id)}
                        onCheckedChange={(checked) => handleCaracteristicaChange(caracteristica.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`caracteristica-${caracteristica.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {caracteristica.nombre_caracteristica}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de envío */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando Inmueble...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} />
                      Publicar Inmueble
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default AddPropertyForm

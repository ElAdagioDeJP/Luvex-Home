"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useApi } from "@/lib/api"
import { 
  Calendar, Clock, MapPin, User, Phone, MessageSquare, 
  CheckCircle, XCircle, AlertCircle, Plus, Eye
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Appointment {
  id: number
  inmueble: {
    id: number
    titulo_publicacion: string
    direccion_exacta: string
    precio: number
  }
  usuario_interesado: {
    id: number
    nombres: string
    apellidos: string
    telefono: string
  }
  fecha_hora_cita: string
  estatus_cita: 'Programada' | 'Completada' | 'Cancelada'
  observaciones?: string
}

const AppointmentsList = () => {
  const { user } = useAuth()
  const router = useRouter()
  const api = useApi()
  
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/register')
      return
    }

    const loadAppointments = async () => {
      try {
        setLoading(true)
        // Aquí cargarías las citas del usuario
        // const data = await api.getUserAppointments()
        // setAppointments(data)
        
        // Datos de ejemplo por ahora
        setAppointments([])
      } catch (err: any) {
        console.error('Error cargando citas:', err)
        setError('Error al cargar las citas')
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [user, router]) // Removemos 'api' de las dependencias

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Programada':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Programada</Badge>
      case 'Completada':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completada</Badge>
      case 'Cancelada':
        return <Badge variant="default" className="bg-red-100 text-red-800">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-VE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando citas...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Mis Citas
          </h1>
          <p className="text-gray-600">
            Gestiona tus citas programadas para visitar inmuebles
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes citas programadas
              </h3>
              <p className="text-gray-500 mb-6">
                Cuando programes visitas a inmuebles, aparecerán aquí
              </p>
              <Button asChild className="bg-blue-900 hover:bg-blue-800">
                <a href="/#propiedades">
                  <Plus className="mr-2 h-4 w-4" />
                  Ver Propiedades
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-blue-900 mb-2">
                        {appointment.inmueble.titulo_publicacion}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {appointment.inmueble.direccion_exacta}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ${appointment.inmueble.precio.toLocaleString()}
                      </div>
                      {getStatusBadge(appointment.estatus_cita)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Fecha y Hora:</span>
                        <span>{formatDate(appointment.fecha_hora_cita)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="font-medium">Cliente:</span>
                        <span>{appointment.usuario_interesado.nombres} {appointment.usuario_interesado.apellidos}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">Teléfono:</span>
                        <span>{appointment.usuario_interesado.telefono}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {appointment.observaciones && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <MessageSquare className="w-4 h-4 mt-0.5" />
                          <div>
                            <span className="font-medium">Observaciones:</span>
                            <p className="text-sm mt-1">{appointment.observaciones}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Inmueble
                    </Button>
                    {appointment.estatus_cita === 'Programada' && (
                      <>
                        <Button variant="outline" size="sm" className="flex-1 text-green-600 border-green-600 hover:bg-green-50">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Marcar Completada
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AppointmentsList

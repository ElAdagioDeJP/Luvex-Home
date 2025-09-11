"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useApi } from "@/lib/api"
import { 
  User, Mail, Phone, CreditCard, Calendar, Home, 
  MessageSquare, Calendar as CalendarIcon, Settings,
  Edit, Save, X, AlertCircle, CheckCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const UserProfile = () => {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const api = useApi()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  
  const [form, setForm] = useState({
    nombres: user?.nombres || "",
    apellidos: user?.apellidos || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    cedula: user?.cedula || "",
  })

  const [stats, setStats] = useState({
    inmueblesPublicados: 0,
    citasProgramadas: 0,
    mensajesNoLeidos: 0,
    inmueblesVendidos: 0
  })

  useEffect(() => {
    if (!user) {
      router.push('/register')
      return
    }

    const loadUserStats = async () => {
      try {
        // Aquí cargarías las estadísticas del usuario
        // const data = await api.getUserStats()
        // setStats(data)
        
        // Datos de ejemplo por ahora
        setStats({
          inmueblesPublicados: 3,
          citasProgramadas: 2,
          mensajesNoLeidos: 5,
          inmueblesVendidos: 1
        })
      } catch (err: any) {
        console.error('Error cargando estadísticas:', err)
      }
    }

    loadUserStats()
  }, [user, router]) // Removemos 'api' de las dependencias

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Aquí actualizarías el perfil del usuario
      // await api.updateUserProfile(form)
      
      // Por ahora solo actualizamos el contexto local
      updateUser({ ...user, ...form })
      
      setSuccess('Perfil actualizado exitosamente')
      setEditing(false)
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err: any) {
      console.error('Error actualizando perfil:', err)
      setError('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setForm({
      nombres: user?.nombres || "",
      apellidos: user?.apellidos || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      cedula: user?.cedula || "",
    })
    setEditing(false)
    setError(null)
  }

  if (!user) {
    return null
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <User className="w-8 h-8" />
            Mi Perfil
          </h1>
          <p className="text-gray-600">
            Gestiona tu información personal y revisa tu actividad
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="properties">Mis Inmuebles</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
          </TabsList>

          {/* Pestaña de Perfil */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información personal */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>
                          Actualiza tu información de contacto
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {editing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSave}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={loading}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditing(true)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombres" className="text-sm font-medium text-gray-700">
                          Nombres
                        </Label>
                        <Input
                          id="nombres"
                          value={form.nombres}
                          onChange={(e) => handleChange('nombres', e.target.value)}
                          disabled={!editing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                          Apellidos
                        </Label>
                        <Input
                          id="apellidos"
                          value={form.apellidos}
                          onChange={(e) => handleChange('apellidos', e.target.value)}
                          disabled={!editing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={!editing}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                          Teléfono
                        </Label>
                        <Input
                          id="telefono"
                          value={form.telefono}
                          onChange={(e) => handleChange('telefono', e.target.value)}
                          disabled={!editing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cedula" className="text-sm font-medium text-gray-700">
                          Cédula
                        </Label>
                        <Input
                          id="cedula"
                          value={form.cedula}
                          onChange={(e) => handleChange('cedula', e.target.value)}
                          disabled={!editing}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estadísticas */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Inmuebles Publicados</span>
                      </div>
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        {stats.inmueblesPublicados}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Citas Programadas</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {stats.citasProgramadas}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">Mensajes No Leídos</span>
                      </div>
                      <Badge variant="default" className="bg-orange-100 text-orange-800">
                        {stats.mensajesNoLeidos}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Inmuebles Vendidos</span>
                      </div>
                      <Badge variant="default" className="bg-purple-100 text-purple-800">
                        {stats.inmueblesVendidos}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de Cuenta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro desde:</span>
                      <span className="font-medium">
                        {new Date(user.fecha_registro).toLocaleDateString('es-VE')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Rol:</span>
                      <Badge variant="outline">
                        {user.rol?.nombre_rol || 'Cliente'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>Estado:</span>
                      <span className="font-medium">
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Pestaña de Mis Inmuebles */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Mis Inmuebles</CardTitle>
                <CardDescription>
                  Gestiona las propiedades que has publicado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes inmuebles publicados
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Comienza agregando tu primera propiedad
                  </p>
                  <Button asChild className="bg-blue-900 hover:bg-blue-800">
                    <a href="/add-property">
                      <Home className="mr-2 h-4 w-4" />
                      Agregar Inmueble
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Citas */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Mis Citas</CardTitle>
                <CardDescription>
                  Revisa y gestiona tus citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes citas programadas
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Las citas aparecerán aquí cuando sean programadas
                  </p>
                  <Button asChild variant="outline">
                    <a href="/appointments">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Ver Todas las Citas
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Mensajes */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mis Mensajes</CardTitle>
                <CardDescription>
                  Gestiona tus conversaciones con clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No tienes mensajes
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Los mensajes aparecerán aquí cuando los clientes se comuniquen contigo
                  </p>
                  <Button asChild variant="outline">
                    <a href="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ver Todos los Mensajes
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

export default UserProfile

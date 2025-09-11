"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useApi } from "@/lib/api"
import { 
  MessageSquare, User, Home, Clock, Send, 
  AlertCircle, Plus, Eye, Phone
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface Conversation {
  id: number
  inmueble: {
    id: number
    titulo_publicacion: string
    precio: number
    imagen?: string
  }
  usuario_interesado: {
    id: number
    nombres: string
    apellidos: string
    telefono: string
  }
  usuario_vendedor: {
    id: number
    nombres: string
    apellidos: string
  }
  fecha_creacion: string
  mensajes: Message[]
}

interface Message {
  id: number
  contenido_mensaje: string
  fecha_envio: string
  leido: boolean
  usuario_emisor: {
    id: number
    nombres: string
    apellidos: string
  }
}

const MessagesList = () => {
  const { user } = useAuth()
  const router = useRouter()
  const api = useApi()
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/register')
      return
    }

    const loadConversations = async () => {
      try {
        setLoading(true)
        // Aquí cargarías las conversaciones del usuario
        // const data = await api.getUserConversations()
        // setConversations(data)
        
        // Datos de ejemplo por ahora
        setConversations([])
      } catch (err: any) {
        console.error('Error cargando conversaciones:', err)
        setError('Error al cargar las conversaciones')
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [user, router]) // Removemos 'api' de las dependencias

  const handleSendMessage = async (conversationId: number) => {
    if (!newMessage.trim()) return

    try {
      // Aquí enviarías el mensaje
      // await api.sendMessage(conversationId, newMessage)
      
      // Por ahora solo limpiamos el input
      setNewMessage("")
      
      // Recargar mensajes
      // const updatedConversation = await api.getConversation(conversationId)
      // setSelectedConversation(updatedConversation)
    } catch (err: any) {
      console.error('Error enviando mensaje:', err)
      setError('Error al enviar el mensaje')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toLocaleDateString('es-VE', {
        day: 'numeric',
        month: 'short'
      })
    }
  }

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.mensajes.filter(msg => !msg.leido && msg.usuario_emisor.id !== user?.id).length
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando conversaciones...</p>
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
            <MessageSquare className="w-8 h-8" />
            Mensajes
          </h1>
          <p className="text-gray-600">
            Gestiona tus conversaciones con clientes interesados
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {conversations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes conversaciones
              </h3>
              <p className="text-gray-500 mb-6">
                Cuando los clientes se interesen en tus inmuebles, aparecerán aquí
              </p>
              <Button asChild className="bg-blue-900 hover:bg-blue-800">
                <a href="/add-property">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Inmueble
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de conversaciones */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversaciones</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {conversations.map((conversation) => {
                      const unreadCount = getUnreadCount(conversation)
                      const lastMessage = conversation.mensajes[conversation.mensajes.length - 1]
                      
                      return (
                        <div
                          key={conversation.id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {conversation.inmueble.titulo_publicacion}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {conversation.usuario_interesado.nombres} {conversation.usuario_interesado.apellidos}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              {unreadCount > 0 && (
                                <Badge variant="default" className="bg-blue-500 text-white text-xs">
                                  {unreadCount}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {lastMessage ? formatDate(lastMessage.fecha_envio) : formatDate(conversation.fecha_creacion)}
                              </span>
                            </div>
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-gray-600 truncate">
                              {lastMessage.contenido_mensaje}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.inmueble.titulo_publicacion}</CardTitle>
                        <CardDescription>
                          {selectedConversation.usuario_interesado.nombres} {selectedConversation.usuario_interesado.apellidos}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Inmueble
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Llamar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col p-0">
                    {/* Mensajes */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {selectedConversation.mensajes.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.usuario_emisor.id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.usuario_emisor.id === user.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.contenido_mensaje}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {formatDate(message.fecha_envio)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Input de mensaje */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Escribe tu mensaje..."
                          className="flex-1 min-h-[40px] max-h-32"
                          rows={1}
                        />
                        <Button
                          onClick={() => handleSendMessage(selectedConversation.id)}
                          disabled={!newMessage.trim()}
                          className="bg-blue-900 hover:bg-blue-800"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Selecciona una conversación
                    </h3>
                    <p className="text-gray-500">
                      Elige una conversación de la lista para ver los mensajes
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default MessagesList

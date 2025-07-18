"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, AlertCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { processAIQuery } from "@/lib/ai-service"
import LoginModal from "./login-modal"
//import Image from "next/image"
import type { Property } from "@/lib/types"
// Helper para renderizar contenido con imágenes en Markdown
// Helper para renderizar contenido con imágenes en Markdown
function renderContent(content: string) {
  // Unir todas las líneas para detectar Markdown fragmentado
  const text = content.replace(/\n/g, ' ')
  const parts: Array<string | JSX.Element> = []
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, alt, src] = match
    const index = match.index
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index))
    }
    // Normalizar ruta para carpeta de imágenes
    const normalizedSrc = src.replace(/\/(Imagenes|imagenes)\//, '/images/')
    parts.push(
      <img
        key={index}
        src={normalizedSrc}
        alt={alt}
        className="my-2 rounded max-w-full h-auto"
      />
    )
    lastIndex = index + fullMatch.length
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts
}
import { Card, CardContent } from "@/components/ui/card"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  tokensUsed?: number
  properties?: Property[]
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Scroll to bottom of messages and set focus
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
      messagesEndRef.current.focus({ preventScroll: true })
    }
  }, [messages])

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          content: "¡Hola! Soy JuanGPT, tu asistente inmobiliario virtual. ¿En qué puedo ayudarte hoy?",
          sender: "ai",
        },
      ])
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsProcessing(true)

    try {
      const response = await processAIQuery(input, user.tokens, newMessages)

      if (response.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: response.message,
            sender: "ai",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: response.message,
            sender: "ai",
            tokensUsed: response.tokensUsed,
            properties: response.properties,
          },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Lo siento, ha ocurrido un error al procesar tu consulta.",
          sender: "ai",
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section id="asistente" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">JuanGPT - Asistente Virtual IA</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nuestro asistente de inteligencia artificial está aquí para responder todas tus preguntas sobre propiedades
            y el proceso de compra
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Token Display */}
          {user && (
            <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-blue-900" />
                <span className="font-medium text-blue-900">JuanGPT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Tokens disponibles:</span>
                <span className="bg-blue-900 text-white px-3 py-1 rounded-full font-medium">
                  {user.tokens === Number.POSITIVE_INFINITY ? "∞" : user.tokens}
                </span>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.sender === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-blue-900 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {renderContent(message.content)}
                  </div>
                </div>

                {message.tokensUsed > 0 && (
                  <div className="text-xs text-gray-500 mt-1">Tokens utilizados: {message.tokensUsed}</div>
                )}

                {/* Propiedades recomendadas */}
                {message.properties && message.properties.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-4 text-left">
                    <p className="text-sm text-gray-500 mb-2">Propiedades recomendadas:</p>
                    {message.properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden">
                        <div className="flex">
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                            <Image
                              src={property.image || "/placeholder.svg?height=200&width=200"}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-3 flex-1">
                            <h4 className="font-medium text-blue-900 text-sm">{property.title}</h4>
                            <p className="text-xs text-gray-500">{property.location}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <div className="flex items-center">
                                <Home size={12} className="mr-1" />
                                <span>{property.size} m²</span>
                              </div>
                              <div>{property.bedrooms} hab.</div>
                              <div>{property.bathrooms} baños</div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-bold text-amber-600">{formatPrice(property.price)}</span>
                              <Button size="sm" className="h-7 text-xs bg-blue-900">
                                Ver detalles
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} tabIndex={-1} />

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center justify-center py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-900 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-900 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            {!user && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm">
                    Inicia sesión para utilizar el asistente virtual y recibir tokens gratuitos.
                  </p>
                  <Button
                    variant="link"
                    className="text-amber-600 p-0 h-auto text-sm"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta aquí..."
                className="resize-none"
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || !input.trim()}
                className="bg-blue-900 hover:bg-blue-800 text-white shrink-0"
              >
                <Send size={18} />
              </Button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              <p>Ejemplos de preguntas:</p>
              <ul className="mt-1 space-y-1">
                <li>• "¿Tienen propiedades en Madrid con jardín?"</li>
                <li>• "Recomiéndame una casa con piscina cerca de escuelas en Barcelona"</li>
                <li>• "¿Cuál es la rentabilidad de inversión en Valencia?"</li>
                <li>• "¿Cuáles son los trámites para comprar una vivienda?"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </section>
  )
}

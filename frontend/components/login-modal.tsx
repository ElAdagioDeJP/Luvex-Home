"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const { login, register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isRegistering) {
        if (!name.trim()) {
          setError("Por favor, introduce tu nombre")
          return
        }
        if (!password.trim()) {
          setError("Por favor, introduce tu contraseña")
          return
        }

        await register(name, email, password)
      } else {
        if (!password.trim()) {
          setError("Por favor, introduce tu contraseña")
          return
        }

        await login(email, password)
      }

      onClose()
    } catch (err) {
      setError("Ha ocurrido un error. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
          <span className="sr-only">Cerrar</span>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">{isRegistering ? "Crear cuenta" : "Iniciar sesión"}</h2>
          <p className="text-gray-600 mt-1">
            {isRegistering
              ? "Regístrate para acceder al asistente IA"
              : "Accede a tu cuenta para utilizar el asistente IA"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white">
            {isRegistering ? "Registrarse" : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-900 hover:underline font-medium"
            >
              {isRegistering ? "Iniciar sesión" : "Registrarse"}
            </button>
          </p>
        </div>

        {isRegistering && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <p className="font-medium">¡Recibe tokens ilimitados al registrarte!</p>
            <p className="mt-1">
              Utiliza JuanGPT con tokens ilimitados para interactuar con nuestro asistente IA y descubrir propiedades
              exclusivas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

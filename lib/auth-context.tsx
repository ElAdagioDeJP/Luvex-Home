"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  tokens: number
}

type AuthContextType = {
  user: User | null
  login: (email: string) => Promise<void>
  register: (name: string, email: string) => Promise<void>
  logout: () => void
  updateTokens: (newTokenCount: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("inmoai_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("inmoai_user")
      }
    }
  }, [])

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem("inmoai_user", JSON.stringify(user))
    }
  }, [user])

  const login = async (email: string): Promise<void> => {
    // En una aplicación real, aquí se haría una llamada a la API
    // Simulamos un login exitoso
    setUser({
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0], // Usamos la parte del email como nombre
      email,
      tokens: Number.POSITIVE_INFINITY, // Tokens infinitos para usuarios existentes
    })
  }

  const register = async (name: string, email: string): Promise<void> => {
    // En una aplicación real, aquí se haría una llamada a la API
    // Simulamos un registro exitoso
    setUser({
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      tokens: Number.POSITIVE_INFINITY, // Tokens infinitos para nuevos usuarios
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("inmoai_user")
  }

  const updateTokens = (newTokenCount: number) => {
    if (user) {
      setUser({
        ...user,
        tokens: newTokenCount,
      })
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, updateTokens }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

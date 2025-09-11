"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"


type User = {
  id: number
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  cedula?: string
  rol?: any
  activo: boolean
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

type RegisterData = {
  nombres: string
  apellidos: string
  email: string
  contrasena: string
  telefono?: string
  cedula?: string
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Cargar usuario y token del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("ica_user")
    const storedToken = localStorage.getItem("ica_token")
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        localStorage.removeItem("ica_user")
        localStorage.removeItem("ica_token")
      }
    }
  }, [])

  // Guardar usuario y token en localStorage cuando cambien
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("ica_user", JSON.stringify(user))
      localStorage.setItem("ica_token", token)
    }
  }, [user, token])

  // Login real con JWT
  const login = async (email: string, password: string) => {
    const res = await fetch("/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Credenciales inválidas")
    const data = await res.json()
    setToken(data.access)
    // Obtener usuario actual
    const userRes = await fetch(`/api/usuarios/?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${data.access}` },
    })
    if (!userRes.ok) throw new Error("No se pudo obtener el usuario")
    const userData = await userRes.json()
    setUser(userData.results ? userData.results[0] : userData[0] || null)
  }

  // Registro real y login automático
  const register = async (data: RegisterData) => {
    const res = await fetch("/api/usuarios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        password_hash: data.contrasena,
        telefono: data.telefono,
        cedula: data.cedula,
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err?.email?.[0] || "Error al registrar usuario")
    }
    // Login automático
    await login(data.email, data.contrasena)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("ica_user")
    localStorage.removeItem("ica_token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

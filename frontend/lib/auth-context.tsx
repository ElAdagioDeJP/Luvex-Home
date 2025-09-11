"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiService, type User, type AuthResponse } from "./api"

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

type RegisterData = {
  nombres: string
  apellidos: string
  email: string
  contrasena: string
  telefono?: string
  cedula?: string
  rol_id?: number
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar usuario y token del localStorage al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("ica_user")
        const storedToken = localStorage.getItem("access_token")
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser))
          setToken(storedToken)
          apiService.setToken(storedToken)
        }
      } catch (error) {
        console.error("Error al cargar datos de autenticación:", error)
        localStorage.removeItem("ica_user")
        localStorage.removeItem("access_token")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Guardar usuario y token en localStorage cuando cambien
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("ica_user", JSON.stringify(user))
      localStorage.setItem("access_token", token)
    }
  }, [user, token])

  // Login usando el servicio API
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await apiService.login(email, password)
      setUser(response.user)
      setToken(response.tokens.access)
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Registro usando el servicio API
  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      const response = await apiService.register({
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email,
        password_hash: data.contrasena,
        telefono: data.telefono,
        cedula: data.cedula,
        rol_id: data.rol_id,
      })
      setUser(response.user)
      setToken(response.tokens.access)
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    apiService.logout()
    localStorage.removeItem("ica_user")
    localStorage.removeItem("access_token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
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

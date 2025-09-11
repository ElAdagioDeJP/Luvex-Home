// API service para conectar con el backend Django
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Tipos para la API
export interface User {
  id: number
  nombres: string
  apellidos: string
  email: string
  telefono?: string
  cedula?: string
  rol?: {
    id: number
    nombre_rol: string
  }
  fecha_registro: string
  activo: boolean
}

export interface AuthResponse {
  message: string
  user: User
  tokens: {
    access: string
    refresh: string
  }
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  size: number
  image?: string
  features?: string[]
  yearBuilt?: number
  energyRating?: string
}

export interface PropertySearchParams {
  tipo_inmueble?: string
  ciudad?: string
  precio_min?: number
  precio_max?: number
  habitaciones?: number
  banos?: number
  search?: string
}

export interface VisitRequest {
  fecha_hora_cita: string
  observaciones?: string
}

// Clase para manejar las llamadas a la API
class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Recuperar token del localStorage si existe
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Métodos de autenticación
  async register(userData: {
    nombres: string
    apellidos: string
    email: string
    password: string
    telefono?: string
    cedula?: string
    rol_id?: number
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    // Guardar token en localStorage
    if (response.tokens?.access) {
      this.setToken(response.tokens.access)
    }
    
    return response
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    // Guardar token en localStorage
    if (response.tokens?.access) {
      this.setToken(response.tokens.access)
    }
    
    return response
  }

  async logout(): Promise<void> {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  getToken(): string | null {
    return this.token
  }

  // Métodos para propiedades
  async getProperties(): Promise<Property[]> {
    // Endpoint público, no necesita autenticación
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const response = await fetch(`${baseUrl}/casas/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  async searchProperties(params: PropertySearchParams): Promise<Property[]> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await this.request<{ results: Property[] }>(`/inmuebles/search/?${searchParams}`)
    return response.results || []
  }

  async getProperty(id: string): Promise<Property> {
    return await this.request<Property>(`/inmuebles/${id}/`)
  }

  async scheduleVisit(propertyId: string, visitData: VisitRequest): Promise<any> {
    return await this.request(`/inmuebles/${propertyId}/schedule-visit/`, {
      method: 'POST',
      body: JSON.stringify(visitData),
    })
  }

  // Métodos para datos de referencia
  async getEstados(): Promise<any[]> {
    return await this.request<any[]>('/estados/')
  }

  async getCiudades(estadoId?: number): Promise<any[]> {
    const url = estadoId ? `/ciudades/?estado=${estadoId}` : '/ciudades/'
    return await this.request<any[]>(url)
  }

  async getMunicipios(ciudadId?: number): Promise<any[]> {
    const url = ciudadId ? `/municipios/?ciudad=${ciudadId}` : '/municipios/'
    return await this.request<any[]>(url)
  }

  async getTiposInmueble(): Promise<any[]> {
    return await this.request<any[]>('/tipos-inmueble/')
  }

  async getCaracteristicas(): Promise<any[]> {
    return await this.request<any[]>('/caracteristicas/')
  }

  async getRoles(): Promise<any[]> {
    return await this.request<any[]>('/roles/')
  }

  // Métodos específicos para el formulario de inmuebles
  async getCiudadesByEstado(estadoId: number): Promise<any[]> {
    return await this.request<any[]>(`/ciudades/?estado=${estadoId}`)
  }

  async getMunicipiosByCiudad(ciudadId: number): Promise<any[]> {
    return await this.request<any[]>(`/municipios/?ciudad=${ciudadId}`)
  }

  async createProperty(propertyData: any): Promise<any> {
    return await this.request<any>('/inmuebles/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    })
  }
}

// Instancia singleton del servicio API
export const apiService = new ApiService(API_BASE_URL)

// Hook personalizado para usar la API en componentes React
export const useApi = () => {
  return {
    register: apiService.register.bind(apiService),
    login: apiService.login.bind(apiService),
    logout: apiService.logout.bind(apiService),
    getProperties: apiService.getProperties.bind(apiService),
    searchProperties: apiService.searchProperties.bind(apiService),
    getProperty: apiService.getProperty.bind(apiService),
    scheduleVisit: apiService.scheduleVisit.bind(apiService),
    getEstados: apiService.getEstados.bind(apiService),
    getCiudades: apiService.getCiudades.bind(apiService),
    getMunicipios: apiService.getMunicipios.bind(apiService),
    getTiposInmueble: apiService.getTiposInmueble.bind(apiService),
    getCaracteristicas: apiService.getCaracteristicas.bind(apiService),
    getRoles: apiService.getRoles.bind(apiService),
    getCiudadesByEstado: apiService.getCiudadesByEstado.bind(apiService),
    getMunicipiosByCiudad: apiService.getMunicipiosByCiudad.bind(apiService),
    createProperty: apiService.createProperty.bind(apiService),
    getToken: apiService.getToken.bind(apiService),
  }
}

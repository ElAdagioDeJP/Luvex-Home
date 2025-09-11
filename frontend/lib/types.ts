// Tipos para las propiedades
export type Property = {
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

// Tipos para las propiedades exclusivas
export type ExclusiveProperty = {
  id: string
  title: string
  description: string
  price: number
  discount: number
  validUntil: string
  image?: string
  location?: string
  bedrooms?: number
  bathrooms?: number
  size?: number
}

// Tipos para las consultas de IA
export type AIQuery = {
  id: string
  question: string
  answer: string
  tokensUsed: number
  timestamp: Date
}

// Tipos para las respuestas de IA
export type AIResponse = {
  message: string
  tokensUsed: number
  error?: string
  properties?: Property[]
}

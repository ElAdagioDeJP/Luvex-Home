import type { AIResponse, Property } from "./types"
import { properties } from "./data"

// Base de conocimiento para JuanGPT
const KNOWLEDGE_BASE = {
  // Información sobre zonas
  AREAS: {
    madrid: {
      description:
        "Madrid es la capital de España y una de las ciudades más dinámicas para el mercado inmobiliario. Destacan zonas como Salamanca, Chamberí, La Moraleja y Pozuelo.",
      avgPrice: 4200, // €/m²
      trend: "alcista",
      highlights: ["Salamanca", "Chamberí", "La Moraleja", "Pozuelo", "Chamartín"],
      schools: ["Colegio Internacional", "Liceo Europeo", "British Council School"],
      transport: ["Metro extenso", "Cercanías", "Autobuses urbanos e interurbanos"],
    },
    barcelona: {
      description:
        "Barcelona es una ciudad cosmopolita con gran atractivo para inversores nacionales e internacionales. El Eixample, Pedralbes y Sarrià son zonas premium.",
      avgPrice: 4500, // €/m²
      trend: "estable",
      highlights: ["Eixample", "Pedralbes", "Sarrià", "Gràcia", "Sant Cugat"],
      schools: ["American School", "Escuela Europea", "Liceo Francés"],
      transport: ["Metro", "Tranvía", "Ferrocarriles catalanes", "Bicing"],
    },
    valencia: {
      description:
        "Valencia ofrece una excelente calidad de vida con precios más asequibles que Madrid o Barcelona. El Vedat, La Eliana y el centro histórico son zonas destacadas.",
      avgPrice: 2200, // €/m²
      trend: "alcista moderada",
      highlights: ["El Vedat", "La Eliana", "Ciutat Vella", "Eixample", "Patacona"],
      schools: ["Cambridge House", "Caxton College", "American School"],
      transport: ["Metro", "Tranvía", "EMT", "Carril bici extenso"],
    },
    malaga: {
      description:
        "Málaga y la Costa del Sol son destinos premium para segunda residencia e inversión. Marbella, Estepona y el centro histórico de Málaga son zonas muy demandadas.",
      avgPrice: 3100, // €/m²
      trend: "alcista",
      highlights: ["Marbella", "Estepona", "Centro Histórico", "Teatinos", "El Limonar"],
      schools: ["The British School", "Novaschool", "St. George's"],
      transport: ["Cercanías", "Metro", "Autobuses urbanos"],
    },
    sevilla: {
      description:
        "Sevilla combina patrimonio histórico con zonas residenciales modernas. Triana, Los Remedios y Nervión son barrios con gran demanda.",
      avgPrice: 2300, // €/m²
      trend: "estable",
      highlights: ["Triana", "Los Remedios", "Nervión", "Santa Cruz", "Aljarafe"],
      schools: ["St. Mary's School", "Colegio Internacional Europa", "Colegio Británico"],
      transport: ["Metro", "Tranvía", "Autobuses urbanos", "Sevici (bicicletas)"],
    },
  },

  // Información sobre trámites
  PROCEDURES: {
    compra: [
      "Verificación del estado legal de la propiedad (nota simple)",
      "Comprobación de cargas y deudas pendientes",
      "Firma de contrato de arras (normalmente 10% del precio)",
      "Solicitud de hipoteca si es necesario",
      "Firma de escritura pública ante notario",
      "Pago de impuestos (ITP o IVA+AJD)",
      "Inscripción en el Registro de la Propiedad",
    ],
    documentacion: [
      "DNI/NIE/Pasaporte",
      "Justificantes de ingresos (nóminas, declaración de la renta)",
      "Extractos bancarios de los últimos meses",
      "Vida laboral",
      "Documentación adicional para hipoteca según entidad bancaria",
    ],
    impuestos: {
      viviendaNueva: ["IVA (10%)", "Actos Jurídicos Documentados (0.5-1.5% según comunidad)"],
      viviendaUsada: ["Impuesto de Transmisiones Patrimoniales (6-10% según comunidad)"],
      adicionales: [
        "Plusvalía municipal (a cargo del vendedor normalmente)",
        "IRPF por ganancia patrimonial (vendedor)",
      ],
    },
    gastos: [
      "Notaría (600-1000€ aproximadamente)",
      "Registro de la Propiedad (400-800€ aproximadamente)",
      "Gestoría (300-500€ si se utiliza)",
      "Tasación para hipoteca (300-600€)",
      "Comisión inmobiliaria (normalmente a cargo del vendedor, 3-5% del precio)",
    ],
  },

  // Información sobre financiación
  FINANCING: {
    hipotecas: {
      tipos: ["Fija", "Variable", "Mixta"],
      condicionesActuales:
        "Actualmente los tipos de interés fijos están entre 2.5-3.5% y los variables en Euribor + 0.9-1.5%",
      requisitos: [
        "Ingresos estables (la cuota no debe superar el 30-35% de los ingresos netos)",
        "Buen historial crediticio",
        "Ahorros para entrada (20-30% del precio) y gastos",
        "Tasación del inmueble",
      ],
      entidades: [
        "Colaboramos con 5 entidades financieras principales que ofrecen condiciones especiales a nuestros clientes",
      ],
    },
    ayudas: [
      "Deducciones fiscales por compra de vivienda habitual en algunas comunidades",
      "Ayudas para jóvenes compradores (Bono Joven)",
      "Programas específicos para familias numerosas",
      "Incentivos para eficiencia energética",
    ],
  },

  // Información sobre inversión
  INVESTMENT: {
    rentabilidad: {
      alquilerResidencial: {
        madrid: "4-5% bruto anual",
        barcelona: "3.5-4.5% bruto anual",
        valencia: "5-6% bruto anual",
        malaga: "5-7% bruto anual",
        sevilla: "5-6% bruto anual",
      },
      alquilerTuristico: {
        madrid: "6-8% bruto anual",
        barcelona: "6-8% bruto anual (con restricciones municipales)",
        valencia: "7-9% bruto anual",
        malaga: "8-10% bruto anual",
        sevilla: "7-9% bruto anual",
      },
      revalorizacion: {
        madrid: "5-7% anual últimos 5 años",
        barcelona: "4-6% anual últimos 5 años",
        valencia: "7-9% anual últimos 5 años",
        malaga: "8-10% anual últimos 5 años",
        sevilla: "4-6% anual últimos 5 años",
      },
    },
    zonas: {
      emergentes: [
        "Madrid: Villaverde, Usera, Carabanchel",
        "Barcelona: Poblenou, Sant Andreu",
        "Valencia: Ruzafa, Benimaclet",
        "Málaga: Soho, El Ejido",
        "Sevilla: Macarena, Alameda",
      ],
      consolidadas: [
        "Madrid: Salamanca, Chamberí, Retiro",
        "Barcelona: Eixample, Gràcia, Sant Gervasi",
        "Valencia: Eixample, El Carmen",
        "Málaga: Centro Histórico, Malagueta",
        "Sevilla: Triana, Los Remedios, Santa Cruz",
      ],
    },
  },
}

// Tipos de consultas y sus costos en tokens
const QUERY_TYPES = {
  SIMPLE: {
    cost: 1,
    patterns: [
      /tienen\s+propiedades\s+en/i,
      /precio\s+medio/i,
      /cuánto\s+cuesta/i,
      /trámites/i,
      /documentos\s+necesarios/i,
      /requisitos/i,
      /horario/i,
      /dirección/i,
      /contacto/i,
      /teléfono/i,
      /email/i,
      /cómo\s+llegar/i,
    ],
  },
  COMPLEX: {
    cost: 2,
    patterns: [
      /recomiéndame/i,
      /busco\s+una\s+casa/i,
      /necesito\s+un\s+apartamento/i,
      /comparar/i,
      /mejor\s+zona\s+para/i,
      /inversión/i,
      /rentabilidad/i,
      /financiación/i,
      /hipoteca/i,
      /reforma/i,
      /precio\s+por\s+metro/i,
      /tendencia\s+del\s+mercado/i,
      /previsión/i,
      /análisis/i,
    ],
  },
  AGENT: {
    cost: 5,
    patterns: [
      /hablar\s+con\s+un\s+agente/i,
      /contactar\s+con\s+un\s+asesor/i,
      /necesito\s+ayuda\s+personalizada/i,
      /visita\s+presencial/i,
      /cita\s+con\s+agente/i,
    ],
  },
}

// Determina el tipo de consulta y su costo en tokens
function determineQueryType(query: string) {
  // Verificar si es una consulta para hablar con un agente
  for (const pattern of QUERY_TYPES.AGENT.patterns) {
    if (pattern.test(query)) {
      return {
        type: "AGENT",
        cost: QUERY_TYPES.AGENT.cost,
      }
    }
  }

  // Verificar si es una consulta compleja
  for (const pattern of QUERY_TYPES.COMPLEX.patterns) {
    if (pattern.test(query)) {
      return {
        type: "COMPLEX",
        cost: QUERY_TYPES.COMPLEX.cost,
      }
    }
  }

  // Por defecto, es una consulta simple
  return {
    type: "SIMPLE",
    cost: QUERY_TYPES.SIMPLE.cost,
  }
}

// Función para buscar propiedades según criterios
function searchProperties(query: string): Property[] {
  const queryLower = query.toLowerCase()
  let matchedProperties: Property[] = []

  // Buscar por ubicación
  const locations = ["madrid", "barcelona", "valencia", "málaga", "sevilla"]
  const locationMatches = locations.filter((location) => queryLower.includes(location))

  // Buscar por características
  const features = ["jardín", "piscina", "terraza", "garaje", "vistas"]
  const featureMatches = features.filter((feature) => queryLower.includes(feature))

  // Buscar por número de habitaciones
  let bedroomsMatch: number | null = null
  const bedroomsRegex = /(\d+)\s*habitaciones/i
  const bedroomsMatch1 = queryLower.match(bedroomsRegex)
  if (bedroomsMatch1 && bedroomsMatch1[1]) {
    bedroomsMatch = Number.parseInt(bedroomsMatch1[1])
  }

  // Filtrar propiedades
  matchedProperties = properties.filter((property) => {
    // Filtrar por ubicación si se especificó
    if (locationMatches.length > 0) {
      const propertyLocationLower = property.location.toLowerCase()
      if (!locationMatches.some((loc) => propertyLocationLower.includes(loc))) {
        return false
      }
    }

    // Filtrar por características si se especificaron
    if (featureMatches.length > 0 && property.features) {
      const propertyFeaturesLower = property.features.map((f) => f.toLowerCase())
      if (!featureMatches.some((feat) => propertyFeaturesLower.some((pf) => pf.includes(feat)))) {
        return false
      }
    }

    // Filtrar por número de habitaciones si se especificó
    if (bedroomsMatch !== null) {
      return property.bedrooms >= bedroomsMatch
    }

    return true
  })

  return matchedProperties
}

// Función para generar respuestas personalizadas basadas en la consulta
function generateCustomResponse(query: string): string {
  const queryLower = query.toLowerCase()

  // Respuestas para consultas sobre zonas específicas
  for (const [area, info] of Object.entries(KNOWLEDGE_BASE.AREAS)) {
    if (queryLower.includes(area)) {
      if (queryLower.includes("precio") || queryLower.includes("coste") || queryLower.includes("valor")) {
        return `En ${area}, el precio medio por metro cuadrado es de aproximadamente ${info.avgPrice}€/m². La tendencia del mercado es ${info.trend}. Las zonas más destacadas son ${info.highlights.join(", ")}.`
      }

      if (queryLower.includes("colegio") || queryLower.includes("escuela") || queryLower.includes("educación")) {
        return `En ${area} encontrarás excelentes centros educativos como ${info.schools.join(", ")}. Tenemos propiedades cercanas a estos centros que podrían interesarte.`
      }

      if (queryLower.includes("transporte") || queryLower.includes("comunicación") || queryLower.includes("metro")) {
        return `${area} cuenta con excelentes comunicaciones: ${info.transport.join(", ")}. La mayoría de nuestras propiedades están bien conectadas con el transporte público.`
      }

      return info.description
    }
  }

  // Respuestas para consultas sobre trámites
  if (queryLower.includes("trámite") || queryLower.includes("proceso") || queryLower.includes("pasos")) {
    return `El proceso de compra incluye: ${KNOWLEDGE_BASE.PROCEDURES.compra.join(", ")}. ¿Te gustaría información más detallada sobre alguno de estos pasos?`
  }

  if (queryLower.includes("documento") || queryLower.includes("papeles")) {
    return `Para comprar una vivienda necesitarás: ${KNOWLEDGE_BASE.PROCEDURES.documentacion.join(", ")}. Nuestros asesores pueden ayudarte a preparar toda la documentación necesaria.`
  }

  if (queryLower.includes("impuesto")) {
    if (queryLower.includes("nueva")) {
      return `Para viviendas nuevas, los impuestos son: ${KNOWLEDGE_BASE.PROCEDURES.impuestos.viviendaNueva.join(", ")}.`
    } else {
      return `Para viviendas de segunda mano, el principal impuesto es: ${KNOWLEDGE_BASE.PROCEDURES.impuestos.viviendaUsada.join(", ")}.`
    }
  }

  // Respuestas para consultas sobre financiación
  if (queryLower.includes("hipoteca") || queryLower.includes("financiación") || queryLower.includes("préstamo")) {
    return `Actualmente colaboramos con 5 entidades financieras que ofrecen condiciones especiales para nuestros clientes. ${KNOWLEDGE_BASE.FINANCING.hipotecas.condicionesActuales}. Los requisitos principales son: ${KNOWLEDGE_BASE.FINANCING.hipotecas.requisitos.join(", ")}.`
  }

  // Respuestas para consultas sobre inversión
  if (queryLower.includes("inversión") || queryLower.includes("rentabilidad") || queryLower.includes("alquiler")) {
    for (const [area, rate] of Object.entries(KNOWLEDGE_BASE.INVESTMENT.rentabilidad.alquilerResidencial)) {
      if (queryLower.includes(area)) {
        return `En ${area}, la rentabilidad media por alquiler residencial es del ${rate}, mientras que para alquiler turístico puede alcanzar el ${KNOWLEDGE_BASE.INVESTMENT.rentabilidad.alquilerTuristico[area as keyof typeof KNOWLEDGE_BASE.INVESTMENT.rentabilidad.alquilerTuristico]}. La revalorización media anual en los últimos 5 años ha sido del ${KNOWLEDGE_BASE.INVESTMENT.rentabilidad.revalorizacion[area as keyof typeof KNOWLEDGE_BASE.INVESTMENT.rentabilidad.revalorizacion]}.`
      }
    }

    return `La rentabilidad media por alquiler residencial en España oscila entre el 4% y el 7% bruto anual, dependiendo de la ubicación. Las zonas con mayor potencial de revalorización actualmente son Málaga (8-10% anual), Valencia (7-9% anual) y Madrid (5-7% anual).`
  }

  // Respuesta genérica si no hay coincidencias específicas
  return ""
}

// Función para obtener una respuesta basada en la consulta
function getResponse(query: string, queryType: string): AIResponse {
  // Buscar propiedades relacionadas con la consulta
  const matchedProperties = searchProperties(query)

  // Intentar generar una respuesta personalizada
  const customResponse = generateCustomResponse(query)

  // Si tenemos una respuesta personalizada, la usamos
  if (customResponse) {
    return {
      message: customResponse,
      tokensUsed: queryType === "SIMPLE" ? 1 : 2,
      properties: matchedProperties.length > 0 ? matchedProperties.slice(0, 3) : undefined,
    }
  }

  // Si encontramos propiedades que coinciden con la consulta
  if (matchedProperties.length > 0) {
    const propertyCount = matchedProperties.length
    const propertyList = matchedProperties
      .slice(0, 3)
      .map(
        (p) =>
          `- ${p.title} (${p.location}): ${p.bedrooms} habitaciones, ${p.bathrooms} baños, ${p.size}m². Precio: ${new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p.price)}`,
      )
      .join("\n")

    return {
      message: `He encontrado ${propertyCount} propiedades que coinciden con tu búsqueda. Aquí tienes algunas opciones:\n\n${propertyList}\n\n¿Te gustaría más información sobre alguna de estas propiedades?`,
      tokensUsed: queryType === "SIMPLE" ? 1 : 2,
      properties: matchedProperties.slice(0, 3),
    }
  }

  // Respuestas predefinidas según el tipo de consulta
  const RESPONSES = {
    SIMPLE: {
      default:
        "Gracias por tu consulta. Tenemos propiedades en las principales ciudades de España como Madrid, Barcelona, Valencia, Sevilla y Málaga. Los precios varían según la ubicación y características. ¿Te gustaría información sobre alguna zona específica? Como JuanGPT, puedo ofrecerte análisis detallados del mercado inmobiliario en cualquier zona.",
    },
    COMPLEX: {
      default:
        "Basado en tu consulta, he analizado nuestras propiedades disponibles y las tendencias actuales del mercado. Tenemos varias opciones que podrían ajustarse a tus necesidades, con diferentes características y rangos de precio. Como JuanGPT, puedo ofrecerte un análisis detallado de rentabilidad, proyecciones de revalorización y comparativas entre diferentes zonas. ¿Podrías especificar tu presupuesto aproximado y si tienes preferencia por alguna zona en particular?",
    },
    AGENT: {
      default:
        "Entiendo que necesitas una atención más personalizada. He programado que uno de nuestros agentes inmobiliarios especializados se ponga en contacto contigo en las próximas 2 horas. Por favor, confirma tu número de teléfono y el mejor horario para contactarte. Nuestros agentes tienen acceso a propiedades exclusivas que no están publicadas en la web y pueden ofrecerte condiciones especiales adaptadas a tus necesidades específicas.",
    },
  }

  return {
    message:
      RESPONSES[queryType as keyof typeof RESPONSES]?.default ||
      "Lo siento, no he podido entender tu consulta. ¿Podrías reformularla?",
    tokensUsed: queryType === "SIMPLE" ? 1 : queryType === "COMPLEX" ? 2 : 5,
  }
}

// Función principal para procesar consultas de IA
export async function processAIQuery(
  query: string,
  history: { content: string; sender: "user" | "ai" }[]
): Promise<AIResponse> {
  // Llamar a la API real de OpenAI a través del endpoint interno
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, history }),
    })
    const data = await res.json()
    if (data.error) {
      return { message: data.message, error: "openai_error" }
    }
    return {
      message: data.message,
      properties: data.properties || [],
    }
  } catch (error) {
    return { message: "Error al conectar con el servicio de IA.", error: "network_error" }
  }
}

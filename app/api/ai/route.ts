import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY

  if (!geminiApiKey) {
    return NextResponse.json({ error: true, message: "No se ha configurado la API Key de Google Gemini." }, { status: 500 })
  }

  try {
    // Usar modelo Gemini de Google
    const prompt = `Eres un asistente virtual inmobiliario. Responde en español de forma clara y profesional: ${message}`
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    })

    const contentType = response.headers.get("content-type") || ""
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: true, message: `Error de Gemini: ${errorText}` }, { status: response.status })
    }
    if (!contentType.includes("application/json")) {
      const errorText = await response.text()
      return NextResponse.json({ error: true, message: `Respuesta inesperada de Gemini: ${errorText}` }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar tu consulta."
    return NextResponse.json({ error: false, message: text, tokensUsed: 0 })
  } catch (error) {
    return NextResponse.json({ error: true, message: `Error al conectar con Gemini: ${error}` }, { status: 500 })
  }
}

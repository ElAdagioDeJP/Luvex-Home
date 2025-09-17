import type React from "react"
import "@/app/globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const siteTitleBase = 'Veri Hogar'
const siteTagline = 'Encuentra tu hogar ideal con ayuda de inteligencia artificial'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteImage = `${siteUrl}/Icono-sinfondoVeriHogar.png`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const title = `${siteTitleBase} — ${siteTagline}`
  const description = siteTagline + ' — Veri Hogar ofrece búsqueda avanzada, filtros y un asistente IA para ayudarte a encontrar la propiedad perfecta.'

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Veri Hogar",
    "url": siteUrl,
  "logo": `${siteUrl}/Icono-sinfondoVeriHogar.png`,
    "description": description,
    "sameAs": [],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Carabobo",
      "addressCountry": "VE"
    }
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
  <meta name="keywords" content="inmuebles, propiedades, bienes raices, Veri Hogar, alquiler, venta, asistente IA, buscar casa" />
  <meta name="author" content="Veri Hogar" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Open Graph */}
        <meta property="og:site_name" content={siteTitleBase} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={siteImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={siteImage} />

        <link rel="canonical" href={siteUrl} />
  <link rel="icon" href="/Icono-sinfondoVeriHogar.png" />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'AdagiosINC.dev',
  title: siteTitleBase,
  description: siteTagline,
}

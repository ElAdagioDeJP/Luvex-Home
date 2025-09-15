import type React from "react"
import "@/app/globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

const siteTitleBase = 'Luvex'
const siteTagline = 'Encuentra tu hogar ideal con ayuda de inteligencia artificial'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteImage = `${siteUrl}/placeholder.jpg`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const title = `${siteTitleBase} — ${siteTagline}`
  const description = siteTagline + ' — Luvex ofrece búsqueda avanzada, filtros y un asistente IA para ayudarte a encontrar la propiedad perfecta.'

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Luvex",
    "url": siteUrl,
  "logo": `${siteUrl}/LogoIcaSinfondo.png`,
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
        <meta name="keywords" content="inmuebles, propiedades, bienes raices, Luvex, alquiler, venta, asistente IA, buscar casa" />
        <meta name="author" content="Luvex" />
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
        <link rel="icon" href="/favicon.ico" />

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
  generator: 'v0.dev',
  title: siteTitleBase,
  description: siteTagline,
}

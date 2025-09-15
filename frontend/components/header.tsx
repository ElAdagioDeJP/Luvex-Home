"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, LogIn, Home, Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import LoginModal from "./login-modal"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <img src="/logo-luvex-rounded.png" alt="Luvex" className="h-10 w-10 mr-3 object-contain" />
        <span className="text-2xl font-bold text-blue-900 hidden sm:inline">Luvex</span>
      </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-blue-900 hover:text-amber-500 transition-colors">
              Inicio
            </Link>
            <Link href="#propiedades" className="text-blue-900 hover:text-amber-500 transition-colors">
              Propiedades
            </Link>
            <Link href="#asistente" className="text-blue-900 hover:text-amber-500 transition-colors">
              Asistente IA
            </Link>
            <Link href="#contacto" className="text-blue-900 hover:text-amber-500 transition-colors">
              Contacto
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
                  <Link href="/add-property">
                    <Home className="mr-1 h-4 w-4" />
                    Agregar
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/profile">
                    <User className="mr-1 h-4 w-4" />
                    Perfil
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/appointments">
                    <Calendar className="mr-1 h-4 w-4" />
                    Citas
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/messages">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Mensajes
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-blue-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 mt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-blue-900 hover:text-amber-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="#propiedades"
                className="text-blue-900 hover:text-amber-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Propiedades
              </Link>
              <Link
                href="#asistente"
                className="text-blue-900 hover:text-amber-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Asistente IA
              </Link>
              <Link
                href="#contacto"
                className="text-blue-900 hover:text-amber-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              {user ? (
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white">
                      <Link href="/add-property" onClick={() => setIsMenuOpen(false)}>
                        <Home className="mr-2 h-4 w-4" />
                        Agregar Inmueble
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-blue-900">
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-blue-900">
                      <Link href="/appointments" onClick={() => setIsMenuOpen(false)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Mis Citas
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start text-blue-900">
                      <Link href="/messages" onClick={() => setIsMenuOpen(false)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Mensajes
                      </Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-blue-900" />
                      <span className="text-blue-900">{user.name}</span>
                    </div>
                    <Button variant="ghost" className="text-blue-900" onClick={logout}>
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white mt-2"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsLoginModalOpen(true)
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}

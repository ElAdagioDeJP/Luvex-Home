"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, LogIn } from "lucide-react"
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
                <span className="text-2xl font-bold text-blue-900">
                  ICA
                </span>
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-blue-900 font-medium">
                    {user.tokens === Number.POSITIVE_INFINITY ? "∞" : user.tokens}
                  </span>
                  <span className="text-sm text-blue-700">tokens</span>
                </div>
                <Button variant="ghost" className="flex items-center gap-2" onClick={logout}>
                  <User size={18} />
                  <span>{user.name}</span>
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
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-blue-900" />
                    <span className="text-blue-900">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-blue-900 font-medium">
                      {user.tokens === Number.POSITIVE_INFINITY ? "∞" : user.tokens}
                    </span>
                    <span className="text-sm text-blue-700">tokens</span>
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

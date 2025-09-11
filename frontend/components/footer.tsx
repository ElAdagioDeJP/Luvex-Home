import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Inmo<span className="text-amber-500">AI</span>
            </h3>
            <p className="text-blue-100 mb-4">
              Transformando la experiencia inmobiliaria con inteligencia artificial para encontrar tu hogar ideal.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#propiedades" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="#asistente" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Asistente IA
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Compra de Propiedades
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Venta de Propiedades
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Alquiler
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Asesoría Legal
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-200 hover:text-amber-500 transition-colors">
                  Financiación
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contacto">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-amber-500 mr-2 mt-1 shrink-0" />
                <span className="text-blue-200">Calle Principal 123, 28001 Madrid, España</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-amber-500 mr-2 shrink-0" />
                <span className="text-blue-200">+34 91 123 45 67</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-amber-500 mr-2 shrink-0" />
                <span className="text-blue-200">info@ica.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-6 text-center text-blue-300 text-sm">
          <p>© {new Date().getFullYear()} ICA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

import Header from "@/components/header"
import Property from "@/components/property"
import Footer from "@/components/footer"
import { register } from "module"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Property />
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

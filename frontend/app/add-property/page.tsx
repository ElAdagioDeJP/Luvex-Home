import Header from "@/components/header"
import AddPropertyForm from "@/components/add-property-form"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export default function AddPropertyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AddPropertyForm />
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

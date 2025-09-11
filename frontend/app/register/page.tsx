import Header from "@/components/header"
import RegisterUser from "@/components/registerUser"
import Footer from "@/components/footer"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <RegisterUser />
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

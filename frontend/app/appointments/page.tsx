import Header from "@/components/header"
import AppointmentsList from "@/components/appointments-list"
import Footer from "@/components/footer"

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AppointmentsList />
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

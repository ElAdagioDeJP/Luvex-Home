import Header from "@/components/header"
import Hero from "@/components/hero"
import PropertyList from "@/components/property-list"
import AIAssistant from "@/components/ai-assistant"
import ExclusiveOffers from "@/components/exclusive-offers"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section id="hero">
          <Hero />
        </section>
        <section id="propiedades">
          <PropertyList />
        </section>
        <section id="asistente">
          <AIAssistant />
        </section>
        <section id="ofertas-especiales">
          <ExclusiveOffers />
        </section>
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

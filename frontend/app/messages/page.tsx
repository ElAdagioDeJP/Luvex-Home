import Header from "@/components/header"
import MessagesList from "@/components/messages-list"
import Footer from "@/components/footer"

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <MessagesList />
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

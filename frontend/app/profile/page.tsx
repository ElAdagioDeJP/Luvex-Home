import Header from "@/components/header"
import UserProfile from "@/components/user-profile"
import Footer from "@/components/footer"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <UserProfile />
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}

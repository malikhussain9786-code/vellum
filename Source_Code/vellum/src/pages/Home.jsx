import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Statement from '../components/Statement.jsx'
import TemplateTeaser from '../components/TemplateTeaser.jsx'
import AiFeatures from '../components/AiFeatures.jsx'
import Footer from '../components/Footer.jsx'

export default function Home() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <Statement />
      <TemplateTeaser />
      <AiFeatures />
      <Footer />
    </div>
  )
}

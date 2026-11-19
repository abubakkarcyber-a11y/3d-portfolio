import { Cursor } from './components/ui/Cursor'
import { Navbar } from './components/ui/Navbar'
import { Hero } from './components/ui/Hero'
import { About } from './components/ui/About'
import { Skills } from './components/ui/Skills'
import { Experience } from './components/ui/Experience'
import { Builds } from './components/ui/Builds'
import { Labs } from './components/ui/Labs'
import { Certifications } from './components/ui/Certifications'
import { Education } from './components/ui/Education'
import { Contact } from './components/ui/Contact'
import { Footer } from './components/ui/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-panel focus:px-4 focus:py-2 focus:text-frost"
      >
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Builds />
        <Labs />
        <Certifications />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

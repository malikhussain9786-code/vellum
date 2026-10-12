import { Link } from 'react-router-dom'
import Logo from './ui/Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-white/8 mt-6">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <div className="flex gap-6 text-[12px] text-muted">
          <Link to="/templates" className="hover:text-brass-pale transition-colors">Templates</Link>
          <a href="/#ai-tools" className="hover:text-brass-pale transition-colors">AI Tools</a>
          <Link to="/contact" className="hover:text-brass-pale transition-colors">Contact</Link>
          <Link to="/login" className="hover:text-brass-pale transition-colors">Sign in</Link>
        </div>
        <span className="text-[10.5px] font-mono text-muted-dark">Free to use, always.</span>
      </div>
    </footer>
  )
}

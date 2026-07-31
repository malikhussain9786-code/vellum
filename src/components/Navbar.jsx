import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './ui/Logo.jsx'
import Button from './ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'

const LINKS = [
  { label: 'Templates', href: '/templates' },
  { label: 'AI Tools', href: '/#ai-tools' },
  { label: 'Why Vellum', href: '/#why-vellum' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="relative z-50">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12 flex items-center justify-between py-6">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[12.5px] tracking-wide text-ink-text/85 hover:text-brass-pale transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          {user ? (
            <Button as={Link} to="/dashboard" variant="ghost" size="md">
              Dashboard
            </Button>
          ) : (
            <Button as={Link} to="/login" variant="ghost" size="md">
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile menu toggle — functional, not decorative */}
        <button
          className="md:hidden w-10 h-10 rounded-full bg-white/[0.06] border border-white/12 backdrop-blur-md flex items-center justify-center text-brass"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t-0 mx-4 rounded-b-[10px] px-6 py-6 flex flex-col gap-5">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[14px] text-ink-text/90"
            >
              {l.label}
            </a>
          ))}
          <Button
            as={Link}
            to={user ? '/dashboard' : '/login'}
            variant="ghost"
            size="md"
            onClick={() => setOpen(false)}
            className="mt-1 justify-center"
          >
            {user ? 'Dashboard' : 'Sign in'}
          </Button>
        </div>
      )}
    </header>
  )
}

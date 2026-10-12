import { Link } from 'react-router-dom'
import Logo from './ui/Logo.jsx'
import GlassCard from './ui/GlassCard.jsx'

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-ink relative overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute -top-20 right-0 w-[500px] h-[400px] rounded-full bg-brass/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-teal/10 blur-[100px]" />

      <div className="relative px-6 sm:px-8 py-6">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <span className="block text-[11px] tracking-[0.18em] uppercase text-brass font-medium">
            {eyebrow}
          </span>
          <h1 className="font-display text-[28px] text-ink-text mt-3">{title}</h1>
          {subtitle && <p className="text-[13px] text-muted mt-2 leading-relaxed">{subtitle}</p>}

          <GlassCard className="mt-8 p-6 sm:p-8">{children}</GlassCard>

          {footer && <div className="mt-6 text-center text-[13px] text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

import LogoMark from './LogoMark.jsx'

export default function Logo({ className = '', dark = false }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={22} />
      <span
        className={`font-display text-[19px] font-semibold tracking-[0.01em] ${dark ? 'text-ink' : 'text-ink-text'}`}
      >
        Vellum
      </span>
    </span>
  )
}

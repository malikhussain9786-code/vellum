import { Link } from 'react-router-dom'
import Eyebrow from './ui/Eyebrow.jsx'
import Button from './ui/Button.jsx'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow, decorative only, does not affect layout flow */}
      <div className="pointer-events-none absolute -top-20 right-0 w-[500px] h-[400px] rounded-full bg-brass/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-40 -left-20 w-[400px] h-[400px] rounded-full bg-teal/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12 pt-6 pb-16 lg:pt-10 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>AI Resume Builder</Eyebrow>
            <h1 className="font-display text-[38px] leading-[1.05] sm:text-[48px] lg:text-[58px] text-ink-text mt-4">
              Own your <em className="italic text-brass-pale font-medium">next role.</em>
            </h1>
            <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-muted mt-5 max-w-md">
              A resume built the way the best work is — considered, precise,
              unmistakably yours. Refined by AI, formatted for who's reading it.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button as={Link} to="/signup" size="lg">
                Start your resume →
              </Button>
              <Button as={Link} to="/templates" variant="ghost" size="lg">
                See templates
              </Button>
            </div>

            <div className="flex gap-8 mt-12">
              <Stat num="20" label="Templates" />
              <Stat num="5 min" label="To first draft" />
              <Stat num="100%" label="Free" />
            </div>
          </div>

          <div className="relative">
            <Skyline />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ num, label }) {
  return (
    <div>
      <div className="font-display text-[20px] text-brass">{num}</div>
      <div className="text-[10.5px] text-muted-dark mt-1 tracking-wide">{label}</div>
    </div>
  )
}

// Signature visual element: a manuscript skyline — the document metaphor
// rendered as inline SVG. Self-contained, no external assets, scales cleanly.
function Skyline() {
  return (
    <div className="glass rounded-[14px] p-6 sm:p-8">
      <svg viewBox="0 0 420 320" className="w-full h-auto" role="img" aria-label="Illustration of a resume document taking shape">
        <defs>
          <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7b8fd6" />
            <stop offset="50%" stopColor="#d9b569" />
            <stop offset="100%" stopColor="#4fd6c0" />
          </linearGradient>
          <linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdfbf6" />
            <stop offset="100%" stopColor="#efe6d1" />
          </linearGradient>
        </defs>

        {/* floating document card */}
        <g transform="translate(60,30) rotate(-3)">
          <rect x="0" y="0" width="260" height="320" rx="4" fill="url(#docGrad)" />
          <rect x="0" y="0" width="260" height="5" fill="url(#sheen)" />
          <rect x="24" y="34" width="120" height="14" rx="2" fill="#22201b" opacity="0.85" />
          <rect x="24" y="54" width="80" height="7" rx="2" fill="#a97f2e" />
          <rect x="24" y="88" width="60" height="6" rx="2" fill="#8a6a2e" opacity="0.6" />
          <rect x="24" y="104" width="212" height="4" rx="2" fill="#d8cfb8" />
          <rect x="24" y="114" width="180" height="4" rx="2" fill="#d8cfb8" />
          <rect x="24" y="138" width="60" height="6" rx="2" fill="#8a6a2e" opacity="0.6" />
          <rect x="24" y="154" width="212" height="4" rx="2" fill="#d8cfb8" />
          <rect x="24" y="164" width="150" height="4" rx="2" fill="#d8cfb8" />
          <rect x="24" y="174" width="190" height="4" rx="2" fill="#d8cfb8" />
          <rect x="24" y="198" width="60" height="6" rx="2" fill="#8a6a2e" opacity="0.6" />
          <rect x="24" y="214" width="50" height="18" rx="9" fill="none" stroke="#a97f2e" strokeWidth="1" />
          <rect x="82" y="214" width="64" height="18" rx="9" fill="none" stroke="#a97f2e" strokeWidth="1" />
          <rect x="154" y="214" width="46" height="18" rx="9" fill="none" stroke="#a97f2e" strokeWidth="1" />
        </g>

        {/* accent ring */}
        <circle cx="340" cy="90" r="46" fill="none" stroke="url(#sheen)" strokeWidth="1.5" opacity="0.5" />
        <circle cx="340" cy="90" r="3" fill="#d9b569" />
      </svg>
    </div>
  )
}

// The Vellum mark: a folded page corner — the "fine document" concept
// this whole brand is built on, rendered as clean brass line art. Used
// standalone (favicon, small UI contexts) and paired with the wordmark
// (Logo.jsx) at larger sizes. One shape, reused everywhere, rather than
// a different icon per context — that consistency is what makes a mark
// actually read as a logo instead of decoration.

export default function LogoMark({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Page body */}
      <path
        d="M7 4H21L27 10V28H7V4Z"
        fill="none"
        stroke="#D9B569"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Folded corner flap */}
      <path
        d="M21 4L27 10H21V4Z"
        fill="none"
        stroke="#D9B569"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* A hint of text on the page — quiet, not literal */}
      <path d="M11 17H23" stroke="#D9B569" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      <path d="M11 21.5H19" stroke="#D9B569" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

export default function Eyebrow({ className = '', children }) {
  return (
    <span className={`block text-[11px] tracking-[0.18em] uppercase text-brass font-medium ${className}`}>
      {children}
    </span>
  )
}

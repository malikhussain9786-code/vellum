export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-[11px] tracking-wide text-muted mb-1.5">{label}</span>}
      <textarea
        className={`w-full bg-white/[0.04] border rounded-[4px] px-3.5 py-3 text-[13.5px] text-ink-text placeholder:text-muted-dark outline-none transition-colors resize-none ${
          error ? 'border-rose/60' : 'border-white/15 focus:border-brass/50'
        }`}
        {...props}
      />
      {error && <span className="block text-[11px] text-rose mt-1.5">{error}</span>}
    </label>
  )
}

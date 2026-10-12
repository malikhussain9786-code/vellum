export default function AiButton({ onClick, loading, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium text-brass-pale hover:text-brass disabled:opacity-60 disabled:cursor-wait transition-colors ${className}`}
    >
      <span className={loading ? 'animate-pulse' : ''}>✨</span>
      {loading ? 'Thinking…' : children}
    </button>
  )
}

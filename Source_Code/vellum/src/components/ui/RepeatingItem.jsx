export function ItemCard({ children, onRemove, removeLabel = 'Remove' }) {
  return (
    <div className="glass rounded-[8px] p-5 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-4 right-4 text-[11px] text-muted hover:text-rose transition-colors"
        aria-label={removeLabel}
      >
        ✕ Remove
      </button>
      <div className="pr-16 flex flex-col gap-3">{children}</div>
    </div>
  )
}

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-dashed border-white/20 rounded-[8px] py-3.5 text-[13px] text-muted hover:text-brass-pale hover:border-brass/40 transition-colors"
    >
      + {children}
    </button>
  )
}

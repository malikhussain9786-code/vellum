import { useState } from 'react'

export default function TagInput({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('')

  function addTag() {
    const trimmed = draft.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setDraft('')
  }

  function removeTag(tag) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      {label && <span className="block text-[11px] tracking-wide text-muted mb-1.5">{label}</span>}
      <div className="w-full bg-white/[0.04] border border-white/15 focus-within:border-brass/50 rounded-[4px] px-3 py-2.5 flex flex-wrap gap-2 transition-colors">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-brass/15 text-brass-pale text-[12px] rounded-full px-3 py-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-brass-pale/70 hover:text-brass-pale"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-[13.5px] text-ink-text placeholder:text-muted-dark py-1"
        />
      </div>
    </div>
  )
}

import { useId, useState } from 'react'

// Same contract as TextField, plus a live character counter when maxLength is set.
export default function Textarea({ label, error, validate, hint, className = '', onBlur, ...props }) {
  const id = useId()
  const [touched, setTouched] = useState(false)
  const shown = error || (touched && validate ? validate(props.value ?? '') : '')
  const describedBy = shown ? `${id}-error` : hint ? `${id}-hint` : undefined
  const length = String(props.value ?? '').length

  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-[11px] tracking-wide text-muted mb-1.5">{label}</span>}
      <textarea
        className={`w-full bg-white/[0.04] border rounded-[4px] px-3.5 py-3 text-[13.5px] text-ink-text placeholder:text-muted-dark outline-none transition-colors resize-none ${
          shown ? 'border-rose/60' : 'border-white/15 focus:border-brass/50'
        }`}
        aria-invalid={shown ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
        onBlur={(e) => {
          setTouched(true)
          onBlur?.(e)
        }}
      />
      <span className="flex justify-between gap-3 mt-1.5">
        {shown ? (
          <span id={`${id}-error`} role="alert" className="text-[11px] text-rose">
            {shown}
          </span>
        ) : (
          <span id={`${id}-hint`} className="text-[11px] text-muted-dark">
            {hint}
          </span>
        )}
        {props.maxLength && (
          <span className="text-[11px] text-muted-dark font-mono shrink-0">
            {length}/{props.maxLength}
          </span>
        )}
      </span>
    </label>
  )
}

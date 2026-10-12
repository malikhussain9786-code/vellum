import { useId, useState } from 'react'

// Controlled text input with built-in error display.
// - `error`    : message from the parent (e.g. after a failed submit)
// - `validate` : (value) => message, checked once the field has been blurred
// - `hint`     : helper text shown while there is no error
// - `maxLength`: pass-through to the native input
export default function TextField({ label, error, validate, hint, className = '', onBlur, ...props }) {
  const id = useId()
  const [touched, setTouched] = useState(false)
  const shown = error || (touched && validate ? validate(props.value ?? '') : '')
  const describedBy = shown ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <label className={`block ${className}`}>
      <span className="block text-[11px] tracking-wide text-muted mb-1.5">{label}</span>
      <input
        className={`w-full bg-white/[0.04] border rounded-[4px] px-3.5 py-3 text-[13.5px] text-ink-text placeholder:text-muted-dark outline-none transition-colors ${
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
      {shown ? (
        <span id={`${id}-error`} role="alert" className="block text-[11px] text-rose mt-1.5">
          {shown}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className="block text-[11px] text-muted-dark mt-1.5">
            {hint}
          </span>
        )
      )}
    </label>
  )
}

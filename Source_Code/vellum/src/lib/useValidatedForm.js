import { useState } from 'react'

// Small form helper: holds values, tracks which fields were touched, and
// shows a field's error only after it has been blurred or a submit was tried.
// `rules` maps field name -> (value, allValues) => error string ('' if valid).
export function useValidatedForm(initialValues, rules) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})

  const errors = {}
  for (const name of Object.keys(rules)) {
    errors[name] = rules[name](values[name], values) || ''
  }

  function fieldProps(name) {
    return {
      name,
      value: values[name],
      error: touched[name] ? errors[name] : '',
      onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
      onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    }
  }

  // Marks every field touched; returns true only when the whole form is valid.
  function validateAll() {
    setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])))
    return !Object.values(errors).some(Boolean)
  }

  function reset() {
    setValues(initialValues)
    setTouched({})
  }

  return { values, errors, fieldProps, validateAll, reset, setValues }
}

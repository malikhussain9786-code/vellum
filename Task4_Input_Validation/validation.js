// Central input-validation rules for every form in Vellum.
// Each validator takes the raw input and returns an error message string,
// or '' when the value is valid. Keeping all rules here means the Sign Up,
// Login, Contact and Builder forms stay consistent, and the same rules are
// re-checked in AuthContext before anything is saved (never trust the UI alone).

export const LIMITS = {
  name: { min: 2, max: 50 },
  email: { max: 254 },
  password: { min: 8, max: 64 },
  phone: { minDigits: 7, maxDigits: 15 },
  subject: { min: 3, max: 100 },
  message: { min: 10, max: 1000 },
  title: 100,
  shortText: 80,
  longText: 400,
  bullet: 200,
  summary: 600,
  url: 200,
  tag: 40,
  maxTags: 30,
  resumeTitle: 60,
  photoBytes: 5 * 1024 * 1024,
}

// ---------- generic ----------

export function validateRequired(value, label = 'This field') {
  return String(value ?? '').trim() ? '' : `${label} is required.`
}

export function validateText(value, { label = 'This field', required = false, min = 0, max = LIMITS.title } = {}) {
  const v = String(value ?? '').trim()
  if (!v) return required ? `${label} is required.` : ''
  if (v.length < min) return `${label} must be at least ${min} characters.`
  if (v.length > max) return `${label} must be ${max} characters or fewer.`
  // Block control characters / stray markup so nothing odd lands in a PDF or the DOM.
  if (/[<>]/.test(v)) return `${label} can't contain < or > characters.`
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v)) return `${label} contains invalid characters.`
  return ''
}

// ---------- person / account ----------

export function validateName(value, label = 'Name') {
  const v = String(value ?? '').trim()
  if (!v) return `${label} is required.`
  if (v.length < LIMITS.name.min) return `${label} must be at least ${LIMITS.name.min} characters.`
  if (v.length > LIMITS.name.max) return `${label} must be ${LIMITS.name.max} characters or fewer.`
  // Letters (any language), spaces, apostrophes, hyphens, dots — no digits or symbols.
  if (!/^\p{L}[\p{L}\p{M}\s.'’-]*$/u.test(v)) return `${label} can only contain letters, spaces, apostrophes, dots and hyphens.`
  return ''
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

export function validateEmail(value, { required = true } = {}) {
  const v = String(value ?? '').trim()
  if (!v) return required ? 'Email is required.' : ''
  if (v.length > LIMITS.email.max) return 'Email is too long.'
  if (/\s/.test(v)) return 'Email can\u2019t contain spaces.'
  if (!v.includes('@')) return 'Email must contain an @ symbol.'
  if (v.includes('..') || v.startsWith('.') || v.split('@')[0].endsWith('.')) return 'Enter a valid email address.'
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address, like you@example.com.'
  return ''
}

// For creating / changing a password: enforce strength.
export function validatePassword(value, label = 'Password') {
  const v = String(value ?? '')
  if (!v) return `${label} is required.`
  if (v.length < LIMITS.password.min) return `${label} must be at least ${LIMITS.password.min} characters.`
  if (v.length > LIMITS.password.max) return `${label} must be ${LIMITS.password.max} characters or fewer.`
  if (/\s/.test(v)) return `${label} can't contain spaces.`
  if (!/[a-z]/.test(v)) return `${label} needs at least one lowercase letter.`
  if (!/[A-Z]/.test(v)) return `${label} needs at least one uppercase letter.`
  if (!/\d/.test(v)) return `${label} needs at least one number.`
  return ''
}

// For signing in: only check presence — never reveal rules for an existing password.
export function validateLoginPassword(value) {
  const v = String(value ?? '')
  if (!v) return 'Password is required.'
  if (v.length > 128) return 'Password is too long.'
  return ''
}

export function validateConfirm(password, confirm, label = 'Passwords') {
  if (!confirm) return 'Please confirm your password.'
  return password === confirm ? '' : `${label} do not match.`
}

export function validateNewDiffersFromOld(oldPw, newPw) {
  return oldPw && newPw && oldPw === newPw ? 'New password must be different from the current one.' : ''
}

export function validatePhone(value, { required = false } = {}) {
  const v = String(value ?? '').trim()
  if (!v) return required ? 'Phone number is required.' : ''
  if (!/^\+?[0-9\s().-]+$/.test(v)) return 'Phone can only contain digits, spaces, + ( ) - and dots.'
  const digits = v.replace(/\D/g, '')
  if (digits.length < LIMITS.phone.minDigits) return 'Phone number is too short.'
  if (digits.length > LIMITS.phone.maxDigits) return 'Phone number is too long.'
  return ''
}

// ---------- links ----------

export function validateUrl(value, { label = 'Link', required = false, host = '' } = {}) {
  const v = String(value ?? '').trim()
  if (!v) return required ? `${label} is required.` : ''
  if (v.length > LIMITS.url) return `${label} must be ${LIMITS.url} characters or fewer.`
  if (/\s/.test(v)) return `${label} can't contain spaces.`
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) && !/^https?:\/\//i.test(v)) {
    return `${label} must start with http:// or https:// (or be just a domain).`
  }
  let url
  try {
    url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`)
  } catch {
    return `Enter a valid ${label.toLowerCase()}, like example.com.`
  }
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return `Enter a valid ${label.toLowerCase()}, like example.com.`
  if (host && !(url.hostname === host || url.hostname.endsWith(`.${host}`))) return `${label} should be a ${host} link.`
  return ''
}

// ---------- dates (resume) ----------

const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5,
  jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
}

// Accepts 2022 · 06/2022 · Jun 2022 · June 2022. Returns {year, month} or null.
function parseDatePart(raw) {
  const s = raw.trim().toLowerCase().replace(/\.$/, '')
  let m = s.match(/^(\d{4})$/)
  if (m) return { year: +m[1], month: 1 }
  m = s.match(/^(0?[1-9]|1[0-2])\/(\d{4})$/)
  if (m) return { year: +m[2], month: +m[1] }
  m = s.match(/^([a-z]{3,9})\.? (\d{4})$/)
  if (m && MONTHS[m[1]]) return { year: +m[2], month: MONTHS[m[1]] }
  return null
}

const YEAR_MIN = 1950
const yearMax = () => new Date().getFullYear() + 10

export function validateDate(value, { label = 'Date', allowRange = false, allowPresent = false } = {}) {
  const v = String(value ?? '').trim()
  if (!v) return ''
  const parts = allowRange ? v.split(/\s*[—–-]\s*/) : [v]
  if (parts.length > 2) return `${label} has too many parts.`
  const hint = `Use a format like 2022, 06/2022 or Jun 2022${allowRange ? ', or a range like 2020 — Present' : ''}.`
  const parsed = []
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim()
    if (allowPresent && i === parts.length - 1 && /^(present|current|now)$/i.test(p)) {
      parsed.push({ present: true })
      continue
    }
    const d = parseDatePart(p)
    if (!d) return `${label} isn't valid. ${hint}`
    if (d.year < YEAR_MIN || d.year > yearMax()) return `${label} must be between ${YEAR_MIN} and ${yearMax()}.`
    parsed.push(d)
  }
  if (parsed.length === 2 && !parsed[0].present && !parsed[1].present) {
    const a = parsed[0].year * 12 + parsed[0].month
    const b = parsed[1].year * 12 + parsed[1].month
    if (b < a) return 'The end of the range can\u2019t be before the start.'
  }
  return ''
}

// Start/End pair used by Experience and Education.
export function validateDateRange(start, end, { current = false } = {}) {
  const s = String(start ?? '').trim()
  const e = String(end ?? '').trim()
  if (current || !s || !e) return ''
  const a = parseDatePart(s)
  const b = parseDatePart(e)
  if (!a || !b) return ''
  return b.year * 12 + b.month < a.year * 12 + a.month ? 'End date can\u2019t be before the start date.' : ''
}

// ---------- files ----------

export function validatePhotoFile(file) {
  if (!file) return ''
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Photo must be a JPG, PNG or WebP image.'
  if (file.size > LIMITS.photoBytes) return 'Photo must be smaller than 5 MB.'
  if (file.size === 0) return 'That file is empty.'
  return ''
}

// ---------- helpers ----------

export function firstError(...messages) {
  return messages.find(Boolean) || ''
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean)
}

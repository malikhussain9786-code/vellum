// Contact-form messages. There is no email server in this project, so each
// message is stored in the browser under `vellum:contact:messages` — the same
// pattern the rest of the app uses. Swapping this for a real API later means
// changing only this file.
const KEY = 'vellum:contact:messages'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveContactMessage({ name, email, phone, subject, message }) {
  const all = readAll()
  const entry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  }
  all.push(entry)
  localStorage.setItem(KEY, JSON.stringify(all))
  return entry
}

export function listContactMessages() {
  return readAll()
}

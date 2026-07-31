// Storage layer for users and sessions. Everything is namespaced under
// `vellum:` keys so it never collides with anything else in localStorage.
// This is also the single place that knows the storage format — if this
// swaps to a real backend later, only this file needs to change.

const USERS_KEY = 'vellum:users'
const SESSION_KEY = 'vellum:session'

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    // Corrupt or inaccessible storage — fail safe to an empty list rather
    // than throwing and breaking the whole app on load.
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase()
  return readUsers().find((u) => u.email === normalized) || null
}

export function findUserById(id) {
  return readUsers().find((u) => u.id === id) || null
}

export function createUser({ name, email, salt, hash }) {
  const users = readUsers()
  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.trim().toLowerCase(),
    salt,
    hash,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  return user
}

export function updateUserPassword(userId, { salt, hash }) {
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return false
  users[idx] = { ...users[idx], salt, hash }
  writeUsers(users)
  return true
}

export function updateUserName(userId, name) {
  const users = readUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return null
  users[idx] = { ...users[idx], name }
  writeUsers(users)
  return users[idx]
}

export function getSession() {
  return localStorage.getItem(SESSION_KEY)
}

export function setSession(userId) {
  localStorage.setItem(SESSION_KEY, userId)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Per-user data isolation: every piece of user-owned data (resumes,
// profile, etc.) is stored under a key namespaced by user id, so one
// user's data is never reachable through another user's session.
export function userDataKey(userId, resource) {
  return `vellum:user:${userId}:${resource}`
}

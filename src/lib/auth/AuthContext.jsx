import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { hashPassword, verifyPassword } from './crypto.js'
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  updateUserName,
  getSession,
  setSession,
  clearSession,
} from './storage.js'

const AuthContext = createContext(null)

function publicUser(user) {
  if (!user) return null
  // Never expose salt/hash to the rest of the app, even internally —
  // components should never have a reason to see these.
  const { id, name, email, createdAt } = user
  return { id, name, email, createdAt }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionUserId = getSession()
    if (sessionUserId) {
      const found = findUserById(sessionUserId)
      if (found) setUser(publicUser(found))
      else clearSession() // stale session pointing at a deleted user
    }
    setLoading(false)
  }, [])

  const signup = useCallback(async ({ name, email, password, confirmPassword }) => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName) throw new Error('Enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) throw new Error('Enter a valid email address.')
    if (password.length < 8) throw new Error('Password must be at least 8 characters.')
    if (password !== confirmPassword) throw new Error('Passwords do not match.')
    if (findUserByEmail(trimmedEmail)) throw new Error('An account with this email already exists.')

    const { salt, hash } = await hashPassword(password)
    const newUser = createUser({ name: trimmedName, email: trimmedEmail, salt, hash })
    setSession(newUser.id)
    setUser(publicUser(newUser))
    return publicUser(newUser)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase()
    const found = findUserByEmail(trimmedEmail)
    // Same error for "no such user" and "wrong password" — don't leak
    // which one it was, that's a real (if small-scale) security practice.
    if (!found) throw new Error('Incorrect email or password.')
    const ok = await verifyPassword(password, found.salt, found.hash)
    if (!ok) throw new Error('Incorrect email or password.')

    setSession(found.id)
    setUser(publicUser(found))
    return publicUser(found)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  // No email service exists in this environment, so — per the product's
  // own "no OTP, no email verification" requirement — reset works by
  // confirming the account email and setting a new password directly.
  const resetPassword = useCallback(async ({ email, newPassword, confirmPassword }) => {
    const trimmedEmail = email.trim().toLowerCase()
    const found = findUserByEmail(trimmedEmail)
    if (!found) throw new Error('No account found with this email.')
    if (newPassword.length < 8) throw new Error('Password must be at least 8 characters.')
    if (newPassword !== confirmPassword) throw new Error('Passwords do not match.')

    const { salt, hash } = await hashPassword(newPassword)
    updateUserPassword(found.id, { salt, hash })
    return true
  }, [])

  // Profile-settings password change — unlike resetPassword (used when
  // logged out and can't prove identity another way), this requires the
  // current password, which is the correct check when the person is
  // already authenticated and just rotating their credentials.
  const changePassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }) => {
      if (!user) throw new Error('Not signed in.')
      const found = findUserById(user.id)
      if (!found) throw new Error('Account not found.')
      const ok = await verifyPassword(currentPassword, found.salt, found.hash)
      if (!ok) throw new Error('Current password is incorrect.')
      if (newPassword.length < 8) throw new Error('New password must be at least 8 characters.')
      if (newPassword !== confirmPassword) throw new Error('New passwords do not match.')

      const { salt, hash } = await hashPassword(newPassword)
      updateUserPassword(found.id, { salt, hash })
      return true
    },
    [user]
  )

  const updateName = useCallback(
    (name) => {
      if (!user) throw new Error('Not signed in.')
      const trimmed = name.trim()
      if (!trimmed) throw new Error('Name cannot be empty.')
      const updated = updateUserName(user.id, trimmed)
      setUser(publicUser(updated))
      return publicUser(updated)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, resetPassword, changePassword, updateName }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

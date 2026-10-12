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
import {
  validateName,
  validateEmail,
  validatePassword,
  validateLoginPassword,
  validateConfirm,
  validateNewDiffersFromOld,
  firstError,
} from '../validation.js'

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

    // Re-validate here too: the form already checks these, but the auth layer
    // must never trust that the UI did its job.
    const problem = firstError(
      validateName(trimmedName),
      validateEmail(trimmedEmail),
      validatePassword(password),
      validateConfirm(password, confirmPassword)
    )
    if (problem) throw new Error(problem)
    if (findUserByEmail(trimmedEmail)) throw new Error('An account with this email already exists.')

    const { salt, hash } = await hashPassword(password)
    const newUser = createUser({ name: trimmedName, email: trimmedEmail, salt, hash })
    setSession(newUser.id)
    setUser(publicUser(newUser))
    return publicUser(newUser)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase()
    const problem = firstError(validateEmail(trimmedEmail), validateLoginPassword(password))
    if (problem) throw new Error(problem)
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
    const problem = firstError(
      validateEmail(trimmedEmail),
      validatePassword(newPassword, 'New password'),
      validateConfirm(newPassword, confirmPassword)
    )
    if (problem) throw new Error(problem)
    const found = findUserByEmail(trimmedEmail)
    if (!found) throw new Error('No account found with this email.')

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
      const problem = firstError(
        validateLoginPassword(currentPassword) && 'Current password is required.',
        validatePassword(newPassword, 'New password'),
        validateConfirm(newPassword, confirmPassword, 'New passwords'),
        validateNewDiffersFromOld(currentPassword, newPassword)
      )
      if (problem) throw new Error(problem)
      const found = findUserById(user.id)
      if (!found) throw new Error('Account not found.')
      const ok = await verifyPassword(currentPassword, found.salt, found.hash)
      if (!ok) throw new Error('Current password is incorrect.')

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
      const problem = validateName(trimmed, 'Name')
      if (problem) throw new Error(problem)
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

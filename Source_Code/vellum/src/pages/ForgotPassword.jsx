import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { useValidatedForm } from '../lib/useValidatedForm.js'
import { LIMITS, validateEmail, validatePassword, validateConfirm } from '../lib/validation.js'

const RULES = {
  email: (v) => validateEmail(v),
  newPassword: (v) => validatePassword(v, 'New password'),
  confirmPassword: (v, all) => validateConfirm(all.newPassword, v),
}

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const { values, fieldProps, validateAll } = useValidatedForm(
    { email: '', newPassword: '', confirmPassword: '' },
    RULES
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validateAll()) return
    setSubmitting(true)
    try {
      await resetPassword(values)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <AuthLayout eyebrow="Password reset" title="You're all set.">
        <p className="text-[13.5px] text-muted leading-relaxed">
          Your password has been updated. You can sign in with your new password now.
        </p>
        <Button onClick={() => navigate('/login')} className="mt-6 justify-center w-full">
          Go to sign in →
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="Reset password"
      title="Set a new password."
      subtitle="Confirm your account email and choose a new password."
      footer={
        <Link to="/login" className="text-brass-pale hover:text-brass">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email.max}
          placeholder="you@email.com"
          {...fieldProps('email')}
        />
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          maxLength={LIMITS.password.max}
          placeholder="At least 8 characters"
          hint="8+ characters with an uppercase letter, a lowercase letter and a number."
          {...fieldProps('newPassword')}
        />
        <TextField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          maxLength={LIMITS.password.max}
          placeholder="Re-enter your new password"
          {...fieldProps('confirmPassword')}
        />

        {error && (
          <div role="alert" className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="mt-2 justify-center disabled:opacity-60">
          {submitting ? 'Updating…' : 'Update password →'}
        </Button>
      </form>
    </AuthLayout>
  )
}

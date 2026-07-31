import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(form)
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Email" type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
        <TextField
          label="New password"
          type="password"
          required
          value={form.newPassword}
          onChange={update('newPassword')}
          placeholder="At least 8 characters"
        />
        <TextField
          label="Confirm new password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          placeholder="Re-enter your new password"
        />

        {error && (
          <div className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
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

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(form)
      // Preserve template choice made before signup, if any, so the
      // person doesn't have to re-pick it after creating an account.
      navigate(templateId ? `/dashboard?template=${templateId}` : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Start your resume."
      subtitle="Free, no locked features. Takes under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-brass-pale hover:text-brass">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Name" type="text" required value={form.name} onChange={update('name')} placeholder="Amara Osei" />
        <TextField label="Email" type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
        <TextField
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={update('password')}
          placeholder="At least 8 characters"
        />
        <TextField
          label="Confirm password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          placeholder="Re-enter your password"
        />

        {error && (
          <div className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="mt-2 justify-center disabled:opacity-60">
          {submitting ? 'Creating account…' : 'Create account →'}
        </Button>
      </form>
    </AuthLayout>
  )
}

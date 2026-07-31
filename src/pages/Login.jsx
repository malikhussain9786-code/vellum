import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
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
      await login(form)
      // Send the person back to wherever RequireAuth intercepted them from,
      // instead of always dumping them on the dashboard.
      const dest = location.state?.from || '/dashboard'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/signup" className="text-brass-pale hover:text-brass">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Email" type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
        <div>
          <TextField
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={update('password')}
            placeholder="Your password"
          />
          <Link to="/forgot-password" className="block text-right text-[12px] text-muted hover:text-brass-pale mt-2">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="mt-2 justify-center disabled:opacity-60">
          {submitting ? 'Signing in…' : 'Sign in →'}
        </Button>
      </form>
    </AuthLayout>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { useValidatedForm } from '../lib/useValidatedForm.js'
import { LIMITS, validateEmail, validateLoginPassword } from '../lib/validation.js'

const RULES = {
  email: (v) => validateEmail(v),
  password: (v) => validateLoginPassword(v),
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { values, fieldProps, validateAll } = useValidatedForm({ email: '', password: '' }, RULES)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validateAll()) return
    setSubmitting(true)
    try {
      await login(values)
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email.max}
          placeholder="you@email.com"
          {...fieldProps('email')}
        />
        <div>
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            maxLength={128}
            placeholder="Your password"
            {...fieldProps('password')}
          />
          <Link to="/forgot-password" className="block text-right text-[12px] text-muted hover:text-brass-pale mt-2">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div role="alert" className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
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

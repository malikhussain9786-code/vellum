import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import TextField from '../components/ui/TextField.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { useValidatedForm } from '../lib/useValidatedForm.js'
import { LIMITS, validateName, validateEmail, validatePassword, validateConfirm } from '../lib/validation.js'

const RULES = {
  name: (v) => validateName(v),
  email: (v) => validateEmail(v),
  password: (v) => validatePassword(v),
  confirmPassword: (v, all) => validateConfirm(all.password, v),
}

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')

  const { values, fieldProps, validateAll } = useValidatedForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    RULES
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validateAll()) return
    setSubmitting(true)
    try {
      await signup(values)
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
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.name.max}
          placeholder="Amara Osei"
          {...fieldProps('name')}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email.max}
          placeholder="you@email.com"
          {...fieldProps('email')}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          maxLength={LIMITS.password.max}
          placeholder="At least 8 characters"
          hint="8+ characters with an uppercase letter, a lowercase letter and a number."
          {...fieldProps('password')}
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          maxLength={LIMITS.password.max}
          placeholder="Re-enter your password"
          {...fieldProps('confirmPassword')}
        />

        {error && (
          <div role="alert" className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
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

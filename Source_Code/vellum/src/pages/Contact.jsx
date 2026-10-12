import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Container from '../components/ui/Container.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import TextField from '../components/ui/TextField.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { useValidatedForm } from '../lib/useValidatedForm.js'
import { saveContactMessage } from '../lib/contact/storage.js'
import { LIMITS, validateName, validateEmail, validatePhone, validateText } from '../lib/validation.js'

const RULES = {
  name: (v) => validateName(v, 'Your name'),
  email: (v) => validateEmail(v),
  phone: (v) => validatePhone(v), // optional
  subject: (v) => validateText(v, { label: 'Subject', required: true, min: LIMITS.subject.min, max: LIMITS.subject.max }),
  message: (v) => validateText(v, { label: 'Message', required: true, min: LIMITS.message.min, max: LIMITS.message.max }),
}

export default function Contact() {
  const { user } = useAuth()
  const { values, fieldProps, validateAll, reset, setValues } = useValidatedForm(
    { name: user?.name ?? '', email: user?.email ?? '', phone: '', subject: '', message: '' },
    RULES
  )
  // The session is restored asynchronously, so fill in the signed-in user's
  // details once they arrive (without overwriting anything already typed).
  useEffect(() => {
    if (!user) return
    setValues((v) => ({ ...v, name: v.name || user.name, email: v.email || user.email }))
  }, [user, setValues])

  const [sent, setSent] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validateAll()) return
    setSubmitting(true)
    try {
      saveContactMessage(values)
      setSent(values.name.trim())
      reset()
    } catch {
      setError('Could not send your message. Browser storage may be full or blocked — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Container className="py-12 sm:py-16">
        <div className="max-w-[560px] mx-auto">
          <span className="block text-[11px] tracking-[0.18em] uppercase text-brass font-medium">Contact us</span>
          <h1 className="font-display text-[30px] sm:text-[36px] text-ink-text mt-3">Get in touch.</h1>
          <p className="text-[13.5px] text-muted mt-2 leading-relaxed">
            Questions, feedback or a bug to report? Send us a message and we'll take a look.
          </p>

          <GlassCard className="mt-8 p-6 sm:p-8">
            {sent ? (
              <div role="status">
                <h2 className="font-display text-[20px] text-ink-text">Thanks, {sent.split(' ')[0]}.</h2>
                <p className="text-[13.5px] text-muted mt-2 leading-relaxed">
                  Your message has been received.
                </p>
                <div className="flex gap-3 mt-6">
                  <Button onClick={() => setSent(null)} variant="ghost" size="md">
                    Send another
                  </Button>
                  <Button as={Link} to="/" size="md">
                    Back home
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <TextField
                  label="Your name"
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
                  label="Phone (optional)"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  placeholder="+92 300 1234567"
                  {...fieldProps('phone')}
                />
                <TextField
                  label="Subject"
                  maxLength={LIMITS.subject.max}
                  placeholder="What is this about?"
                  {...fieldProps('subject')}
                />
                <Textarea
                  label="Message"
                  rows={6}
                  maxLength={LIMITS.message.max}
                  placeholder="Tell us a bit more…"
                  {...fieldProps('message')}
                />

                {error && (
                  <div role="alert" className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-3.5 py-2.5">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={submitting} className="mt-2 justify-center disabled:opacity-60">
                  {submitting ? 'Sending…' : 'Send message →'}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

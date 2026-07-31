import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import Logo from '../components/ui/Logo.jsx'
import HomeIcon from '../components/ui/HomeIcon.jsx'
import Button from '../components/ui/Button.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Container from '../components/ui/Container.jsx'
import TextField from '../components/ui/TextField.jsx'

export default function Profile() {
  const { user, updateName, changePassword, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user.name)
  const [nameStatus, setNameStatus] = useState('')

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwStatus, setPwStatus] = useState('')
  const [pwSubmitting, setPwSubmitting] = useState(false)

  function handleNameSave(e) {
    e.preventDefault()
    try {
      updateName(name)
      setNameStatus('Saved.')
      setTimeout(() => setNameStatus(''), 2000)
    } catch (err) {
      setNameStatus(err.message)
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPwError('')
    setPwStatus('')
    setPwSubmitting(true)
    try {
      await changePassword(pwForm)
      setPwStatus('Password updated.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message)
    } finally {
      setPwSubmitting(false)
    }
  }

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-ink">
      <Container className="py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Logo />
            </Link>
            <HomeIcon />
          </div>
          <Button as={Link} to="/dashboard" variant="ghost" size="md">
            ← Dashboard
          </Button>
        </div>

        <span className="block text-[11px] tracking-[0.18em] uppercase text-brass font-medium mt-10">
          Account
        </span>
        <h1 className="font-display text-[30px] text-ink-text mt-2">Your profile.</h1>

        <div className="grid lg:grid-cols-2 gap-6 mt-8 max-w-3xl">
          <GlassCard className="p-6">
            <h2 className="font-display text-[17px] text-ink-text">Name</h2>
            <form onSubmit={handleNameSave} className="mt-4 flex flex-col gap-3">
              <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField label="Email" value={user.email} disabled className="opacity-60" />
              <div className="flex items-center gap-3">
                <Button type="submit" size="md">
                  Save changes
                </Button>
                {nameStatus && <span className="text-[12px] text-brass-pale">{nameStatus}</span>}
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-display text-[17px] text-ink-text">Change password</h2>
            <form onSubmit={handlePasswordChange} className="mt-4 flex flex-col gap-3">
              <TextField
                label="Current password"
                type="password"
                required
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
              />
              <TextField
                label="New password"
                type="password"
                required
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
              />
              <TextField
                label="Confirm new password"
                type="password"
                required
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              />
              {pwError && <span className="text-[12px] text-rose">{pwError}</span>}
              {pwStatus && <span className="text-[12px] text-brass-pale">{pwStatus}</span>}
              <Button type="submit" size="md" disabled={pwSubmitting} className="disabled:opacity-60">
                {pwSubmitting ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          </GlassCard>
        </div>

        <GlassCard className="mt-6 p-6 max-w-3xl flex items-center justify-between">
          <div>
            <h2 className="font-display text-[17px] text-ink-text">Sign out</h2>
            <p className="text-[12.5px] text-muted mt-1">End your session on this device.</p>
          </div>
          <Button variant="ghost" size="md" onClick={handleSignOut}>
            Sign out
          </Button>
        </GlassCard>
      </Container>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { listResumes, createResume, updateResume, deleteResume } from '../lib/resumes/storage.js'
import { templates } from '../lib/documentThemes.js'
import Logo from '../components/ui/Logo.jsx'
import HomeIcon from '../components/ui/HomeIcon.jsx'
import Button from '../components/ui/Button.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Container from '../components/ui/Container.jsx'
import ResumeCard from '../components/dashboard/ResumeCard.jsx'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [resumes, setResumes] = useState([])
  const autoCreateHandled = useRef(false)

  function refresh() {
    setResumes(listResumes(user.id))
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  // If arriving from "Use this template" while logged out → signup →
  // redirected here with ?template=, create the resume automatically once
  // and drop straight into the builder, instead of making the person
  // repeat the template choice they already made.
  useEffect(() => {
    const templateId = searchParams.get('template')
    if (templateId && !autoCreateHandled.current) {
      autoCreateHandled.current = true
      const theme = templates.find((t) => t.id === templateId)
      if (theme) {
        const resume = createResume(user.id, {
          title: `${user.name.split(' ')[0]}'s Resume`,
          templateId: theme.id,
          prefill: { name: user.name, email: user.email },
        })
        setSearchParams({}, { replace: true })
        navigate(`/builder/${resume.id}`, { replace: true })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function handleCreateBlank() {
    const theme = templates[0]
    const resume = createResume(user.id, {
      title: `${user.name.split(' ')[0]}'s Resume`,
      templateId: theme.id,
      prefill: { name: user.name, email: user.email },
    })
    navigate(`/builder/${resume.id}`)
  }

  function handleRename(id, title) {
    updateResume(user.id, id, { title })
    refresh()
  }

  function handleDelete(id) {
    deleteResume(user.id, id)
    refresh()
  }

  return (
    <div className="min-h-screen bg-ink">
      <Container className="py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Logo />
            </Link>
            <HomeIcon />
          </div>
          <div className="flex items-center gap-3">
            <Button as={Link} to="/profile" variant="ghost" size="md">
              Profile
            </Button>
            <Button variant="ghost" size="md" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mt-10">
          <div>
            <span className="block text-[11px] tracking-[0.18em] uppercase text-brass font-medium">
              Welcome back
            </span>
            <h1 className="font-display text-[30px] sm:text-[36px] text-ink-text mt-2">
              Good to see you, <span className="italic text-brass-pale">{user.name.split(' ')[0]}.</span>
            </h1>
            <p className="text-[13px] text-muted mt-2">
              {resumes.length === 0
                ? "You don't have any resumes yet — let's fix that."
                : `${resumes.length} resume${resumes.length === 1 ? '' : 's'} saved.`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button as={Link} to="/templates" variant="ghost" size="md">
              Browse templates
            </Button>
            <Button onClick={handleCreateBlank} size="md">
              + New resume
            </Button>
          </div>
        </div>

        {resumes.length === 0 ? (
          <GlassCard className="mt-10 p-10 text-center max-w-lg mx-auto">
            <p className="font-display text-[19px] text-ink-text">Nothing here yet.</p>
            <p className="text-[13px] text-muted mt-2 leading-relaxed">
              Pick one of 20 templates, or start blank and choose later — either way, you're a
              few minutes from a finished draft.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Button as={Link} to="/templates" size="md">
                See templates →
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {resumes.map((r) => (
              <ResumeCard
                key={r.id}
                resume={r}
                onRename={(title) => handleRename(r.id, title)}
                onDelete={() => handleDelete(r.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

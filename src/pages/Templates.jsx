import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ResumeDocument from '../components/resume/ResumeDocument.jsx'
import { templates } from '../lib/documentThemes.js'
import { createSampleResume } from '../lib/resumeSchema.js'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { createResume } from '../lib/resumes/storage.js'
import Button from '../components/ui/Button.jsx'

const CATEGORY_ORDER = [
  'Executive',
  'Corporate',
  'Modern',
  'Technology',
  'Creative',
  'Academic',
  'Minimal',
]

export default function Templates() {
  const { user } = useAuth()
  const data = createSampleResume()
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: templates.filter((t) => t.category === cat),
  }))

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />

      <section className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12 pt-4 pb-12">
        <span className="block text-[11px] tracking-[0.15em] uppercase text-brass font-medium">
          20 Templates
        </span>
        <h1 className="font-display text-[30px] sm:text-[42px] text-ink-text mt-3 max-w-xl leading-tight">
          Every template, fully shown — pick one, keep your content.
        </h1>
        <p className="text-[13.5px] text-muted mt-4 max-w-md leading-relaxed">
          Real layout, real hierarchy, real content in every preview. Switch
          templates anytime later without losing anything you've written.
        </p>
      </section>

      {grouped.map(
        (group) =>
          group.items.length > 0 && (
            <section key={group.category} className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12 pb-14">
              <h2 className="font-display text-[19px] text-ink-text mb-5">{group.category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((theme) => (
                  <TemplateCard key={theme.id} theme={theme} data={data} user={user} />
                ))}
              </div>
            </section>
          )
      )}

      <Footer />
    </div>
  )
}

function TemplateCard({ theme, data, user }) {
  const navigate = useNavigate()

  function handleUse() {
    if (!user) return // Link below handles the logged-out case
    const resume = createResume(user.id, {
      title: `${user.name.split(' ')[0]}'s Resume`,
      templateId: theme.id,
      prefill: { name: user.name, email: user.email },
    })
    navigate(`/builder/${resume.id}`)
  }

  return (
    <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] flex flex-col">
      {/* Fixed-height clipped preview of the real engine output — not a mockup */}
      <div className="h-[340px] overflow-hidden relative bg-white">
        <div className="origin-top-left scale-[0.62] w-[161%]">
          <ResumeDocument data={data} theme={theme} />
        </div>
      </div>
      <div className="px-5 py-4 flex items-center justify-between border-t border-black/5 bg-white">
        <div>
          <div className="text-[12.5px] font-semibold text-ink">{theme.name}</div>
          <div className="text-[9px] font-mono text-graphite/50 mt-0.5">{theme.tag}</div>
        </div>
        {user ? (
          <Button variant="dark" size="md" className="text-[11px] px-4 py-2.5" onClick={handleUse}>
            Use this
          </Button>
        ) : (
          <Button as={Link} to={`/signup?template=${theme.id}`} variant="dark" size="md" className="text-[11px] px-4 py-2.5">
            Use this
          </Button>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext.jsx'
import { getResume, updateResume } from '../lib/resumes/storage.js'
import { templates } from '../lib/documentThemes.js'
import ResumeDocument from '../components/resume/ResumeDocument.jsx'
import Logo from '../components/ui/Logo.jsx'
import HomeIcon from '../components/ui/HomeIcon.jsx'
import Button from '../components/ui/Button.jsx'
import GlassCard from '../components/ui/GlassCard.jsx'
import Container from '../components/ui/Container.jsx'
import BuilderNav from '../components/builder/BuilderNav.jsx'
import TemplateSwitcherModal from '../components/builder/TemplateSwitcherModal.jsx'
import AiReviewPanel from '../components/builder/AiReviewPanel.jsx'
import PersonalSection from '../components/builder/sections/PersonalSection.jsx'
import SummarySection from '../components/builder/sections/SummarySection.jsx'
import ExperienceSection from '../components/builder/sections/ExperienceSection.jsx'
import EducationSection from '../components/builder/sections/EducationSection.jsx'
import ProjectsSection from '../components/builder/sections/ProjectsSection.jsx'
import SkillsSection from '../components/builder/sections/SkillsSection.jsx'
import CertificatesSection from '../components/builder/sections/CertificatesSection.jsx'
import ExtrasSection from '../components/builder/sections/ExtrasSection.jsx'

const AUTOSAVE_DELAY_MS = 800

export default function Builder() {
  const { user } = useAuth()
  const { resumeId } = useParams()

  const [resume, setResume] = useState(() => getResume(user.id, resumeId))
  const [activeSection, setActiveSection] = useState('personal')
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved' | 'saving' | 'error'
  const [mobileView, setMobileView] = useState('edit') // 'edit' | 'preview' — only matters below lg
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const saveTimer = useRef(null)
  const isFirstRender = useRef(true)
  const latestResumeRef = useRef(resume)

  const theme = resume ? templates.find((t) => t.id === resume.templateId) : null

  useEffect(() => {
    latestResumeRef.current = resume
  }, [resume])

  // Persists data, title, AND templateId — template switching (added this
  // step) changes templateId, so it has to be in both the watch list and
  // the save payload, or switching templates would silently fail to save.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!resume) return

    setSaveStatus('saving')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try {
        updateResume(user.id, resume.id, {
          data: resume.data,
          title: resume.title,
          templateId: resume.templateId,
        })
        setSaveStatus('saved')
      } catch {
        setSaveStatus('error')
      }
    }, AUTOSAVE_DELAY_MS)

    return () => clearTimeout(saveTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume?.data, resume?.title, resume?.templateId])

  // Flush any pending edit immediately on unmount — same fix as before,
  // now also covering templateId so a last-second template switch isn't
  // lost if someone navigates away inside the debounce window. Wrapped in
  // try/catch (matching the debounced save above) so a storage error
  // during unmount — e.g. quota exceeded from a large photo — fails
  // quietly instead of throwing during React's cleanup phase.
  useEffect(() => {
    return () => {
      clearTimeout(saveTimer.current)
      const r = latestResumeRef.current
      if (r) {
        try {
          updateResume(user.id, r.id, { data: r.data, title: r.title, templateId: r.templateId })
        } catch {
          // Nothing more to do here — the component is already unmounting.
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateData = useCallback((field, value) => {
    setResume((r) => ({ ...r, data: { ...r.data, [field]: value } }))
  }, [])

  function handleSelectTemplate(templateId) {
    setResume((r) => ({ ...r, templateId }))
    setSwitcherOpen(false)
  }

  async function handleDownloadPdf() {
    setPdfError('')
    setPdfGenerating(true)
    try {
      // Dynamic import — @react-pdf/renderer is a large library that most
      // visitors (browsing templates, the marketing page, etc.) never
      // need. Loading it only on first click here keeps it out of the
      // main app bundle entirely.
      const { downloadResumePdf } = await import('../lib/pdf/downloadPdf.jsx')
      await downloadResumePdf({ data: resume.data, theme, filename: resume.title })
    } catch (err) {
      setPdfError('Could not generate the PDF: ' + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-ink">
        <Container className="py-10">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Logo />
            </Link>
            <HomeIcon />
          </div>
          <GlassCard className="mt-10 p-8 max-w-md">
            <p className="font-display text-[18px] text-ink-text">Resume not found.</p>
            <p className="text-[13px] text-muted mt-2">It may have been deleted, or belongs to a different account.</p>
            <Button as={Link} to="/dashboard" size="md" className="mt-5">
              Back to dashboard →
            </Button>
          </GlassCard>
        </Container>
      </div>
    )
  }

  return (
    <>
      {/* Everything in this wrapper disappears during print — only the
          dedicated print container below (outside this wrapper) shows. */}
      <div className="min-h-screen bg-ink print:hidden">
        <Container className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Logo />
              </Link>
              <HomeIcon />
            </div>
            <div className="flex items-center gap-4">
              <SaveIndicator status={saveStatus} />
              <Button as={Link} to="/dashboard" variant="ghost" size="md">
                ← Dashboard
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <input
                value={resume.title}
                onChange={(e) => setResume((r) => ({ ...r, title: e.target.value }))}
                className="font-display text-[22px] sm:text-[24px] text-ink-text bg-transparent outline-none border-b border-transparent focus:border-brass/40 transition-colors min-w-0"
              />
              <button
                onClick={() => setSwitcherOpen(true)}
                className="text-[11px] font-mono text-brass-pale hover:text-brass border border-brass/30 rounded-full px-3 py-1.5 transition-colors shrink-0"
              >
                {theme?.name} · Switch
              </button>
              <button
                onClick={() => setReviewOpen(true)}
                className="text-[11px] font-medium text-brass-pale hover:text-brass border border-brass/30 rounded-full px-3 py-1.5 transition-colors shrink-0"
              >
                ✨ AI Review
              </button>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="ghost" size="md" onClick={() => window.print()} className="text-[12px]">
                Print
              </Button>
              <Button size="md" onClick={handleDownloadPdf} disabled={pdfGenerating} className="text-[12px] disabled:opacity-60">
                {pdfGenerating ? 'Generating…' : 'Download PDF'}
              </Button>
            </div>
          </div>
          {pdfError && <p className="text-[11px] text-rose mt-1.5">{pdfError}</p>}

          {/* Mobile-only edit/preview toggle — side-by-side doesn't fit below lg */}
          <div className="flex lg:hidden gap-2 mt-5">
            <ToggleButton active={mobileView === 'edit'} onClick={() => setMobileView('edit')}>
              Edit
            </ToggleButton>
            <ToggleButton active={mobileView === 'preview'} onClick={() => setMobileView('preview')}>
              Preview
            </ToggleButton>
          </div>

          <div className="grid lg:grid-cols-[190px_1fr_420px] gap-6 lg:gap-8 mt-6 lg:mt-8 items-start">
            <div className={mobileView === 'edit' ? 'block' : 'hidden lg:block'}>
              <BuilderNav active={activeSection} onSelect={setActiveSection} />
            </div>

            <GlassCard className={`p-6 sm:p-8 ${mobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
              {activeSection === 'personal' && (
                <SectionHeading title="Personal Details">
                  <PersonalSection value={resume.data.personal} onChange={(v) => updateData('personal', v)} />
                </SectionHeading>
              )}
              {activeSection === 'summary' && (
                <SectionHeading title="Summary">
                  <SummarySection value={resume.data.summary} onChange={(v) => updateData('summary', v)} resumeContext={resume.data} />
                </SectionHeading>
              )}
              {activeSection === 'experience' && (
                <SectionHeading title="Experience">
                  <ExperienceSection value={resume.data.experience} onChange={(v) => updateData('experience', v)} />
                </SectionHeading>
              )}
              {activeSection === 'education' && (
                <SectionHeading title="Education">
                  <EducationSection value={resume.data.education} onChange={(v) => updateData('education', v)} />
                </SectionHeading>
              )}
              {activeSection === 'projects' && (
                <SectionHeading title="Projects">
                  <ProjectsSection value={resume.data.projects} onChange={(v) => updateData('projects', v)} />
                </SectionHeading>
              )}
              {activeSection === 'skills' && (
                <SectionHeading title="Skills">
                  <SkillsSection value={resume.data.skills} onChange={(v) => updateData('skills', v)} resumeContext={resume.data} />
                </SectionHeading>
              )}
              {activeSection === 'certificates' && (
                <SectionHeading title="Certificates">
                  <CertificatesSection value={resume.data.certificates} onChange={(v) => updateData('certificates', v)} />
                </SectionHeading>
              )}
              {activeSection === 'extras' && (
                <SectionHeading title="Extras">
                  <ExtrasSection value={resume.data.extras} onChange={(v) => updateData('extras', v)} />
                </SectionHeading>
              )}
            </GlassCard>

            {/* Live preview — sticky on desktop so it stays visible while the
                form scrolls; rendered at natural width via the engine's own
                width:100%/max-width, not a scale hack, since this needs to be
                read, not just glanced at like the dashboard thumbnails. */}
            <div className={mobileView === 'preview' ? 'block' : 'hidden lg:block'}>
              <div className="lg:sticky lg:top-6">
                <div className="bg-white rounded-[10px] overflow-hidden shadow-2xl max-h-[calc(100vh-3rem)] overflow-y-auto">
                  <ResumeDocument data={resume.data} theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </Container>

        {switcherOpen && (
          <TemplateSwitcherModal
            data={resume.data}
            currentTemplateId={resume.templateId}
            onSelect={handleSelectTemplate}
            onClose={() => setSwitcherOpen(false)}
          />
        )}

        {reviewOpen && <AiReviewPanel resumeData={resume.data} onClose={() => setReviewOpen(false)} />}
      </div>

      {/* Dedicated print target — always mounted, invisible on screen,
          and completely independent of mobileView/switcherOpen/etc, so
          Print/Download PDF works correctly no matter what state the
          builder UI is in when the person clicks it. */}
      <div className="hidden print:block" data-resume-print>
        <ResumeDocument data={resume.data} theme={theme} />
      </div>
    </>
  )
}

function SectionHeading({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-[19px] text-ink-text mb-5">{title}</h2>
      {children}
    </div>
  )
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-[6px] text-[13px] font-medium transition-colors ${
        active ? 'bg-brass/15 text-brass-pale' : 'bg-white/[0.04] text-muted'
      }`}
    >
      {children}
    </button>
  )
}

function SaveIndicator({ status }) {
  const shortLabel = status === 'saving' ? 'Saving…' : status === 'error' ? 'Failed' : 'Saved'
  const longLabel = status === 'saving' ? 'Saving…' : status === 'error' ? 'Save failed' : 'All changes saved'
  const styles =
    status === 'error'
      ? 'bg-rose/10 border-rose/30 text-rose'
      : status === 'saving'
      ? 'bg-white/[0.04] border-white/15 text-muted'
      : 'bg-teal/10 border-teal/30 text-teal'
  return (
    <span className={`text-[11.5px] font-medium flex items-center gap-2 border rounded-full px-3 py-1.5 ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-rose' : status === 'saving' ? 'bg-muted animate-pulse' : 'bg-teal'}`} />
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{longLabel}</span>
    </span>
  )
}

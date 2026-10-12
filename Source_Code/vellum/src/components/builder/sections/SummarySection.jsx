import { useState } from 'react'
import Textarea from '../../ui/Textarea.jsx'
import AiButton from '../../ui/AiButton.jsx'
import { LIMITS, validateText } from '../../../lib/validation.js'
import { aiGenerateSummary, aiImproveSummary } from '../../../lib/ai/client.js'

export default function SummarySection({ value, onChange, resumeContext }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setError('')
    setLoading(true)
    try {
      const summary = await aiGenerateSummary({
        personal: resumeContext.personal,
        experience: resumeContext.experience,
        skills: resumeContext.skills,
      })
      onChange(summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleImprove() {
    if (!value?.trim()) return
    setError('')
    setLoading(true)
    try {
      const improved = await aiImproveSummary({ summaryText: value })
      onChange(improved)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canGenerate = Boolean(resumeContext?.personal?.title?.trim())
  const hasContent = Boolean(value?.trim())

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
        <span className="block text-[11px] tracking-wide text-muted">Professional summary</span>
        <div className="flex items-center gap-3">
          {hasContent && (
            <AiButton onClick={handleImprove} loading={loading}>
              Improve with AI
            </AiButton>
          )}
          <AiButton onClick={handleGenerate} loading={loading}>
            Generate with AI
          </AiButton>
        </div>
      </div>
      <Textarea
        rows={5}
        maxLength={LIMITS.summary}
        validate={(v) => validateText(v, { label: 'Summary', max: LIMITS.summary })}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A short, recruiter-facing paragraph on who you are and what you're known for."
      />
      {error && <p className="text-[11.5px] text-rose mt-2">{error}</p>}
      {!canGenerate && !error && (
        <p className="text-[11.5px] text-muted-dark mt-2">
          Add a title in Personal Details first so AI has something to work from.
        </p>
      )}
    </div>
  )
}

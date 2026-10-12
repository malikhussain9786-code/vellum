import { useState } from 'react'
import TagInput from '../../ui/TagInput.jsx'
import AiButton from '../../ui/AiButton.jsx'
import { aiSuggestSkills } from '../../../lib/ai/client.js'

export default function SkillsSection({ value, onChange, resumeContext }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])

  function update(field) {
    return (tags) => onChange({ ...value, [field]: tags })
  }

  async function handleSuggest() {
    setError('')
    setLoading(true)
    try {
      const existing = [...(value.technical || []), ...(value.soft || [])]
      const skills = await aiSuggestSkills({
        title: resumeContext?.personal?.title,
        experience: resumeContext?.experience,
        existingSkills: existing,
      })
      // Filter out anything already listed, in case the model repeats one
      setSuggestions(skills.filter((s) => !existing.includes(s)))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function acceptSuggestion(skill) {
    onChange({ ...value, technical: [...(value.technical || []), skill] })
    setSuggestions((s) => s.filter((x) => x !== skill))
  }

  return (
    <div className="flex flex-col gap-5">
      <TagInput label="Technical skills" value={value.technical} onChange={update('technical')} placeholder="Figma, Design Systems…" />
      <TagInput label="Soft skills" value={value.soft} onChange={update('soft')} placeholder="User Research, Leadership…" />
      <TagInput label="Languages" value={value.languages} onChange={update('languages')} placeholder="English (native)…" />

      <div className="pt-1">
        <AiButton onClick={handleSuggest} loading={loading}>
          Suggest skills with AI
        </AiButton>
        {error && <p className="text-[11.5px] text-rose mt-2">{error}</p>}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => acceptSuggestion(s)}
                className="text-[12px] bg-white/[0.05] border border-brass/30 text-brass-pale rounded-full px-3 py-1.5 hover:bg-brass/15 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

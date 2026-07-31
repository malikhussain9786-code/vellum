import { useState } from 'react'
import AiButton from '../ui/AiButton.jsx'
import { aiImproveBullet } from '../../lib/ai/client.js'

export default function BulletListEditor({ bullets = [], onChange, placeholder, jobContext }) {
  const [improvingIdx, setImprovingIdx] = useState(null)
  const [error, setError] = useState('')

  function updateBullet(idx, text) {
    const next = [...bullets]
    next[idx] = text
    onChange(next)
  }

  function removeBullet(idx) {
    onChange(bullets.filter((_, i) => i !== idx))
  }

  function addBullet() {
    onChange([...bullets, ''])
  }

  async function handleImprove(idx) {
    const text = bullets[idx]?.trim()
    if (!text) return
    setError('')
    setImprovingIdx(idx)
    try {
      const improved = await aiImproveBullet({
        bulletText: text,
        jobTitle: jobContext?.title,
        company: jobContext?.company,
      })
      updateBullet(idx, improved)
    } catch (err) {
      setError(err.message)
    } finally {
      setImprovingIdx(null)
    }
  }

  return (
    <div>
      <span className="block text-[11px] tracking-wide text-muted mb-1.5">Achievements</span>
      <div className="flex flex-col gap-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-brass mt-3 text-[12px]">—</span>
            <input
              value={b}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-white/[0.04] border border-white/15 focus:border-brass/50 rounded-[4px] px-3 py-2.5 text-[13px] text-ink-text placeholder:text-muted-dark outline-none transition-colors"
            />
            <AiButton onClick={() => handleImprove(i)} loading={improvingIdx === i} className="mt-2.5 shrink-0">
              Improve
            </AiButton>
            <button
              type="button"
              onClick={() => removeBullet(i)}
              className="text-muted hover:text-rose text-[12px] mt-2.5"
              aria-label="Remove bullet"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {error && <p className="text-[11.5px] text-rose mt-2">{error}</p>}
      <button
        type="button"
        onClick={addBullet}
        className="text-[12px] text-brass-pale hover:text-brass mt-2.5"
      >
        + Add achievement
      </button>
    </div>
  )
}

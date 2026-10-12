import { useState, useEffect, useRef } from 'react'
import { aiReviewResume } from '../../lib/ai/client.js'
import Button from '../ui/Button.jsx'

export default function AiReviewPanel({ resumeData, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function runReview() {
    setError('')
    setLoading(true)
    try {
      const data = await aiReviewResume({ resumeData })
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hasFetched = useRef(false)

  // Run automatically on open, exactly once — guarded with a ref rather
  // than relying on the effect running once, because React StrictMode
  // deliberately double-invokes effects in development to catch missing
  // cleanup logic. Without this guard, every panel open would fire two
  // real (costed) AI requests in dev mode.
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    runReview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-soft border border-white/10 rounded-t-[14px] sm:rounded-[14px] w-full sm:max-w-[520px] max-h-[85vh] overflow-y-auto p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-[19px] text-ink-text">AI Resume Review</h2>
          <button onClick={onClose} className="text-muted hover:text-ink-text text-[13px]">
            ✕ Close
          </button>
        </div>

        {loading && (
          <div className="py-10 text-center">
            <span className="text-[13px] text-muted animate-pulse">Reviewing your resume…</span>
          </div>
        )}

        {!loading && error && (
          <div className="text-[13px] text-rose bg-rose/10 border border-rose/25 rounded-[4px] px-4 py-3">
            {error}
            <div className="mt-3">
              <Button size="md" variant="ghost" onClick={runReview}>
                Try again
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && result && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="text-[36px] font-display text-brass-pale leading-none">{result.atsScore}</div>
              <div>
                <div className="text-[13px] text-ink-text font-medium">ATS compatibility</div>
                <div className="text-[11.5px] text-muted-dark">out of 100</div>
              </div>
            </div>

            {result.strengths?.length > 0 && (
              <div>
                <h3 className="text-[11px] tracking-wide uppercase text-teal mb-2">Strengths</h3>
                <ul className="flex flex-col gap-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-[13px] text-ink-text flex gap-2">
                      <span className="text-teal">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.improvements?.length > 0 && (
              <div>
                <h3 className="text-[11px] tracking-wide uppercase text-brass mb-2">Suggested improvements</h3>
                <ul className="flex flex-col gap-1.5">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-[13px] text-ink-text flex gap-2">
                      <span className="text-brass">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

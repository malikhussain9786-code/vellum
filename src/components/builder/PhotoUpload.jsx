import { useRef, useState } from 'react'
import { resizeAndCompressImage } from '../../lib/image.js'

export default function PhotoUpload({ value, onChange }) {
  const inputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    setError('')
    setLoading(true)
    try {
      const dataUrl = await resizeAndCompressImage(file)
      onChange(dataUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <span className="block text-[11px] tracking-wide text-muted mb-1.5">Photo (optional)</span>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white/[0.04] border border-white/15 flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt="Your photo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-dark">No photo</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="text-[12px] text-brass-pale hover:text-brass border border-brass/30 rounded-full px-3.5 py-1.5 transition-colors disabled:opacity-60"
            >
              {loading ? 'Processing…' : value ? 'Change photo' : 'Upload photo'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[12px] text-muted hover:text-rose transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <span className="text-[10.5px] text-muted-dark">JPG or PNG, from your device or camera.</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {error && <p className="text-[11.5px] text-rose mt-2">{error}</p>}
    </div>
  )
}

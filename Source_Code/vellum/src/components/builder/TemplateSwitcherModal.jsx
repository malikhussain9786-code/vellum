import ResumeDocument from '../resume/ResumeDocument.jsx'
import { templates } from '../../lib/documentThemes.js'

const CATEGORY_ORDER = [
  'Executive', 'Corporate', 'Modern', 'Technology', 'Creative', 'Academic', 'Minimal', 'ATS-friendly',
]

export default function TemplateSwitcherModal({ data, currentTemplateId, onSelect, onClose }) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: templates.filter((t) => t.category === cat),
  }))

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-soft border border-white/10 rounded-t-[14px] sm:rounded-[14px] w-full sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-ink-soft border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-[18px] text-ink-text">Switch template</h2>
          <button onClick={onClose} className="text-muted hover:text-ink-text text-[13px]">
            ✕ Close
          </button>
        </div>

        <div className="px-6 py-6">
          {grouped.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.category} className="mb-8 last:mb-0">
                  <h3 className="text-[11px] tracking-[0.12em] uppercase text-brass font-medium mb-3">
                    {group.category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {group.items.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => onSelect(theme.id)}
                        className={`bg-white rounded-[8px] overflow-hidden text-left transition-all ${
                          theme.id === currentTemplateId
                            ? 'ring-2 ring-brass shadow-[0_0_0_1px_rgba(217,181,105,0.5)]'
                            : 'hover:ring-1 hover:ring-white/30'
                        }`}
                      >
                        <div className="h-[140px] overflow-hidden relative">
                          <div className="origin-top-left scale-[0.26] w-[385%] pointer-events-none">
                            <ResumeDocument data={data} theme={theme} />
                          </div>
                        </div>
                        <div className="px-3 py-2.5 border-t border-black/5">
                          <div className="text-[11px] font-semibold text-ink">{theme.name}</div>
                          {theme.id === currentTemplateId && (
                            <div className="text-[9px] text-brass-deep font-mono mt-0.5">Current</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  )
}

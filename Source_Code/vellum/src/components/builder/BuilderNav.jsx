const SECTIONS = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'summary', label: 'Summary' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'projects', label: 'Projects' },
  { key: 'skills', label: 'Skills' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'extras', label: 'Extras' },
]

export { SECTIONS }

export default function BuilderNav({ active, onSelect }) {
  return (
    <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
      {SECTIONS.map((s) => (
        <button
          key={s.key}
          onClick={() => onSelect(s.key)}
          className={`text-left whitespace-nowrap px-4 py-2.5 rounded-[6px] text-[13px] transition-colors ${
            active === s.key
              ? 'bg-brass/15 text-brass-pale font-medium'
              : 'text-muted hover:text-ink-text hover:bg-white/[0.04]'
          }`}
        >
          {s.label}
        </button>
      ))}
    </nav>
  )
}

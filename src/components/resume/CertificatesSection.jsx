import SectionTitle from './SectionTitle.jsx'

export default function CertificatesSection({ theme, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionTitle theme={theme}>Certificates</SectionTitle>
      {items.map((c) => (
        <div
          key={c.id}
          style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '10.5px', marginBottom: '3px' }}
        >
          <span style={{ color: theme.colors.text, minWidth: 0, overflowWrap: 'normal', wordBreak: 'normal' }}>
            {c.name} — {c.org}
          </span>
          <span style={{ color: theme.colors.muted, fontSize: '9.5px', flexShrink: 0, fontWeight: 500, whiteSpace: 'nowrap' }}>{c.date}</span>
        </div>
      ))}
    </div>
  )
}

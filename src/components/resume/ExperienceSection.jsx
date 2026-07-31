import SectionTitle from './SectionTitle.jsx'

export default function ExperienceSection({ theme, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionTitle theme={theme}>Experience</SectionTitle>
      {items.map((e) => (
        <div key={e.id} style={{ marginBottom: '9px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '11.5px',
              fontWeight: 700,
              color: theme.colors.text,
            }}
          >
            <span style={{ minWidth: 0, overflowWrap: 'normal', wordBreak: 'normal' }}>
              {e.title}, {e.company}
            </span>
            <span style={{ fontWeight: 500, color: theme.colors.muted, fontSize: '9.5px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {e.startDate} — {e.current ? 'Present' : e.endDate}
            </span>
          </div>
          {e.location && (
            <div style={{ fontSize: '9.5px', color: theme.colors.muted, marginTop: '1px' }}>
              {e.location}
            </div>
          )}
          {(e.bullets || []).map((b, i) => (
            <div
              key={i}
              style={{
                fontSize: '10px',
                color: theme.colors.text,
                marginTop: '3px',
                lineHeight: 1.45,
                paddingLeft: '11px',
                position: 'relative',
              }}
            >
              <span style={{ position: 'absolute', left: 0, color: theme.colors.accent, fontWeight: 700 }}>—</span>
              {b}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

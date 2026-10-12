import SectionTitle from './SectionTitle.jsx'

export default function ExperienceTimeline({ theme, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionTitle theme={theme}>Experience</SectionTitle>
      <div style={{ position: 'relative' }}>
        {items.map((e, i) => (
          <div key={e.id} style={{ position: 'relative', paddingLeft: '20px', marginBottom: '14px' }}>
            {/* connecting line */}
            {i < items.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '14px',
                  bottom: '-14px',
                  width: '1.5px',
                  background: theme.colors.border,
                }}
              />
            )}
            {/* dot marker */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '3px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: theme.colors.bg,
                border: `2px solid ${theme.colors.accent}`,
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: theme.colors.text, minWidth: 0, overflowWrap: 'normal', wordBreak: 'normal' }}>
                {e.title}, {e.company}
              </span>
              <span style={{ fontWeight: 500, color: theme.colors.muted, fontSize: '9.5px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {e.startDate} — {e.current ? 'Present' : e.endDate}
              </span>
            </div>
            {e.location && (
              <div style={{ fontSize: '9.5px', color: theme.colors.muted, marginTop: '1px' }}>{e.location}</div>
            )}
            {(e.bullets || []).map((b, bi) => (
              <div
                key={bi}
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
    </div>
  )
}

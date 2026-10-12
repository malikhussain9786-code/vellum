import SectionTitle from './SectionTitle.jsx'

export default function EducationSection({ theme, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionTitle theme={theme}>Education</SectionTitle>
      {items.map((ed) => (
        <div key={ed.id} style={{ marginBottom: '7px' }}>
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
            <span style={{ minWidth: 0, overflowWrap: 'normal', wordBreak: 'normal' }}>{ed.degree}</span>
            <span style={{ fontWeight: 500, color: theme.colors.muted, fontSize: '9.5px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {ed.startDate} — {ed.endDate}
            </span>
          </div>
          <div style={{ fontSize: '9.5px', color: theme.colors.muted, marginTop: '1px' }}>
            {ed.school}
            {ed.location ? `, ${ed.location}` : ''}
          </div>
          {ed.notes && (
            <div style={{ fontSize: '9.5px', color: theme.colors.text, marginTop: '2px' }}>{ed.notes}</div>
          )}
        </div>
      ))}
    </div>
  )
}

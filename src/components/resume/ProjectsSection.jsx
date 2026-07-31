import SectionTitle from './SectionTitle.jsx'

export default function ProjectsSection({ theme, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <SectionTitle theme={theme}>Projects</SectionTitle>
      {items.map((p) => (
        <div key={p.id} style={{ marginBottom: '7px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: theme.colors.text }}>
            {p.name}
            {p.link && (
              <span style={{ fontWeight: 500, color: theme.colors.accent, fontSize: '9.5px', marginLeft: '6px' }}>
                {p.link}
              </span>
            )}
          </div>
          {p.description && (
            <div style={{ fontSize: '10px', color: theme.colors.text, marginTop: '2px', lineHeight: 1.45 }}>
              {p.description}
            </div>
          )}
          {p.technologies && p.technologies.length > 0 && (
            <div style={{ fontSize: '9.5px', color: theme.colors.muted, marginTop: '2px' }}>
              {p.technologies.join(' · ')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

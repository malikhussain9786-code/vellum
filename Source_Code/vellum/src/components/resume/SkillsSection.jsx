import SectionTitle from './SectionTitle.jsx'

export default function SkillsSection({ theme, skills }) {
  const hasAny =
    skills && ((skills.technical?.length ?? 0) + (skills.soft?.length ?? 0) + (skills.languages?.length ?? 0) > 0)
  if (!hasAny) return null

  const groups = [
    { label: 'Technical', items: skills.technical },
    { label: 'Strengths', items: skills.soft },
    { label: 'Languages', items: skills.languages },
  ].filter((g) => g.items && g.items.length > 0)

  return (
    <div>
      <SectionTitle theme={theme}>Skills</SectionTitle>
      {groups.map((g) => (
        <div key={g.label} style={{ marginBottom: '5px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: theme.colors.muted,
              marginBottom: '3px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {g.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {g.items.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '9.5px',
                  fontWeight: 500,
                  padding: '3px 9px',
                  borderRadius: '10px',
                  border: `1.5px solid ${theme.colors.accent}77`,
                  color: theme.colors.accent,
                  fontFamily: theme.fonts.mono,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

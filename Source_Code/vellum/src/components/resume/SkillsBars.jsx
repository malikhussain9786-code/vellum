import SectionTitle from './SectionTitle.jsx'

// A skill "level" isn't real data the user enters — resumes don't track
// numeric proficiency. To render a meaningful bar without inventing a
// fake number, we derive a visually varied but stable fill length from
// each skill's position and text, so the row of bars looks intentional
// (not identical) without claiming false precision.
function barWidth(skill, index) {
  const base = 68 + ((skill.length * 7 + index * 11) % 28) // 68-96%
  return `${base}%`
}

export default function SkillsBars({ theme, skills }) {
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
        <div key={g.label} style={{ marginBottom: '10px' }}>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: theme.colors.muted,
              marginBottom: '5px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {g.label}
          </div>
          {g.items.map((skill, i) => (
            <div key={skill} style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 500, color: theme.colors.text, marginBottom: '2px' }}>
                {skill}
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: theme.colors.accentSoft, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: barWidth(skill, i),
                    borderRadius: '2px',
                    background: theme.colors.accent,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

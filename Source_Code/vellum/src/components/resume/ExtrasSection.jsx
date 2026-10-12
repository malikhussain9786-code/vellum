import SectionTitle from './SectionTitle.jsx'

function Row({ theme, title, sub, date, desc }) {
  return (
    <div style={{ marginBottom: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '10.5px' }}>
        <span style={{ color: theme.colors.text, fontWeight: 700, minWidth: 0, overflowWrap: 'normal', wordBreak: 'normal' }}>
          {title}
          {sub ? `, ${sub}` : ''}
        </span>
        <span style={{ color: theme.colors.muted, fontSize: '9.5px', flexShrink: 0, whiteSpace: 'nowrap', fontWeight: 500 }}>{date}</span>
      </div>
      {desc && (
        <div style={{ fontSize: '9.5px', color: theme.colors.text, marginTop: '1px', lineHeight: 1.45 }}>{desc}</div>
      )}
    </div>
  )
}

export default function ExtrasSection({ theme, extras }) {
  if (!extras) return null
  const { awards = [], publications = [], volunteer = [], custom = [] } = extras
  const hasAny = awards.length || publications.length || volunteer.length || custom.length
  if (!hasAny) return null

  return (
    <div>
      {awards.length > 0 && (
        <>
          <SectionTitle theme={theme}>Awards</SectionTitle>
          {awards.map((a) => (
            <Row key={a.id} theme={theme} title={a.title} sub={a.org} date={a.date} />
          ))}
        </>
      )}
      {publications.length > 0 && (
        <>
          <SectionTitle theme={theme}>Publications</SectionTitle>
          {publications.map((p) => (
            <Row key={p.id} theme={theme} title={p.title} sub={p.publisher} date={p.date} />
          ))}
        </>
      )}
      {volunteer.length > 0 && (
        <>
          <SectionTitle theme={theme}>Volunteer</SectionTitle>
          {volunteer.map((v) => (
            <Row key={v.id} theme={theme} title={v.role} sub={v.org} date={v.date} desc={v.description} />
          ))}
        </>
      )}
      {custom.map((section) => (
        <div key={section.id}>
          <SectionTitle theme={theme}>{section.sectionTitle}</SectionTitle>
          {section.items.map((item) => (
            <div key={item.id} style={{ fontSize: '10px', color: theme.colors.text, marginBottom: '3px' }}>
              {item.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function AliPreview({ theme, items = [] }) {
  const filled = (items || []).filter((i) => i.title || i.details || i.date)
  if (filled.length === 0) return null

  return (
    <div style={{ marginBottom: '16px' }}>
      <h2
        style={{
          fontFamily: theme.fonts.heading || theme.fonts.body,
          color: theme.colors.accent,
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: '0 0 8px',
          paddingBottom: '4px',
          borderBottom: `1px solid ${theme.colors.border || 'rgba(0,0,0,0.15)'}`,
        }}
      >
        Ali
      </h2>
      {filled.map((item) => (
        <div key={item.id} style={{ marginBottom: '6px', fontSize: '11.5px', color: theme.colors.text }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <strong>{item.title}</strong>
            <span style={{ color: theme.colors.muted }}>{item.date}</span>
          </div>
          {item.details && <div style={{ color: theme.colors.muted }}>{item.details}</div>}
        </div>
      ))}
    </div>
  )
}
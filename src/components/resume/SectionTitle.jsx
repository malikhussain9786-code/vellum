export default function SectionTitle({ theme, children }) {
  return (
    <div
      style={{
        fontSize: '10.5px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: theme.colors.accent,
        fontFamily: theme.fonts.mono,
        borderBottom: `1.5px solid ${theme.colors.border}`,
        paddingBottom: '4px',
        marginTop: '16px',
        marginBottom: '8px',
      }}
    >
      {children}
    </div>
  )
}

export default function Summary({ theme, text }) {
  if (!text) return null
  return (
    <p
      style={{
        fontSize: '11px',
        lineHeight: 1.6,
        color: theme.colors.text,
        marginTop: '12px',
      }}
    >
      {text}
    </p>
  )
}

// A quiet "letterpress" detail — a thin rule with a small centered diamond,
// using the theme's own accent color. Present across all 20 templates
// (including Minimal and ATS-friendly) since it's a pure visual divider,
// not a photo or layout complexity — it doesn't interfere with how ATS
// systems extract text, unlike the things that genuinely would.
export default function DecorativeDivider({ theme }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
      <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
      <div
        style={{
          width: '5px',
          height: '5px',
          transform: 'rotate(45deg)',
          background: theme.colors.accent,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
    </div>
  )
}

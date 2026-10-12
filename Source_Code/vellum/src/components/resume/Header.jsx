export default function Header({ theme, personal, compact = false }) {
  const contactLine = [personal.email, personal.phone, personal.location]
    .filter(Boolean)
    .join('  ·  ')
  const linkLine = [personal.linkedin, personal.portfolio].filter(Boolean).join('  ·  ')
  const showPhoto = theme.showPhoto !== false && personal.photoUrl

  // In the narrow sidebar column (~215px), photo + name side-by-side is
  // right at the edge of overflowing for anything but the shortest names —
  // stack vertically there instead. Full-width layouts (single/band) have
  // room for the side-by-side arrangement.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: compact ? 'column' : 'row',
        alignItems: compact ? 'flex-start' : 'center',
        gap: compact ? '10px' : '16px',
      }}
    >
      {showPhoto && (
        <img
          src={personal.photoUrl}
          alt=""
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${theme.colors.accent}`,
            flexShrink: 0,
          }}
        />
      )}
      <div
        style={{
          minWidth: 0,
          ...(compact ? { alignSelf: 'stretch', width: '100%' } : { flex: 1 }),
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: '25px',
            color: theme.colors.text,
            lineHeight: 1.1,
            // Names wrap at spaces only if truly necessary — never mid-word.
            overflowWrap: 'normal',
            wordBreak: 'normal',
          }}
        >
          {personal.name || 'Your Name'}
        </div>
        <div
          style={{
            fontSize: '12.5px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: theme.colors.accent,
            marginTop: '3px',
            fontFamily: theme.fonts.body,
            overflowWrap: 'normal',
            wordBreak: 'normal',
          }}
        >
          {personal.title || 'Your Role'}
        </div>
        {(contactLine || linkLine) && (
          <div
            style={{
              fontSize: '10.5px',
              color: theme.colors.muted,
              marginTop: '6px',
              lineHeight: 1.6,
              // Only the contact line needs aggressive breaking — a long
              // email/URL is the one genuine case of an unbroken string
              // that could overflow if not allowed to break mid-word.
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {contactLine}
            {contactLine && linkLine ? <br /> : null}
            {linkLine}
          </div>
        )}
      </div>
    </div>
  )
}

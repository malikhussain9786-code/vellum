// react-pdf needs one of the 14 standard PDF fonts (or a registered custom
// font). We deliberately use only standard fonts here — no Font.register(),
// no font file loading, no network dependency — because @react-pdf/renderer
// has known reliability issues with variable fonts (which is what all of
// this project's actual Google Fonts are), and a PDF that occasionally
// fails to render text correctly is a much worse outcome than a PDF that
// looks slightly plainer but works every single time, on every device,
// forever. This is a deliberate reliability-over-exact-match tradeoff.

export function getPdfFontFamily(theme) {
  const displayFont = theme.fonts.display || ''
  const isSerif = displayFont.includes('serif') && !displayFont.includes('sans-serif')
  return isSerif ? 'Times-Roman' : 'Helvetica'
}

export function getPdfBoldFontFamily(theme) {
  const displayFont = theme.fonts.display || ''
  const isSerif = displayFont.includes('serif') && !displayFont.includes('sans-serif')
  return isSerif ? 'Times-Bold' : 'Helvetica-Bold'
}

export const PDF_MONO_FONT = 'Courier'
export const PDF_MONO_BOLD_FONT = 'Courier-Bold'

import { Document, Page, View, Text, Image, Svg, Polygon, StyleSheet } from '@react-pdf/renderer'
import { getPdfFontFamily, getPdfBoldFontFamily, PDF_MONO_FONT, PDF_MONO_BOLD_FONT } from './pdfFonts.js'

// react-pdf only wraps text at whitespace by default — a long unbroken
// string like an email or URL (no spaces) overflows its container instead
// of wrapping, regardless of container width. Zero-width spaces are not
// reliably treated as break points by react-pdf's layout engine, so this
// forces explicit line breaks into any single "word" over ~34 characters
// — react-pdf does respect literal newlines, which guarantees no overflow
// regardless of the punctuation-based approach failing.
function breakable(text) {
  if (!text) return text
  return text
    .split(' ')
    .map((word) => (word.length > 34 ? word.match(/.{1,34}/g).join('\n') : word))
    .join(' ')
}

// Mirrors src/components/resume/ResumeDocument.jsx's three layouts and all
// eight section types, but targets react-pdf's primitives instead of HTML —
// a different rendering target for the same theme + data, not a
// reimplementation of the design decisions themselves.

export default function PdfResumeDocument({ data, theme }) {
  const font = getPdfFontFamily(theme)
  const boldFont = getPdfBoldFontFamily(theme)
  const c = theme.colors
  const showPhoto = theme.showPhoto !== false && data.personal.photoUrl

  const s = StyleSheet.create({
    page: { padding: 34, backgroundColor: c.bg, fontFamily: font, fontSize: 10.5, color: c.text },
    pageNoPad: { backgroundColor: c.bg, fontFamily: font, fontSize: 10.5, color: c.text },
    bandHeader: { backgroundColor: c.surface, padding: '24 34', marginBottom: 18 },
    bodyPad: { padding: '0 34 24' },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
    photo: { width: 50, height: 50, borderRadius: 25 },
    name: { fontFamily: boldFont, fontSize: 19, color: theme.colors.onSurface || c.text },
    title: { fontFamily: boldFont, fontSize: 10.5, letterSpacing: 0.5, color: theme.colors.onSurfaceAccent || c.accent, marginTop: 2, textTransform: 'uppercase' },
    contact: { fontSize: 9.5, color: theme.colors.onSurfaceMuted || c.muted, marginTop: 5 },
    sectionTitle: {
      fontFamily: PDF_MONO_BOLD_FONT, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
      color: c.accent, marginTop: 12, marginBottom: 5, borderBottom: `1.5 solid ${c.border}`, paddingBottom: 3,
    },
    summary: { fontSize: 10.5, lineHeight: 1.55, marginTop: 4 },
    jobRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, gap: 8 },
    jobTitle: { fontFamily: boldFont, fontSize: 11, flex: 1 },
    projectTitle: { fontFamily: boldFont, fontSize: 11 },
    jobMeta: { fontFamily: PDF_MONO_FONT, fontSize: 9, color: c.muted, flexShrink: 0 },
    bullet: { fontSize: 10, lineHeight: 1.45, marginTop: 2, color: c.text },
    tag: {
      fontFamily: PDF_MONO_FONT, fontSize: 8.5, color: c.accent, border: `1.3 solid ${c.accent}`,
      borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8, marginRight: 4, marginTop: 3,
    },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
    sidebarCol: { width: '36%', paddingRight: 14, paddingLeft: 24, paddingTop: 30, paddingBottom: 30, backgroundColor: c.surface },
    mainCol: { flex: 1, paddingLeft: 20, paddingRight: 30, paddingTop: 30, paddingBottom: 30 },
    row: { flexDirection: 'row' },
    dividerLine: { flex: 1, height: 1, backgroundColor: c.border },
    dividerWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 10 },
  })

  function SectionTitle({ children, override }) {
    const style = override
      ? { ...s.sectionTitle, color: override.accent, borderBottom: `1.5 solid ${override.border}` }
      : s.sectionTitle
    return <Text style={style}>{children}</Text>
  }

  function Divider({ override }) {
    const accentColor = override?.accent || c.accent
    const lineColor = override?.border || c.border
    return (
      <View style={s.dividerWrap}>
        <View style={{ ...s.dividerLine, backgroundColor: lineColor }} />
        <Svg width={5} height={5} viewBox="0 0 5 5">
          <Polygon points="2.5,0 5,2.5 2.5,5 0,2.5" fill={accentColor} />
        </Svg>
        <View style={{ ...s.dividerLine, backgroundColor: lineColor }} />
      </View>
    )
  }

  function Header({ compact }) {
    return (
      <View style={{ flexDirection: compact ? 'column' : 'row', alignItems: compact ? 'flex-start' : 'center', gap: 8 }}>
        {showPhoto && <Image src={data.personal.photoUrl} style={s.photo} />}
        <View style={compact ? { width: '100%' } : { flex: 1, minWidth: 0 }}>
          <Text style={s.name}>{data.personal.name || 'Your Name'}</Text>
          <Text style={s.title}>{data.personal.title || 'Your Role'}</Text>
          <Text style={s.contact}>
            {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).map(breakable).join('   ·   ')}
          </Text>
          {(data.personal.linkedin || data.personal.portfolio) && (
            <Text style={s.contact}>{[data.personal.linkedin, data.personal.portfolio].filter(Boolean).map(breakable).join('   ·   ')}</Text>
          )}
        </View>
      </View>
    )
  }

  function Summary() {
    if (!data.summary?.trim()) return null
    return <Text style={s.summary}>{data.summary}</Text>
  }

  function Experience() {
    if (!data.experience?.length) return null
    return (
      <View>
        <SectionTitle>Experience</SectionTitle>
        {data.experience.map((e) => (
          <View key={e.id} style={{ marginBottom: 6 }}>
            <View style={s.jobRow}>
              <Text style={s.jobTitle}>{e.title}{e.company ? `, ${e.company}` : ''}</Text>
              <Text style={s.jobMeta}>{e.startDate}{e.startDate ? ' — ' : ''}{e.current ? 'Present' : e.endDate}</Text>
            </View>
            {(e.bullets || []).map((b, i) => b?.trim() && <Text key={i} style={s.bullet}>— {b}</Text>)}
          </View>
        ))}
      </View>
    )
  }

  function Education() {
    if (!data.education?.length) return null
    return (
      <View>
        <SectionTitle>Education</SectionTitle>
        {data.education.map((e) => (
          <View key={e.id} style={{ marginBottom: 5 }}>
            <View style={s.jobRow}>
              <Text style={s.jobTitle}>{e.degree}{e.school ? `, ${e.school}` : ''}</Text>
              <Text style={s.jobMeta}>{e.startDate}{e.startDate ? ' — ' : ''}{e.endDate}</Text>
            </View>
            {e.notes && <Text style={s.bullet}>{e.notes}</Text>}
          </View>
        ))}
      </View>
    )
  }

  function Projects() {
    if (!data.projects?.length) return null
    return (
      <View>
        <SectionTitle>Projects</SectionTitle>
        {data.projects.map((p) => (
          <View key={p.id} style={{ marginBottom: 5 }}>
            <Text style={s.projectTitle}>{p.name}</Text>
            {p.description && <Text style={{ ...s.bullet, marginTop: 3 }}>{p.description}</Text>}
            {p.technologies?.length > 0 && (
              <View style={s.tagRow}>
                {p.technologies.map((t) => <Text key={t} style={s.tag}>{t}</Text>)}
              </View>
            )}
          </View>
        ))}
      </View>
    )
  }

  function Skills({ override }) {
    const groups = [
      { label: 'Technical', items: data.skills?.technical },
      { label: 'Strengths', items: data.skills?.soft },
      { label: 'Languages', items: data.skills?.languages },
    ].filter((g) => g.items?.length > 0)
    if (groups.length === 0) return null
    const cc = override || c
    return (
      <View>
        <SectionTitle override={override}>Skills</SectionTitle>
        {groups.map((g) => (
          <View key={g.label} style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 9, fontFamily: boldFont, color: cc.muted, textTransform: 'uppercase', marginBottom: 3 }}>{g.label}</Text>
            <View style={s.tagRow}>
              {g.items.map((item) => (
                <Text key={item} style={{ ...s.tag, color: cc.accent, border: `1.3 solid ${cc.accent}` }}>{item}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    )
  }

  // Bar-meter skills variant — same "no fake precision" reasoning as the
  // web version: derives a stable, varied fill length from the skill's
  // text rather than inventing a false proficiency number.
  function SkillsBarsVariant({ override }) {
    const groups = [
      { label: 'Technical', items: data.skills?.technical },
      { label: 'Strengths', items: data.skills?.soft },
      { label: 'Languages', items: data.skills?.languages },
    ].filter((g) => g.items?.length > 0)
    if (groups.length === 0) return null
    const cc = override || c
    return (
      <View>
        <SectionTitle override={override}>Skills</SectionTitle>
        {groups.map((g) => (
          <View key={g.label} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, fontFamily: boldFont, color: cc.muted, textTransform: 'uppercase', marginBottom: 4 }}>{g.label}</Text>
            {g.items.map((skill, i) => {
              const fill = 68 + ((skill.length * 7 + i * 11) % 28)
              return (
                <View key={skill} style={{ marginBottom: 5 }}>
                  <Text style={{ fontSize: 10, color: cc.text, marginBottom: 2 }}>{skill}</Text>
                  <View style={{ height: 3.5, borderRadius: 2, backgroundColor: cc.accentSoft }}>
                    <View style={{ height: '100%', width: `${fill}%`, borderRadius: 2, backgroundColor: cc.accent }} />
                  </View>
                </View>
              )
            })}
          </View>
        ))}
      </View>
    )
  }

  // Timeline experience variant — vertical connecting line + dot markers,
  // built with a left border (the line) and small circular Views (dots)
  // rather than Svg, since this repeats per-entry and Views are simpler.
  function ExperienceTimelineVariant() {
    if (!data.experience?.length) return null
    return (
      <View>
        <SectionTitle>Experience</SectionTitle>
        {data.experience.map((e, idx) => (
          <View
            key={e.id}
            style={{
              marginBottom: 10,
              paddingLeft: 12,
              borderLeft: idx < data.experience.length - 1 ? `1.5 solid ${c.border}` : '1.5 solid transparent',
            }}
          >
            <View style={{ marginLeft: -15.5, marginBottom: 2, flexDirection: 'row' }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: c.bg, border: `1.5 solid ${c.accent}` }} />
            </View>
            <View style={{ ...s.jobRow, marginTop: -9 }}>
              <Text style={s.jobTitle}>{e.title}{e.company ? `, ${e.company}` : ''}</Text>
              <Text style={s.jobMeta}>{e.startDate}{e.startDate ? ' — ' : ''}{e.current ? 'Present' : e.endDate}</Text>
            </View>
            {(e.bullets || []).map((b, i) => b?.trim() && <Text key={i} style={s.bullet}>— {b}</Text>)}
          </View>
        ))}
      </View>
    )
  }

  // Select which variant renders, based on the theme — same pattern as
  // the web engine, so both stay in sync.
  const SkillsComponent = theme.skillsVariant === 'bars' ? SkillsBarsVariant : Skills
  const ExperienceComponent = theme.experienceVariant === 'timeline' ? ExperienceTimelineVariant : Experience

  function Certificates({ override }) {
    if (!data.certificates?.length) return null
    const cc = override || c
    return (
      <View>
        <SectionTitle override={override}>Certificates</SectionTitle>
        {data.certificates.map((cert) => (
          <View key={cert.id} style={s.jobRow}>
            <Text style={{ fontSize: 8.5, color: cc.text }}>{cert.name}{cert.org ? ` — ${cert.org}` : ''}</Text>
            <Text style={{ ...s.jobMeta, color: cc.muted }}>{cert.date}</Text>
          </View>
        ))}
      </View>
    )
  }

  function Extras() {
    const { awards = [], publications = [], volunteer = [], custom = [] } = data.extras || {}
    const hasAny = awards.length || publications.length || volunteer.length || custom.length
    if (!hasAny) return null
    return (
      <View>
        {awards.length > 0 && (
          <View>
            <SectionTitle>Awards</SectionTitle>
            {awards.map((a) => (
              <View key={a.id} style={s.jobRow}>
                <Text style={{ fontSize: 8.5 }}>{a.title}{a.org ? ` — ${a.org}` : ''}</Text>
                <Text style={s.jobMeta}>{a.date}</Text>
              </View>
            ))}
          </View>
        )}
        {publications.length > 0 && (
          <View>
            <SectionTitle>Publications</SectionTitle>
            {publications.map((p) => (
              <View key={p.id} style={s.jobRow}>
                <Text style={{ fontSize: 8.5 }}>{p.title}{p.publisher ? ` — ${p.publisher}` : ''}</Text>
                <Text style={s.jobMeta}>{p.date}</Text>
              </View>
            ))}
          </View>
        )}
        {volunteer.length > 0 && (
          <View>
            <SectionTitle>Volunteer Work</SectionTitle>
            {volunteer.map((v) => (
              <View key={v.id} style={{ marginBottom: 4 }}>
                <View style={s.jobRow}>
                  <Text style={s.jobTitle}>{v.role}{v.org ? `, ${v.org}` : ''}</Text>
                  <Text style={s.jobMeta}>{v.date}</Text>
                </View>
                {v.description && <Text style={s.bullet}>{v.description}</Text>}
              </View>
            ))}
          </View>
        )}
        {custom.map((section) => (
          <View key={section.id}>
            <SectionTitle>{section.sectionTitle || 'Additional'}</SectionTitle>
            {(section.items || []).map((item) => item.text?.trim() && <Text key={item.id} style={s.bullet}>— {item.text}</Text>)}
          </View>
        ))}
      </View>
    )
  }

  const bodySections = (
    <>
      <Summary />
      <ExperienceComponent />
      <Education />
      <Projects />
      <SkillsComponent />
      <Certificates />
      <Extras />
    </>
  )

  if (theme.layout === 'sidebar-left') {
    // Same reasoning as the web engine: the sidebar sits on `surface`, not
    // `bg`, so anything rendered inside it needs onSurface-safe colors —
    // including accent (section titles, tags), which earlier only had
    // text/muted swapped, not accent. This override object is passed
    // explicitly to the components rendered inside the sidebar only;
    // components in the main column keep using the normal theme colors.
    const sidebarOverride = theme.colors.onSurface
      ? {
          text: theme.colors.onSurface,
          muted: theme.colors.onSurfaceMuted || theme.colors.onSurface,
          accent: theme.colors.onSurfaceAccent || c.accent,
          accentSoft: c.accentSoft,
          border: theme.colors.onSurfaceBorder || 'rgba(255,255,255,0.25)',
        }
      : null

    return (
      <Document>
        <Page size="LETTER" style={s.pageNoPad}>
          <View style={{ ...s.row, minHeight: '100%' }}>
            <View style={s.sidebarCol}>
              <Header compact />
              <Divider override={sidebarOverride} />
              <View style={{ marginTop: 4 }}>
                <SkillsComponent override={sidebarOverride} />
                <Certificates override={sidebarOverride} />
              </View>
            </View>
            <View style={s.mainCol}>
              <Summary />
              <ExperienceComponent />
              <Education />
              <Projects />
              <Extras />
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  if (theme.layout === 'band') {
    return (
      <Document>
        <Page size="LETTER" style={s.pageNoPad}>
          <View style={s.bandHeader}>
            <Header />
          </View>
          <View style={s.bodyPad}>{bodySections}</View>
        </Page>
      </Document>
    )
  }

  // 'single' layout (default)
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <Header />
        <Divider />
        {bodySections}
      </Page>
    </Document>
  )
}

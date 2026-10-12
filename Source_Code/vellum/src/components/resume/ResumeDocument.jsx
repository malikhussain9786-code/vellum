import Header from './Header.jsx'
import DecorativeDivider from './DecorativeDivider.jsx'
import Summary from './Summary.jsx'
import ExperienceSection from './ExperienceSection.jsx'
import ExperienceTimeline from './ExperienceTimeline.jsx'
import EducationSection from './EducationSection.jsx'
import ProjectsSection from './ProjectsSection.jsx'
import SkillsSection from './SkillsSection.jsx'
import SkillsBars from './SkillsBars.jsx'
import CertificatesSection from './CertificatesSection.jsx'
import ExtrasSection from './ExtrasSection.jsx'

// The engine: one component, driven entirely by `theme`. Every template is
// this same component with a different theme object passed in — never a
// separate implementation. Real visual variety (Step 4 onward) comes from
// theme.layout (structural shape) plus theme.skillsVariant /
// theme.experienceVariant (section-level rendering styles) — a
// configuration space wide enough to cover genuinely different template
// designs without hand-building 20 separate component trees, which would
// be far harder to keep consistent and bug-free.
export default function ResumeDocument({ data, theme }) {
  const SkillsComponent = theme.skillsVariant === 'bars' ? SkillsBars : SkillsSection
  const ExperienceComponent = theme.experienceVariant === 'timeline' ? ExperienceTimeline : ExperienceSection

  const mainSections = (
    <>
      <Summary theme={theme} text={data.summary} />
      <ExperienceComponent theme={theme} items={data.experience} />
      <ProjectsSection theme={theme} items={data.projects} />
      <EducationSection theme={theme} items={data.education} />
    </>
  )

  const sideSections = (t = theme) => (
    <>
      <SkillsComponent theme={t} skills={data.skills} />
      <CertificatesSection theme={t} items={data.certificates} />
      <ExtrasSection theme={t} extras={data.extras} />
    </>
  )


  const pageStyle = {
    background: theme.colors.bg,
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
    width: '100%',
    maxWidth: '680px',
    margin: '0 auto',
    padding: '36px 34px',
    boxSizing: 'border-box',
  }

  if (theme.layout === 'sidebar-left') {
    // The sidebar needs its own solid color block (not just a divider
    // line) to actually read as a distinct panel, matching real premium
    // resume designs. Since that panel sits on `surface` rather than
    // `bg`, it needs the same onSurface-text safety as the band layout —
    // otherwise a colored sidebar with the page's normal text color could
    // render illegibly depending on how dark/light that color is.
    const sidebarTheme = theme.colors.onSurface
      ? {
          ...theme,
          colors: {
            ...theme.colors,
            text: theme.colors.onSurface,
            muted: theme.colors.onSurfaceMuted || theme.colors.onSurface,
            accent: theme.colors.onSurfaceAccent || theme.colors.accent,
            border: theme.colors.onSurfaceBorder || 'rgba(255,255,255,0.25)',
          },
        }
      : theme

    return (
      <div style={{ ...pageStyle, padding: 0 }} data-resume-document>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div
            style={{
              width: '36%',
              flexShrink: 0,
              background: theme.colors.surface,
              padding: '36px 24px',
            }}
          >
            <Header theme={sidebarTheme} personal={data.personal} compact />
            <DecorativeDivider theme={sidebarTheme} />
            <div style={{ marginTop: '4px' }}>{sideSections(sidebarTheme)}</div>
          </div>
          <div style={{ minWidth: 0, flex: 1, padding: '36px 30px' }}>{mainSections}</div>
        </div>
      </div>
    )
  }

  if (theme.layout === 'band') {
    // If the surface is a different lightness than the base background,
    // the header must use onSurface colors instead of the page's text
    // colors — otherwise a dark band renders dark text on dark (illegible).
    const headerTheme = theme.colors.onSurface
      ? {
          ...theme,
          colors: {
            ...theme.colors,
            text: theme.colors.onSurface,
            muted: theme.colors.onSurfaceMuted || theme.colors.onSurface,
            accent: theme.colors.onSurfaceAccent || theme.colors.accent,
          },
        }
      : theme

    return (
      <div style={{ ...pageStyle, padding: 0 }} data-resume-document>
        <div style={{ background: theme.colors.surface, padding: '30px 34px' }}>
          <Header theme={headerTheme} personal={data.personal} />
        </div>
        <div style={{ padding: '24px 34px' }}>
          {mainSections}
          {sideSections()}
        </div>
      </div>
    )
  }

  // default: 'single'
  return (
    <div style={pageStyle} data-resume-document>
      <Header theme={theme} personal={data.personal} />
      <DecorativeDivider theme={theme} />
      {mainSections}
      {sideSections()}
    </div>
  )
}

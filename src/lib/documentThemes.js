// A "theme" is pure presentation config — colors, type, layout shape.
// It never contains content. The rendering engine (ResumeDocument.jsx)
// reads a theme + resume data and produces a specific template's look.
// This is what makes 20 templates a configuration problem, not 20
// separate rebuilds — and it's why every template below shares the same
// three tested layout engines instead of hand-built one-off markup.
//
// layout options:
//   'single'        — one column, header on top
//   'sidebar-left'  — narrow sidebar (contact/skills) + main content
//   'band'          — full-width color band header, single column below
//
// colors.onSurface / onSurfaceMuted (optional): required whenever a theme's
// `surface` sits at a different lightness than its `bg` (e.g. a dark header
// band on a light page) — prevents dark-on-dark / light-on-light text.
//
// skillsVariant (optional): 'tags' (default) | 'bars' — swaps the skills
// section between pill tags and progress-meter bars.
// experienceVariant (optional): 'list' (default) | 'timeline' — swaps
// experience between a plain stacked list and a connected vertical
// timeline with dot markers. Both variants are implemented once in the
// engine (web + PDF) and selected per-theme — this is the actual
// foundation that lets 20 templates look genuinely different from each
// other without 20 separate hand-built implementations.
//
// Every color pairing below (text/bg, text/surface, accent/bg, onSurface/
// surface) was verified against WCAG contrast minimums with a real
// calculator, not eyeballed — accent colors are held to the same 4.5:1
// standard as body text since they're used for small section labels, not
// just decoration.
//
// IDs are permanent — a saved resume stores its chosen template's id, so
// changing an id here would silently break existing users' saved resumes.
// Colors, names, and tags can change freely; ids never should.

const FONT_SETS = {
  classic: { display: "'Fraunces', serif", body: "'Inter', sans-serif", mono: "'IBM Plex Mono', monospace" },
  editorial: { display: "'Playfair Display', serif", body: "'Inter', sans-serif", mono: "'IBM Plex Mono', monospace" },
  geometric: { display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif", mono: "'IBM Plex Mono', monospace" },
  plain: { display: "'Inter', sans-serif", body: "'Inter', sans-serif", mono: "'IBM Plex Mono', monospace" },
}

export function defineTheme(theme) {
  const required = ['id', 'name', 'category', 'tag', 'layout', 'colors', 'fonts']
  for (const key of required) {
    if (!(key in theme)) {
      throw new Error(`Theme "${theme.id || '(unknown)'}" is missing required field: ${key}`)
    }
  }
  return theme
}

export const templates = [
  // ---------------- EXECUTIVE (3) ----------------
  // ---------------- 1. EXECUTIVE NOIR ----------------
  // CEO / Senior Executive — bold name, thin gold divider lines, elegant
  // two-column layout, uppercase serif headings.
  defineTheme({
    id: 'executive-noir', name: 'Executive Noir', category: 'Executive', tag: 'Serif · Charcoal & Gold',
    layout: 'sidebar-left', fonts: FONT_SETS.classic,
    colors: { bg: '#ffffff', surface: '#111111', text: '#111111', muted: '#5a5a5a', accent: '#8f6f19', accentSoft: '#f2ead2', border: '#d9c98a', onSurface: '#f5f0e0', onSurfaceMuted: '#c9bfa0', onSurfaceAccent: '#d9b569' },
  }),

  // ---------------- 2. SWISS MINIMAL PRO ----------------
  // European premium minimal — massive whitespace, perfect grid, very
  // ATS-friendly (no photo, no decoration beyond a clean red accent).
  defineTheme({
    id: 'swiss-minimal', name: 'Swiss Minimal Pro', category: 'Minimal', tag: 'Sans · Black & Red',
    layout: 'single', fonts: FONT_SETS.plain, showPhoto: false,
    colors: { bg: '#ffffff', surface: '#ffffff', text: '#111111', muted: '#555555', accent: '#d62828', accentSoft: '#fbdede', border: '#e0e0e0' },
  }),

  // ---------------- 3. AI ENGINEER ELITE ----------------
  // AI/ML Engineer — futuristic deep navy, electric blue accent, mono
  // technology accents (SectionTitle and tags already use mono font).
  defineTheme({
    id: 'ai-engineer-elite', name: 'AI Engineer Elite', category: 'Technology', tag: 'Mono · Navy & Electric Blue',
    layout: 'single', fonts: FONT_SETS.geometric, skillsVariant: 'bars',
    colors: { bg: '#071a2b', surface: '#0d2740', text: '#ffffff', muted: '#9fb8cc', accent: '#00bfff', accentSoft: '#0d3a52', border: '#1c3d54', onSurface: '#ffffff', onSurfaceMuted: '#9fb8cc' },
  }),

  // ---------------- 4. SILICON VALLEY DEVELOPER ----------------
  // Software Engineer — GitHub-inspired clean white, tech-stack skills,
  // project highlights front and center.
  defineTheme({
    id: 'silicon-valley-dev', name: 'Silicon Valley Developer', category: 'Technology', tag: 'Mono · Code Green',
    layout: 'single', fonts: FONT_SETS.geometric, experienceVariant: 'timeline',
    colors: { bg: '#ffffff', surface: '#f4f6f5', text: '#333333', muted: '#666666', accent: '#00754a', accentSoft: '#d9f0e6', border: '#e2e5e4' },
  }),

  // ---------------- 5. LUXURY BLACK TITANIUM ----------------
  // Premium dark resume — true black, high contrast white, thin metallic
  // silver borders.
  defineTheme({
    id: 'luxury-titanium', name: 'Luxury Black Titanium', category: 'Executive', tag: 'Serif · Black & Silver',
    layout: 'single', fonts: FONT_SETS.editorial, experienceVariant: 'timeline',
    colors: { bg: '#050505', surface: '#111111', text: '#ffffff', muted: '#b8b8b8', accent: '#c0c0c0', accentSoft: '#2a2a2a', border: '#3a3a3a', onSurface: '#ffffff', onSurfaceMuted: '#b8b8b8' },
  }),

  // ---------------- 6. ROYAL SAPPHIRE ----------------
  // Corporate professional — banking/consulting style, structured
  // sections, a real connected timeline for the career history.
  defineTheme({
    id: 'royal-sapphire', name: 'Royal Sapphire', category: 'Corporate', tag: 'Sans · Timeline',
    layout: 'single', fonts: FONT_SETS.plain, experienceVariant: 'timeline',
    colors: { bg: '#ffffff', surface: '#eef4ff', text: '#001f3f', muted: '#4a5b70', accent: '#0066ff', accentSoft: '#dde9ff', border: '#c9dcff' },
  }),

  // ---------------- 7. CREATIVE STUDIO ----------------
  // Designer / Creative — cream canvas, bold black sidebar, artistic
  // orange accent, portfolio (Projects) highlighted.
  defineTheme({
    id: 'creative-studio', name: 'Creative Studio', category: 'Creative', tag: 'Two-column · Cream & Orange',
    layout: 'sidebar-left', fonts: FONT_SETS.geometric,
    colors: { bg: '#fff8ee', surface: '#111111', text: '#111111', muted: '#6b6b6b', accent: '#b5431a', accentSoft: '#fbe4d8', border: '#e8d9c4', onSurface: '#fff8ee', onSurfaceMuted: '#c9b8a0', onSurfaceAccent: '#e87d4a' },
  }),
  // ---------------- 8. PLATINUM CONSULTANT ----------------
  // Consulting firms — McKinsey-style simplicity, data-driven formatting
  // (skill bars), strong achievements.
  defineTheme({
    id: 'platinum-consultant', name: 'Platinum Consultant', category: 'Corporate', tag: 'Sans · Platinum',
    layout: 'single', fonts: FONT_SETS.plain, skillsVariant: 'bars',
    colors: { bg: '#ffffff', surface: '#f5f5f5', text: '#2b2b2b', muted: '#6b6b6b', accent: '#6b6b6b', accentSoft: '#ececec', border: '#e2e2e2' },
  }),

  // ---------------- 9. FUTURE VISION AI ----------------
  // AI startup professional — dark blue band, purple accent, skill bars
  // as the "AI skills visualization".
  defineTheme({
    id: 'future-vision-ai', name: 'Future Vision AI', category: 'Technology', tag: 'Header Band · Purple',
    layout: 'band', fonts: FONT_SETS.geometric, skillsVariant: 'bars',
    colors: { bg: '#0a1128', surface: '#14174a', text: '#e8eaf6', muted: '#a8adc9', accent: '#a366e8', accentSoft: '#241f4d', border: '#2a2860', onSurface: '#ffffff', onSurfaceMuted: '#b8bcd9', onSurfaceAccent: '#b07ded' },
  }),

  // ---------------- 10. ACADEMIC SCHOLAR ----------------
  // Research / PhD — formal, publications section (Extras), research
  // timeline for career/education history.
  defineTheme({
    id: 'academic-scholar', name: 'Academic Scholar', category: 'Academic', tag: 'Serif · Burgundy',
    layout: 'single', fonts: FONT_SETS.classic, experienceVariant: 'timeline',
    colors: { bg: '#ffffff', surface: '#f7eef0', text: '#111111', muted: '#5c5c5c', accent: '#800020', accentSoft: '#f2dde2', border: '#e8d2d7' },
  }),

  // ---------------- 11. GLOBAL TRAVELER ----------------
  // International CV — elegant global style, dark brown sidebar,
  // languages naturally prominent (Skills already groups Languages).
  defineTheme({
    id: 'global-traveler', name: 'Global Traveler', category: 'Executive', tag: 'Two-column · Ivory & Brown',
    layout: 'sidebar-left', fonts: FONT_SETS.classic,
    colors: { bg: '#fffff0', surface: '#3b2a1a', text: '#3b2a1a', muted: '#6b5d4d', accent: '#00754a', accentSoft: '#d9f0e6', border: '#e6ddc8', onSurface: '#fffff0', onSurfaceMuted: '#c9b8a0', onSurfaceAccent: '#00b56a' },
  }),

  // ---------------- 12. PRODUCT LEADER ----------------
  // Product Manager — roadmap timeline, metrics-focused skill bars,
  // leadership emphasis.
  defineTheme({
    id: 'product-leader', name: 'Product Leader', category: 'Corporate', tag: 'Sans · Roadmap Timeline',
    layout: 'single', fonts: FONT_SETS.plain, experienceVariant: 'timeline', skillsVariant: 'bars',
    colors: { bg: '#ffffff', surface: '#eaf4f4', text: '#002347', muted: '#4d6373', accent: '#008080', accentSoft: '#d9ecec', border: '#c9e2e2' },
  }),

  // ---------------- 13. STARTUP FOUNDER ----------------
  // Entrepreneur — premium magazine feel via editorial serif, vision
  // statement (Summary) and achievements emphasized.
  defineTheme({
    id: 'startup-founder', name: 'Startup Founder', category: 'Executive', tag: 'Serif · Magazine Gold',
    layout: 'single', fonts: FONT_SETS.editorial, experienceVariant: 'timeline',
    colors: { bg: '#faf9f6', surface: '#f2ecdd', text: '#111111', muted: '#5c5c5c', accent: '#8f6608', accentSoft: '#f2e6c8', border: '#e6dcc0' },
  }),

  // ---------------- 14. METRO MODERN ----------------
  // Young professional — modern deep-blue band, balanced clean layout.
  defineTheme({
    id: 'metro-modern', name: 'Metro Modern', category: 'Modern', tag: 'Header Band · Modern Blue',
    layout: 'band', fonts: FONT_SETS.geometric,
    colors: { bg: '#ffffff', surface: '#1a3a6b', text: '#2b2b2b', muted: '#666666', accent: '#2d6cdf', accentSoft: '#e2ecfc', border: '#d6e2f5', onSurface: '#ffffff', onSurfaceMuted: '#c3d3ec', onSurfaceAccent: '#8fb8f7' },
  }),

  // ---------------- 15. GLASSMORPHISM PRO ----------------
  // Modern technology — dark navy, cyan accent, premium tech feeling.
  // Honest note: literal glass-blur (backdrop-filter) isn't used here —
  // it doesn't render reliably in PDF export, which was a deliberate
  // reliability choice made earlier in this project. The premium "glass
  // tech" feel comes through color depth and restraint instead.
  defineTheme({
    id: 'glassmorphism-pro', name: 'Glassmorphism Pro', category: 'Technology', tag: 'Header Band · Cyan',
    layout: 'band', fonts: FONT_SETS.geometric, skillsVariant: 'bars',
    colors: { bg: '#0a1a2e', surface: '#122844', text: '#e8f2f6', muted: '#9fb8c9', accent: '#00d4ff', accentSoft: '#153347', border: '#1e3a52', onSurface: '#ffffff', onSurfaceMuted: '#a8c5d6' },
  }),

  // ---------------- 16. EUROPEAN CLASSIC ----------------
  // Traditional European CV — formal, elegant serif, dark green accent,
  // strong readability.
  defineTheme({
    id: 'european-classic', name: 'European Classic', category: 'Academic', tag: 'Serif · Dark Green',
    layout: 'single', fonts: FONT_SETS.classic,
    colors: { bg: '#ffffff', surface: '#eef5f0', text: '#111111', muted: '#555555', accent: '#0f5c2e', accentSoft: '#dbeee1', border: '#cde5d5' },
  }),

  // ---------------- 17. ONE PAGE MASTER ----------------
  // High-impact single page — optimized for recruiter scanning, no
  // wasted space, clean blue accent.
  defineTheme({
    id: 'one-page-master', name: 'One Page Master', category: 'Minimal', tag: 'Sans · Scan-Friendly Blue',
    layout: 'single', fonts: FONT_SETS.plain,
    colors: { bg: '#ffffff', surface: '#eef4fc', text: '#111111', muted: '#555555', accent: '#0055cc', accentSoft: '#dde9fb', border: '#cfe0f7' },
  }),

  // ---------------- 18. MAGAZINE LUXURY ----------------
  // Designer resume — editorial layout, large serif typography, beige +
  // gold, premium publication feeling.
  defineTheme({
    id: 'magazine-luxury', name: 'Magazine Luxury', category: 'Creative', tag: 'Two-column · Editorial Gold',
    layout: 'sidebar-left', fonts: FONT_SETS.editorial,
    colors: { bg: '#f5efe0', surface: '#1a1a1a', text: '#111111', muted: '#5c5347', accent: '#7d5a06', accentSoft: '#ecdfb8', border: '#e2d3a8', onSurface: '#f5efe0', onSurfaceMuted: '#c9bfa0', onSurfaceAccent: '#d9b569' },
  }),

  // ---------------- 19. CYBER TECH ----------------
  // Cybersecurity / Developer — black, neon green, terminal-inspired
  // (mono font already used for section titles and tags throughout).
  defineTheme({
    id: 'cyber-tech', name: 'Cyber Tech', category: 'Technology', tag: 'Mono · Neon Terminal',
    layout: 'band', fonts: FONT_SETS.geometric,
    colors: { bg: '#0a0a0a', surface: '#121212', text: '#e8ffe8', muted: '#8fae8f', accent: '#39ff14', accentSoft: '#132913', border: '#1f3a1f', onSurface: '#ffffff', onSurfaceMuted: '#9fcf9f' },
  }),

  // ---------------- 20. INFINITY PREMIUM ----------------
  // Flagship — combines the best of the set: header band (white + dark
  // section), a real timeline, metrics-style skill bars, premium serif
  // typography, and gold accent.
  defineTheme({
    id: 'infinity-premium', name: 'Infinity Premium', category: 'Executive', tag: 'Header Band · Gold Flagship',
    layout: 'band', fonts: FONT_SETS.classic, experienceVariant: 'timeline', skillsVariant: 'bars',
    colors: { bg: '#ffffff', surface: '#111111', text: '#111111', muted: '#5c5c5c', accent: '#8f6608', accentSoft: '#f2e6c8', border: '#e6dcc0', onSurface: '#f5f0e0', onSurfaceMuted: '#c9bfa0', onSurfaceAccent: '#d9b569' },
  }),
]

// Kept for backward compatibility with anything referencing the original
// single reference theme directly (e.g. quick internal checks).
export const executiveTheme = templates[0]

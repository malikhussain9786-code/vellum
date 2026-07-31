const FEATURES = [
  {
    title: 'Written stronger',
    desc: 'AI turns plain sentences into measurable, achievement-led lines — without sounding like AI wrote them.',
  },
  {
    title: 'Reviewed for ATS',
    desc: 'A clear pass on formatting and keyword coverage before you send it, so it actually gets read.',
  },
  {
    title: 'Formatted precisely',
    desc: 'Twenty templates, each with real typographic care — not a form with a font swapped.',
  },
]

export default function AiFeatures() {
  return (
    <section id="ai-tools" className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
      <span className="block text-[11px] tracking-[0.15em] uppercase text-brass font-medium">
        AI Tools
      </span>
      <h2 className="font-display text-[26px] sm:text-[32px] text-ink-text mt-3 max-w-lg leading-tight">
        Built to make your case, not just format it.
      </h2>

      <div className="grid sm:grid-cols-3 gap-5 mt-10">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="glass rounded-[10px] p-6">
            <div className="font-mono text-[10.5px] text-brass">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="font-display text-[17px] text-ink-text mt-3">{f.title}</h3>
            <p className="text-[12.5px] text-muted mt-2 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

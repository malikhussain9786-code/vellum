import { Link } from 'react-router-dom'
import { sampleResumes } from '../lib/sampleResumes.js'
import Eyebrow from './ui/Eyebrow.jsx'
import Button from './ui/Button.jsx'

export default function TemplateTeaser() {
  const [exec, tech, editorial] = sampleResumes

  return (
    <section className="bg-bone text-graphite py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <span className="block text-[11px] tracking-[0.15em] uppercase text-brass-deep font-medium">
              20 Templates
            </span>
            <h2 className="font-display text-[26px] sm:text-[34px] font-normal text-ink mt-3 max-w-lg leading-tight">
              Every template, fully shown — before you pick one.
            </h2>
          </div>
          <p className="text-[13px] text-graphite/70 max-w-[240px] leading-relaxed">
            Real layout, real hierarchy, real content — never a blank placeholder.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <ExecutiveCard data={exec} />
          <TechCard data={tech} />
          <EditorialCard data={editorial} />
        </div>

        <div className="mt-10 flex justify-center">
          <Button as={Link} to="/templates" variant="dark" size="md">
            See all 20 templates →
          </Button>
        </div>
      </div>
    </section>
  )
}

function CardShell({ children, name, tag }) {
  return (
    <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="p-5 h-[300px] overflow-hidden relative">{children}</div>
      <div className="px-5 py-3.5 flex items-center justify-between border-t border-black/5">
        <span className="text-[12.5px] font-semibold text-ink">{name}</span>
        <span className="text-[9px] font-mono text-graphite/50">{tag}</span>
      </div>
    </div>
  )
}

function ExecutiveCard({ data }) {
  return (
    <CardShell name="Executive" tag="Serif · Formal">
      <div className="bg-gradient-to-br from-paper to-bone-soft h-full -m-5 p-5 text-[#22201b] relative">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-40" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(138,106,46,0.3) 0px, rgba(138,106,46,0.3) 1px, transparent 1px, transparent 8px)'
        }} />
        <div className="font-display font-bold text-[16px] relative">{data.name}</div>
        <div className="text-[9.5px] uppercase tracking-wide text-brass-deep mt-0.5">{data.role}</div>
        <div className="text-[8.5px] uppercase tracking-wider text-brass-deep mt-3 mb-1.5 border-b border-brass-deep/25 pb-1">
          Experience
        </div>
        {data.experience.map((e) => (
          <div key={e.title} className="mb-2">
            <div className="flex justify-between text-[10.5px] font-semibold">
              <span>{e.title}, {e.company}</span>
              <span className="font-normal text-graphite/50 text-[9px]">{e.period}</span>
            </div>
            {e.bullets.map((b) => (
              <div key={b} className="text-[9px] text-graphite/80 mt-0.5 leading-snug">{b}</div>
            ))}
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function TechCard({ data }) {
  return (
    <CardShell name="Technology" tag="Mono · Dark">
      <div className="bg-gradient-to-br from-panel-soft to-ink h-full -m-5 p-5 text-ink-text relative">
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-teal via-violet to-rose" />
        <div className="font-display text-[16px]">{data.name}</div>
        <div className="font-mono text-[9.5px] text-teal mt-0.5">{data.role}</div>
        <div className="font-mono text-[8.5px] uppercase tracking-wider text-teal mt-3 mb-1.5">
          Experience
        </div>
        {data.experience.map((e) => (
          <div key={e.title} className="mb-2">
            <div className="text-[10.5px] font-semibold">{e.company}</div>
            <div className="font-mono text-[8.5px] text-white/40">{e.period}</div>
            {e.bullets.map((b) => (
              <div key={b} className="text-[9px] text-white/70 mt-0.5 leading-snug">{b}</div>
            ))}
          </div>
        ))}
        <div className="flex flex-wrap gap-1 mt-2">
          {data.skills.slice(0, 3).map((s) => (
            <span key={s} className="font-mono text-[7.5px] text-teal border border-teal/40 rounded-full px-2 py-0.5">
              {s}
            </span>
          ))}
        </div>
      </div>
    </CardShell>
  )
}

function EditorialCard({ data }) {
  return (
    <CardShell name="Editorial" tag="Two-column">
      <div className="bg-gradient-to-br from-bone to-bone-soft h-full -m-5 p-5 flex gap-3 text-[#2a271f]">
        <div className="w-[38%] border-r border-brass-deep/25 pr-2.5 shrink-0">
          <div className="font-display font-bold text-[15px] leading-tight">{data.name}</div>
          <div className="text-[8.5px] uppercase tracking-wide text-brass-deep mt-1">{data.role}</div>
          <div className="text-[8px] uppercase tracking-wider text-brass-deep mt-2.5 mb-1">Skills</div>
          <div className="text-[8.5px] text-graphite/80 leading-relaxed">
            {data.skills.slice(0, 2).join('\n')}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[8px] uppercase tracking-wider text-brass-deep mb-1">Experience</div>
          {data.experience.map((e) => (
            <div key={e.title} className="mb-2">
              <div className="text-[10px] font-semibold">{e.title}, {e.company}</div>
              {e.bullets.map((b) => (
                <div key={b} className="text-[8.5px] text-graphite/80 mt-0.5 leading-snug">{b}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  )
}

import { education } from '../../data/content'
import { Reveal, Section } from './Section'

export function Education() {
  return (
    <Section
      id="education"
      index="07"
      eyebrow="EDUCATION"
      title={
        <>
          Foundations first — <span className="text-gradient">then everything self-taught.</span>
        </>
      }
    >
      <div className="relative ml-2 max-w-3xl">
        {/* timeline spine */}
        <span
          className="absolute bottom-4 left-0 top-2 w-px"
          style={{ background: 'linear-gradient(180deg, rgba(34,211,238,0.6), rgba(139,92,246,0.35), transparent)' }}
          aria-hidden
        />
        <ol className="space-y-8">
          {education.map((ed, i) => (
            <li key={ed.degree} className="relative pl-8">
              <Reveal delay={0.06 * i}>
                <span className="absolute -left-[7px] top-1.5 grid h-3.5 w-3.5 place-items-center">
                  <span
                    className={`h-3.5 w-3.5 rounded-full border-2 ${ed.current ? 'animate-pulse-dot bg-cyanx' : 'bg-slate-600'}`}
                    style={ed.current ? { boxShadow: '0 0 14px rgba(34,211,238,0.8)' } : undefined}
                  />
                </span>
                <div className={`glass card-hover rounded-2xl p-5 ${ed.current ? 'border-cyanx/25' : ''}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-[15.5px] font-bold tracking-tight text-frost">{ed.degree}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
                        ed.current ? 'border border-cyanx/30 bg-cyanx/10 text-cyanx' : 'border border-white/10 bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      {ed.period}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-mist">{ed.institution}</p>
                  <p className="mt-0.5 text-[12px] text-slate-500">{ed.place}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}

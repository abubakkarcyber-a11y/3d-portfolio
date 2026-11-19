import { Award, ExternalLink } from 'lucide-react'
import { certifications } from '../../data/content'
import { Reveal, Section } from './Section'

export function Certifications() {
  return (
    <Section
      id="certifications"
      index="06"
      eyebrow="CERTIFICATIONS"
      title={
        <>
          Verified credentials, <span className="text-gradient">earned step by step.</span>
        </>
      }
      lead="Only genuine certificates with official verification links are shown — nothing fabricated."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => (
          <Reveal key={cert.title} delay={0.05 * (i % 3)}>
            <article
              className={`card-hover flex h-full flex-col rounded-2xl p-5 ${
                cert.inProgress ? 'border border-dashed border-violetx/40 bg-violetx/[0.05]' : 'glass'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl border ${
                    cert.inProgress
                      ? 'border-violetx/40 bg-violetx/10 text-violetx'
                      : 'border-cyanx/25 bg-gradient-to-br from-cyanx/12 to-violetx/12 text-cyanx'
                  }`}
                >
                  <Award size={18} />
                </span>
                {cert.badge && (
                  <span className="rounded-full border border-cyanx/30 bg-cyanx/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyanx">
                    {cert.badge}
                  </span>
                )}
                {cert.inProgress && (
                  <span className="flex items-center gap-1.5 rounded-full border border-dashed border-violetx/40 bg-violetx/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violetx">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-violetx" /> in progress
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-display text-[14.5px] font-semibold leading-snug text-frost">{cert.title}</h3>
              <p className="mt-1.5 text-[12.5px] text-slate-400">{cert.provider}</p>
              {cert.detail && <p className="mt-1 font-mono text-[11px] text-slate-500">{cert.detail}</p>}

              <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                <span className="font-mono text-[11.5px] text-slate-500">{cert.date}</span>
                {cert.verify && (
                  <a
                    href={cert.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] font-medium text-slate-300 transition-colors hover:border-cyanx/40 hover:text-cyanx"
                  >
                    Verify <ExternalLink size={11.5} />
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

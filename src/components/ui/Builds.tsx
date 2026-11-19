import { School, ShoppingCart, CircleCheck, ArrowUp } from 'lucide-react'
import { builds } from '../../data/content'
import { Reveal, Section } from './Section'

export function Builds() {
  return (
    <Section
      id="projects"
      index="04"
      eyebrow="FEATURED BUILDS"
      title={
        <>
          Real software, built with an <span className="text-gradient">AI-assisted workflow.</span>
        </>
      }
      lead="Two flagship development projects — designed, built and iterated end-to-end. See them introduced live by the 3D presenter on the stage above."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {builds.map((b, i) => {
          const Icon = b.icon === 'school' ? School : ShoppingCart
          return (
            <Reveal key={b.id} delay={0.08 * i}>
              <article className="glass-strong card-hover flex h-full flex-col rounded-3xl p-6 md:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyanx/25 bg-gradient-to-br from-cyanx/12 to-violetx/12 text-cyanx">
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-[17px] font-bold tracking-tight text-frost md:text-lg">{b.title}</h3>
                      <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10.5px] tracking-wider text-slate-400">
                        {b.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-mist">{b.description}</p>

                <ul className="mt-5 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
                  {b.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-slate-300">
                      <CircleCheck size={14.5} className="mt-0.5 shrink-0 text-cyanx/80" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/5 pt-4">
                  {b.stack.map((s) => (
                    <span key={s} className="chip !text-[11.5px] font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center">
          <p className="text-[13.5px] leading-relaxed text-mist">
            <span className="font-semibold text-frost">Honest scope:</span> these are real development projects with the
            features listed actually implemented — no invented deployment statistics, customers or metrics.
          </p>
          <a href="#home" className="btn-ghost shrink-0 !px-4 !py-2 text-[13px]">
            <ArrowUp size={14} /> Back to the stage
          </a>
        </div>
      </Reveal>
    </Section>
  )
}

import { Code2, Network, Radar, Shield, Sprout, Swords, type LucideIcon } from 'lucide-react'
import { currentlyLearning, skillCategories } from '../../data/content'
import { Reveal, Section } from './Section'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  sword: Swords,
  shield: Shield,
  network: Network,
  radar: Radar,
  code: Code2,
  sprout: Sprout,
}

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      eyebrow="TECHNICAL SKILLS"
      title={
        <>
          A toolkit built for <span className="text-gradient">offense, defense and creation.</span>
        </>
      }
      lead="Organized by domain. Everything below comes from daily, hands-on use in labs and personal projects — no invented proficiency bars."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const Icon = CATEGORY_ICONS[cat.icon] ?? Code2
          return (
            <Reveal key={cat.id} delay={0.06 * (i % 3)}>
              <div className="glass card-hover group h-full rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyanx/25 bg-gradient-to-br from-cyanx/12 to-violetx/12 text-cyanx transition-shadow group-hover:shadow-glow">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-[15.5px] font-semibold tracking-tight text-frost">{cat.title}</h3>
                    <p className="mt-0.5 text-[12px] text-slate-500">{cat.blurb}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <span key={s.name} className={`chip !text-[12.5px] ${s.learning ? 'chip-learning' : ''}`}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-dashed border-violetx/40 bg-violetx/[0.06] p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violetx/40 bg-violetx/10 text-violetx">
              <Sprout size={18} />
            </span>
            <h3 className="font-display text-[15.5px] font-semibold text-frost">
              Currently Learning
              <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-[0.18em] text-violetx">in progress</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:ml-auto">
            {currentlyLearning.map((s) => (
              <span key={s} className="chip chip-learning !text-[12.5px]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

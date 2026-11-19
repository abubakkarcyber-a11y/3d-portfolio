import { CircleCheck, Lock } from 'lucide-react'
import { handsOn } from '../../data/content'
import { Reveal, Section } from './Section'
import { Terminal } from './Terminal'

export function Experience() {
  return (
    <Section
      id="experience"
      index="03"
      eyebrow="HANDS-ON EXPERIENCE"
      title={
        <>
          Three years in the terminal. <span className="text-gradient">Ask it anything.</span>
        </>
      }
      lead="A live, interactive terminal — plus the practical work behind it. All testing happens in authorized environments."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={0.05}>
          <Terminal />
        </Reveal>

        <div className="space-y-4 lg:col-span-5">
          <Reveal delay={0.12}>
            <div className="glass h-full rounded-2xl p-6">
              <h3 className="font-display text-[15.5px] font-semibold text-frost">Field notes</h3>
              <ul className="mt-4 space-y-3">
                {handsOn.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-mist">
                    <CircleCheck size={16} className="mt-0.5 shrink-0 text-cyanx" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rounded-2xl border border-mint/25 bg-mint/[0.05] p-5">
              <div className="flex items-center gap-2.5 text-mint">
                <Lock size={15} />
                <span className="font-display text-[13.5px] font-semibold">Authorized &amp; ethical — always</span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">
                Every scan, injection attempt and enumeration exercise targets lab machines, CTF platforms and
                intentionally vulnerable apps. Skills are built on permission, never on other people's systems.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

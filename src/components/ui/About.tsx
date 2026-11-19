import { BadgeCheck, BrainCircuit, GraduationCap, MapPin, ShieldCheck, Terminal, type LucideIcon } from 'lucide-react'
import { quickFacts } from '../../data/content'
import { Reveal, Section } from './Section'

const FACT_ICONS: Record<string, LucideIcon> = {
  pin: MapPin,
  terminal: Terminal,
  grad: GraduationCap,
  shield: ShieldCheck,
  brain: BrainCircuit,
  badge: BadgeCheck,
}

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="ABOUT ME"
      title={
        <>
          Self-taught, security-obsessed, and building <span className="text-gradient">the future with technology.</span>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal delay={0.08}>
          <div className="space-y-5 text-[15px] leading-relaxed text-mist md:text-base">
            <p>
              I'm a BS Computer Science student with over three years of self-directed, hands-on cybersecurity practice.
              Alongside security research, I build practical AI-powered applications and web platforms using modern
              development tools and AI-assisted coding workflows.
            </p>
            <p>
              I enjoy understanding how systems work, identifying vulnerabilities, and transforming ideas into useful
              digital products.
            </p>
            <p>
              That combination — offensive security thinking on one side, shipping real software on the other — shapes
              everything I build: from school management systems to AI-assisted development workflows.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2">
          {quickFacts.map((fact, i) => {
            const Icon = FACT_ICONS[fact.icon] ?? BadgeCheck
            return (
              <Reveal key={fact.label} delay={0.05 * i}>
                <div className="glass card-hover h-full rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-cyanx">
                    <Icon size={15} />
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-mist">{fact.label}</span>
                  </div>
                  <p className="mt-2 text-[13.5px] font-medium leading-snug text-frost">{fact.value}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

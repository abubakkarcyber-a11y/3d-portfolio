import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Scroll-triggered reveal wrapper — respects reduced-motion preferences. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Consistent section shell: indexed eyebrow, title, optional lead, content. */
export function Section({
  id,
  index,
  eyebrow,
  title,
  lead,
  children,
  className = '',
}: {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="eyebrow">
              {index} · {eyebrow}
            </span>
            <span
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, rgba(34,211,238,0.4), rgba(148,180,255,0.12), transparent)' }}
            />
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-frost md:text-[2.55rem] md:leading-tight">{title}</h2>
          {lead ? <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist md:text-lg">{lead}</p> : null}
        </Reveal>
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  )
}

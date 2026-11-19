import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Handshake, Layers } from 'lucide-react'
import { stageProjects } from '../../data/content'
import { HeroStage } from '../three/HeroStage'

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(1) // cybersecurity takes centre stage first
  const reduced = !!useReducedMotion()

  const select = useCallback(
    (i: number) => setActiveIndex(Math.max(0, Math.min(stageProjects.length - 1, i))),
    []
  )
  const step = useCallback((dir: 1 | -1) => {
    setActiveIndex((v: number) => (v + dir + stageProjects.length) % stageProjects.length)
  }, [])

  // keyboard navigation while near the top of the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (window.scrollY > window.innerHeight) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const project = stageProjects[activeIndex]

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Introduction and featured projects"
    >
      {/* 3D stage */}
      <HeroStage activeIndex={activeIndex} onSelect={select} reduced={reduced} />

      {/* readability scrims */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-44 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-64 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />

      {/* intro copy — overlays the stage top-left on desktop; flows in below the 3D view on mobile */}
      <div className="pointer-events-none relative z-10 mt-[62svh] md:mt-0">
        <div className="mx-auto w-full max-w-7xl px-5 pt-2 md:px-8 md:pt-32">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-mint" />
              </span>
              <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-mint">OPEN TO WORK</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="mt-4 font-display text-[2.1rem] font-bold leading-[1.06] tracking-tight text-frost [text-shadow:0_2px_24px_rgba(4,6,12,0.85)] sm:mt-5 sm:text-5xl lg:text-[3.4rem]"
            >
              Muhammad <span className="text-gradient">Abubakkar</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="mt-2.5 font-display text-[15px] font-medium text-slate-300/90 sm:mt-3.5 md:text-lg"
            >
              Breaking systems safely. Building intelligent solutions.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
              className="mt-4 hidden max-w-[30rem] text-[14.5px] leading-relaxed text-mist sm:block"
            >
              BS Computer Science student · 3+ years hands-on cybersecurity · AI application developer —
              <span className="text-slate-400"> Swabi, Pakistan</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.55 }}
              className="pointer-events-auto mt-5 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-3.5"
            >
              <a href="#contact" className="btn-primary !px-5 !py-3 text-[14px] sm:!px-6 sm:!py-3.5 sm:text-[14.5px]">
                <Handshake size={17} />
                Get in Touch
              </a>
              <a href="#projects" className="btn-ghost !px-5 !py-3 text-[14px] sm:!px-6 sm:!py-3.5 sm:text-[14.5px]">
                <Layers size={17} />
                View Projects
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* bottom: project detail panel + controls — pushed to the section bottom; with flex,
          intro and panel can never overlap, even on short desktop windows */}
      <div className="relative z-10 mt-7 px-4 pb-6 sm:mt-9 md:mt-auto md:px-8 md:pb-7">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4">
          <AnimatePresence mode="wait">
            <motion.article
              key={project.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong max-w-2xl rounded-2xl p-4 shadow-panel md:p-6"
              aria-live="polite"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: project.accent, boxShadow: `0 0 12px ${project.accent}` }}
                />
                <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.22em] text-mist">
                  PROJECT {project.index} / 03
                </span>
                <span className="hidden font-mono text-[11px] tracking-[0.14em] text-slate-500 sm:inline">· {project.tagline}</span>
              </div>

              <h2 className="mt-2.5 font-display text-[1.15rem] font-bold tracking-tight text-frost md:text-[1.55rem]">
                {project.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-mist sm:line-clamp-none md:text-[14.5px]">
                {project.description}
              </p>

              <div className="mt-3.5 hidden flex-wrap gap-1.5 sm:flex">
                {project.features.slice(0, 4).map((f) => (
                  <span key={f} className="chip !py-1 !text-[11.5px]">
                    {f}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((t) => (
                  <span
                    key={t.name}
                    className={`chip !py-1 !text-[11px] font-mono ${t.state === 'learning' ? 'chip-learning' : ''}`}
                  >
                    {t.name}
                    {t.state === 'learning' && <span className="text-violetx">·</span>}
                  </span>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>

          {/* stage controls */}
          <div className="pointer-events-auto flex flex-col items-center gap-3.5 pb-1">
            <button
              onClick={() => step(-1)}
              aria-label="Previous project"
              className="glass-strong rounded-full p-3 text-frost transition-all hover:border-cyanx/50 hover:shadow-glow active:scale-95"
            >
              <ChevronLeft size={19} />
            </button>
            <div className="flex flex-col gap-1.5" role="tablist" aria-label="Projects">
              {stageProjects.map((p, i) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={p.title}
                  onClick={() => select(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? 22 : 8,
                    background: i === activeIndex ? p.accent : 'rgba(148,180,255,0.28)',
                    boxShadow: i === activeIndex ? `0 0 10px ${p.accent}` : 'none',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => step(1)}
              aria-label="Next project"
              className="glass-strong rounded-full p-3 text-frost transition-all hover:border-cyanx/50 hover:shadow-glow active:scale-95"
            >
              <ChevronRight size={19} />
            </button>
            <span className="hidden font-mono text-[10px] tracking-widest text-slate-500 xl:block">← →</span>
          </div>
        </div>
      </div>

      {/* drag hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 4.5, delay: 1.6, times: [0, 0.15, 0.7, 1] }}
        className="pointer-events-none absolute bottom-[38%] left-1/2 z-[5] hidden -translate-x-1/2 items-center gap-2 md:flex"
      >
        <span className="font-mono text-[11px] tracking-[0.2em] text-slate-400">DRAG · CLICK · EXPLORE</span>
        <ArrowRight size={13} className="text-cyanx" />
      </motion.div>
    </section>
  )
}

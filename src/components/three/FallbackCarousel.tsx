import { useState } from 'react'
import { ChevronLeft, ChevronRight, Cpu } from 'lucide-react'
import { stageProjects } from '../../data/content'

/**
 * Pure-CSS 3D carousel — rendered only when WebGL is unavailable or the
 * 3D scene crashes, so the project experience never breaks completely.
 */
export function FallbackCarousel({ initial = 1, onSelect }: { initial?: number; onSelect?: (i: number) => void }) {
  const [active, setActive] = useState(Math.min(Math.max(initial, 0), stageProjects.length - 1))

  const go = (i: number) => {
    const next = (i + stageProjects.length) % stageProjects.length
    setActive(next)
    onSelect?.(next)
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
      <div className="chip font-mono text-[11px] text-mist">
        <Cpu size={13} className="text-cyanx" /> light mode — 3D stage unavailable
      </div>

      <div className="relative h-[380px] w-full max-w-2xl" style={{ perspective: '1400px' }}>
        {stageProjects.map((p, i) => {
          const offset = i - active
          const abs = Math.abs(offset)
          if (abs > 1) return null
          return (
            <button
              key={p.id}
              onClick={() => go(i)}
              aria-label={`Select ${p.title}`}
              className="absolute left-1/2 top-1/2 h-[340px] w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-panel transition-all duration-500"
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 55}%) translateZ(${offset === 0 ? 80 : 0}px) rotateY(${offset * -34}deg) scale(${offset === 0 ? 1 : 0.86})`,
                zIndex: offset === 0 ? 2 : 1,
                opacity: offset === 0 ? 1 : 0.75,
              }}
            >
              <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 text-left">
                <span className="font-mono text-[10px] tracking-widest" style={{ color: p.accent }}>
                  {p.index}
                </span>
                <p className="font-display text-sm font-semibold leading-tight text-frost">{p.title}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => go(active - 1)} aria-label="Previous project" className="glass rounded-full p-3 text-frost">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2">
          {stageProjects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => go(i)}
              aria-label={`Go to ${p.title}`}
              className="h-2 w-2 rounded-full transition-all"
              style={{ background: i === active ? p.accent : 'rgba(148,180,255,0.25)', width: i === active ? 22 : 8 }}
            />
          ))}
        </div>
        <button onClick={() => go(active + 1)} aria-label="Next project" className="glass rounded-full p-3 text-frost">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

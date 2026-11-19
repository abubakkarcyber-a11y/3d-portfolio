import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Subtle cursor glow that trails the native cursor on fine-pointer devices.
 * The real cursor stays fully usable — this is pure ambience.
 */
export function Cursor() {
  const reduced = useReducedMotion()
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const pos = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let raf = 0
    let hovering = false

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
    }
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      hovering = !!el.closest('a, button, input, textarea, select, [role="button"], [data-cursor]')
      if (ringRef.current) {
        ringRef.current.style.width = hovering ? '52px' : '34px'
        ringRef.current.style.height = hovering ? '52px' : '34px'
        ringRef.current.style.margin = hovering ? '-26px 0 0 -26px' : '-17px 0 0 -17px'
        ringRef.current.style.borderColor = hovering ? 'rgba(103,232,249,0.9)' : 'rgba(34,211,238,0.55)'
      }
    }

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18
      ring.y += (pos.y - ring.y) * 0.18
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ringRef} className="cursor-glow" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  )
}

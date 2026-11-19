import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { StageEnvironment, type Quality } from './StageEnvironment'
import { ProjectCarousel } from './ProjectCarousel'
import { Presenter } from './Presenter'
import { FallbackCarousel } from './FallbackCarousel'
import { stageProjects } from '../../data/content'

interface Props {
  activeIndex: number
  onSelect: (i: number) => void
  reduced: boolean
}

interface State {
  failed: boolean
}

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, State> {
  state: State = { failed: false }
  static getDerivedStateFromError(): State {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Detects low-power devices to degrade the 3D experience gracefully. */
function detectQuality(): Quality {
  if (typeof navigator === 'undefined') return 'high'
  const nav = navigator as Navigator & { deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 8
  const mem = nav.deviceMemory ?? 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 520
  if (cores <= 4 || mem <= 4 || (coarse && smallScreen)) return 'low'
  return 'high'
}

const _camTarget = new THREE.Vector3()
const _look = new THREE.Vector3(0, 1.42, 0)

/** Smoothly frames the stage; widens on small screens, adds mouse parallax on desktop. */
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, size, pointer } = useThree()
  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera
    const narrow = size.width < 900
    const d = Math.min(dt, 0.05)

    const targetFov = narrow ? 52 : 42
    if (Math.abs(cam.fov - targetFov) > 0.05) {
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, d)
      cam.updateProjectionMatrix()
    }

    const px = reduced ? 0 : pointer.x
    const py = reduced ? 0 : pointer.y
    _camTarget.set(px * 0.32, 1.78 + py * 0.14, narrow ? 9.7 : 7.7)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, _camTarget.x, 2.5, d)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, _camTarget.y, 2.5, d)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, _camTarget.z, 2.5, d)

    _look.set(px * 0.45, 1.52 + py * 0.16, 0)
    cam.lookAt(_look)
  })
  return null
}

export function HeroStage({ activeIndex, onSelect, reduced }: Props) {
  const quality = useMemo(detectQuality, [])
  const webgl = useMemo(webglAvailable, [])
  const cardRefs = useRef<(THREE.Group | null)[]>([null, null, null])
  const dragXRef = useRef(0)
  const drag = useRef({ down: false, startX: 0, lastX: 0 })

  const accent = stageProjects[activeIndex].accent

  if (!webgl) {
    return <FallbackCarousel initial={activeIndex} onSelect={onSelect} />
  }

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { down: true, startX: e.clientX, lastX: e.clientX }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    drag.current.lastX = e.clientX
    dragXRef.current = e.clientX - drag.current.startX
  }
  const endDrag = () => {
    if (!drag.current.down) return
    const dx = drag.current.lastX - drag.current.startX
    drag.current.down = false
    dragXRef.current = 0
    if (Math.abs(dx) > 55) {
      const next = THREE.MathUtils.clamp(activeIndex + (dx < 0 ? 1 : -1), 0, stageProjects.length - 1)
      if (next !== activeIndex) onSelect(next)
    }
  }

  return (
    <SceneBoundary fallback={<FallbackCarousel initial={activeIndex} onSelect={onSelect} />}>
      <div
        className="hero-canvas absolute inset-0"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <Canvas
          dpr={[1, quality === 'high' ? 1.8 : 1.35]}
          camera={{ position: [0, 1.78, 7.7], fov: 42, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
          }}
        >
          <Suspense fallback={null}>
            <CameraRig reduced={reduced} />
            <StageEnvironment quality={quality} accent={accent} activeIndex={activeIndex} reduced={reduced} />
            <ProjectCarousel
              activeIndex={activeIndex}
              onSelect={onSelect}
              cardRefs={cardRefs}
              dragXRef={dragXRef}
              reduced={reduced}
            />
            <Presenter reduced={reduced} />
          </Suspense>
        </Canvas>
      </div>
    </SceneBoundary>
  )
}

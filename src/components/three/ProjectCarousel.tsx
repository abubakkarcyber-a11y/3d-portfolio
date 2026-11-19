import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { stageProjects } from '../../data/content'
import { makeRadialGlow, makeRoundedRectAlpha, makeSheen } from './textures'
import { ARC_R, ARC_STEP, CARD_Y, FRONT_Z, STAGE_X_NARROW, STAGE_X_WIDE, isNarrowStage } from './stageLayout'

interface Props {
  activeIndex: number
  onSelect: (i: number) => void
  cardRefs: React.MutableRefObject<(THREE.Group | null)[]>
  dragXRef: React.MutableRefObject<number>
  reduced: boolean
}

interface CardProps {
  i: number
  texture: THREE.Texture
  accent: string
  alphaMap: THREE.Texture
  sheenMap: THREE.Texture
  glowMap: THREE.Texture
  onSelect: (i: number) => void
  onHover: (i: number, hovering: boolean) => void
  registerRef: (i: number, g: THREE.Group | null) => void
  innerRef: (g: THREE.Group | null) => void
  edgeRef: React.MutableRefObject<(THREE.MeshBasicMaterial | undefined)[]>
  spriteRef: React.MutableRefObject<(THREE.MeshBasicMaterial | undefined)[]>
}

function Card({ i, texture, accent, alphaMap, sheenMap, glowMap, onSelect, onHover, registerRef, innerRef, edgeRef, spriteRef }: CardProps) {
  const [edgeMat, spriteMat] = useMemo(() => {
    const edge = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const sprite = new THREE.MeshBasicMaterial({
      map: glowMap,
      color: accent,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return [edge, sprite]
  }, [accent, glowMap])

  useEffect(() => {
    edgeRef.current[i] = edgeMat
    spriteRef.current[i] = spriteMat
    return () => {
      edgeMat.dispose()
      spriteMat.dispose()
    }
  }, [edgeMat, spriteMat, edgeRef, spriteRef, i])

  return (
    <group ref={(g) => registerRef(i, g)}>
      <group ref={innerRef}>
        {/* invisible hit area — larger, easier to tap */}
        <mesh
          position={[0, 0, 0.1]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(i)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(i, true)
          }}
          onPointerOut={() => onHover(i, false)}
        >
          <planeGeometry args={[3.1, 4.15]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* soft glow halo behind the card */}
        <mesh position={[0, 0, -0.14]}>
          <planeGeometry args={[4.6, 5.6]} />
          <primitive object={spriteMat} attach="material" />
        </mesh>

        {/* frame / bezel */}
        <RoundedBox args={[2.7, 3.75, 0.16]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#0a101d" roughness={0.32} metalness={0.72} envMapIntensity={1.1} />
        </RoundedBox>

        {/* accent edge glow */}
        <RoundedBox args={[2.82, 3.87, 0.2]} radius={0.11} smoothness={4}>
          <primitive object={edgeMat} attach="material" />
        </RoundedBox>

        {/* screen — the uploaded project image at its native 2:3 aspect (never stretched) */}
        <mesh position={[0, 0, 0.086]}>
          <planeGeometry args={[2.42, 3.63]} />
          <meshBasicMaterial map={texture} alphaMap={alphaMap} alphaTest={0.5} toneMapped={false} />
        </mesh>

        {/* glass sheen */}
        <mesh position={[0, 0, 0.092]}>
          <planeGeometry args={[2.42, 3.63]} />
          <meshBasicMaterial
            map={sheenMap}
            alphaMap={alphaMap}
            alphaTest={0.5}
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}

export function ProjectCarousel({ activeIndex, onSelect, cardRefs, dragXRef, reduced }: Props) {
  const group = useRef<THREE.Group>(null!)
  const { size } = useThree()
  const hovered = useRef(-1)
  const innerGroups = useRef<(THREE.Group | null)[]>([null, null, null])
  const edgeRef = useRef<(THREE.MeshBasicMaterial | undefined)[]>([])
  const spriteRef = useRef<(THREE.MeshBasicMaterial | undefined)[]>([])
  const activeAngle = useRef(activeIndex)
  const stageX = useRef(0.55)

  const textures = useTexture(stageProjects.map((p) => p.image)) as unknown as THREE.Texture[]
  const alphaMap = useMemo(() => makeRoundedRectAlpha(), [])
  const glowMap = useMemo(() => makeRadialGlow(), [])
  const sheenMap = useMemo(() => makeSheen(), [])

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
    })
  }, [textures])

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05)
    const lambda = reduced ? 14 : 4.6
    activeAngle.current = THREE.MathUtils.damp(activeAngle.current, activeIndex, lambda, d)

    const narrow = isNarrowStage(size.width)
    const targetStageX = narrow ? STAGE_X_NARROW : STAGE_X_WIDE
    stageX.current = THREE.MathUtils.damp(stageX.current, targetStageX + dragXRef.current * 0.004, 6, d)
    group.current.position.x = stageX.current
    // on narrow screens the stage sits higher so the intro copy below stays clear
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.035 + (narrow ? 0.55 : 0)
    group.current.position.z = FRONT_Z - ARC_R

    stageProjects.forEach((_, i) => {
      const a = (i - activeAngle.current) * ARC_STEP
      const g = cardRefs.current[i]
      if (!g) return
      g.position.set(Math.sin(a) * ARC_R, CARD_Y, Math.cos(a) * ARC_R)
      g.rotation.y = a
      g.rotation.z = Math.sin(a) * 0.015

      const proximity = THREE.MathUtils.clamp(1 - Math.abs(a) / ARC_STEP, 0, 1)
      const inner = innerGroups.current[i]
      if (inner) {
        const hoverBoost = hovered.current === i && proximity < 0.5 ? 1.035 : 1
        const targetScale = (proximity > 0.5 ? 1 : 0.85) * hoverBoost
        inner.scale.setScalar(THREE.MathUtils.damp(inner.scale.x, targetScale, 8, d))
      }

      const edge = edgeRef.current[i]
      if (edge) edge.opacity = 0.05 + proximity * 0.32
      const sprite = spriteRef.current[i]
      if (sprite) sprite.opacity = 0.03 + proximity * 0.26
    })
  })

  return (
    <group ref={group}>
      {stageProjects.map((p, i) => (
        <Card
          key={p.id}
          i={i}
          texture={textures[i]}
          accent={p.accent}
          alphaMap={alphaMap}
          sheenMap={sheenMap}
          glowMap={glowMap}
          onSelect={onSelect}
          onHover={(idx, h) => {
            hovered.current = h ? idx : -1
          }}
          registerRef={(idx, g) => {
            cardRefs.current[idx] = g
          }}
          innerRef={(g) => {
            innerGroups.current[i] = g
          }}
          edgeRef={edgeRef}
          spriteRef={spriteRef}
        />
      ))}
    </group>
  )
}

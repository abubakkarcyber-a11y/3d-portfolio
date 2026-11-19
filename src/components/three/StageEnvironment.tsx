import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

export type Quality = 'high' | 'low'

interface Props {
  quality: Quality
  accent: string
  activeIndex: number
  reduced: boolean
}

/** Slow-drifting particle clouds (CPU-cheap: whole cloud rotates, no per-point updates). */
function Particles({ count, color, spread, speed, opacity }: { count: number; color: string; spread: [number, number, number]; speed: number; opacity: number }) {
  const ref = useRef<THREE.Points>(null!)
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0]
      positions[i * 3 + 1] = Math.random() * spread[1] + 0.15
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [count, spread])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * speed
    ref.current.position.y = Math.sin(t * 0.35) * 0.12
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.032}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Pulsing stage ring under the carousel — brightens when the project changes. */
function StageRing({ accent, activeIndex }: { accent: string; activeIndex: number }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  const changeAt = useRef(0)
  const prev = useRef(activeIndex)
  useFrame((state) => {
    if (prev.current !== activeIndex) {
      prev.current = activeIndex
      changeAt.current = state.clock.elapsedTime
    }
    const since = state.clock.elapsedTime - changeAt.current
    const pulse = Math.exp(-since * 2.1)
    mat.current.opacity = 0.1 + 0.4 * pulse
  })
  return (
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.95, 3.12, 72]} />
      <meshBasicMaterial ref={mat} color={accent} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

export function StageEnvironment({ quality, accent, activeIndex, reduced }: Props) {
  const rim = useRef<THREE.SpotLight>(null!)
  const accentColor = useMemo(() => new THREE.Color(accent), [accent])
  const lerpColor = useRef(new THREE.Color(accent))

  useFrame((_, dt) => {
    lerpColor.current.lerp(accentColor, Math.min(1, dt * 2.5))
    if (rim.current) rim.current.color.copy(lerpColor.current)
  })

  const high = quality === 'high'

  return (
    <>
      <fog attach="fog" args={['#04060c', 14, 34]} />

      <ambientLight intensity={0.62} />
      {/* key light — cool white from front right */}
      <spotLight position={[5, 7.5, 6]} angle={0.55} penumbra={1} intensity={150} color="#cfe3ff" />
      {/* rim light — tints with the active project accent, from back-right to catch the presenter */}
      <spotLight ref={rim} position={[6.5, 6, -5.5]} angle={0.7} penumbra={1} intensity={210} color={accent} />
      {/* cyan fill from front left */}
      <pointLight position={[-4, 2.4, 5]} intensity={16} color="#22d3ee" />
      {/* soft front fill tracking the presenter's spot so he reads clearly, not just as a silhouette */}
      <pointLight position={[1.8, 2.0, 4.8]} intensity={13} color="#dbe9ff" />
      {/* violet back fill */}
      <pointLight position={[3.5, 1.6, -3]} intensity={9} color="#8b5cf6" />

      {high && (
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={2.2} color="#9fdcff" position={[0, 5, -6]} scale={[10, 3, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#7c3aed" position={[-7, 3, 2]} rotation-y={Math.PI / 2} scale={[8, 2.4, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#0ea5e9" position={[7, 2.5, 2]} rotation-y={-Math.PI / 2} scale={[8, 2.4, 1]} />
        </Environment>
      )}

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[46, 46]} />
        {high ? (
          <MeshReflectorMaterial
            blur={[280, 60]}
            resolution={1024}
            mixBlur={1}
            mixStrength={11}
            roughness={0.88}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.35}
            color="#05070d"
            metalness={0.5}
            mirror={0.35}
          />
        ) : (
          <meshStandardMaterial color="#05070d" roughness={0.92} metalness={0.35} />
        )}
      </mesh>

      {/* back light strips — futuristic stage dressing, pushed to the frame edges */}
      <group position={[0, 0, -9]}>
        <mesh position={[-7, 2.7, 0]}>
          <boxGeometry args={[0.09, 5.4, 0.09]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.42} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[7, 3, 0]}>
          <boxGeometry args={[0.09, 5.8, 0.09]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 4.4, -0.4]}>
          <boxGeometry args={[5.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.26} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {!reduced && (
        <>
          <Particles count={high ? 170 : 70} color="#7dd3fc" spread={[19, 5.6, 11]} speed={0.014} opacity={0.42} />
          <Particles count={high ? 70 : 30} color="#c4b5fd" spread={[17, 5, 9]} speed={-0.01} opacity={0.3} />
        </>
      )}

      <StageRing accent={accent} activeIndex={activeIndex} />
      <ContactShadows position={[0, 0.015, 0.6]} scale={17} far={4} blur={2.6} opacity={0.6} resolution={high ? 512 : 256} color="#010309" />
    </>
  )
}

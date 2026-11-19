import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FRONT_Z, CARD_Y, STAGE_X_NARROW, STAGE_X_WIDE, isNarrowStage } from './stageLayout'

/**
 * Procedural 3D presenter.
 * A lightweight, fully animated stylised human built from a joint hierarchy —
 * walks to the active project, turns, raises the pointer stick at the card,
 * blinks, breathes and shifts weight like a real presenter.
 */

const DOWN = new THREE.Vector3(0, -1, 0)
const UP_Y = new THREE.Vector3(0, 1, 0)

// module-scope scratch objects (no per-frame allocations)
const _t = new THREE.Vector3()
const _spot = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _shWorld = new THREE.Vector3()
const _headWorld = new THREE.Vector3()
const _tip = new THREE.Vector3()
const _beamEnd = new THREE.Vector3()
const _q = new THREE.Quaternion()
const _qParent = new THREE.Quaternion()
const _qA = new THREE.Quaternion()
const _qSwing = new THREE.Quaternion()
const _e = new THREE.Euler()

const REST_SHOULDER_R = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.14, 0, -0.12))

interface Props {
  reduced: boolean
}

export function Presenter({ reduced }: Props) {
  const root = useRef<THREE.Group>(null!)
  const hips = useRef<THREE.Group>(null!)
  const spine = useRef<THREE.Group>(null!)
  const chest = useRef<THREE.Mesh>(null!)
  const neck = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  const shoulderL = useRef<THREE.Group>(null!)
  const elbowL = useRef<THREE.Group>(null!)
  const shoulderR = useRef<THREE.Group>(null!)
  const elbowR = useRef<THREE.Group>(null!)
  const handR = useRef<THREE.Group>(null!)
  const thighL = useRef<THREE.Group>(null!)
  const kneeL = useRef<THREE.Group>(null!)
  const thighR = useRef<THREE.Group>(null!)
  const kneeR = useRef<THREE.Group>(null!)
  const eyeL = useRef<THREE.Group>(null!)
  const eyeR = useRef<THREE.Group>(null!)
  const stickTip = useRef<THREE.Object3D>(null!)
  const beam = useRef<THREE.Mesh>(null!)
  const beamMat = useRef<THREE.MeshBasicMaterial>(null!)
  const reticle = useRef<THREE.Mesh>(null!)
  const reticleMat = useRef<THREE.MeshBasicMaterial>(null!)

  const { size } = useThree()

  const anim = useRef({
    pos: new THREE.Vector3(5.4, 0, 1.4), // enters from the right edge of the stage
    yaw: -Math.PI / 2,
    pointBlend: 0,
    walkBlend: 0,
    phase: 0,
    blinkT: -1,
    nextBlink: 2.2,
    lean: 0,
    leanTarget: 1,
    nextLean: 5,
  })

  const mats = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: '#b98055', roughness: 0.55, metalness: 0.02 }),
      hoodie: new THREE.MeshStandardMaterial({ color: '#101623', roughness: 0.86, metalness: 0.04 }),
      hoodieAccent: new THREE.MeshStandardMaterial({ color: '#1a2436', roughness: 0.8, metalness: 0.05 }),
      pants: new THREE.MeshStandardMaterial({ color: '#0c0f16', roughness: 0.9, metalness: 0.05 }),
      shoe: new THREE.MeshStandardMaterial({ color: '#0a0c10', roughness: 0.6, metalness: 0.15 }),
      sole: new THREE.MeshStandardMaterial({ color: '#d8dbe2', roughness: 0.5 }),
      hair: new THREE.MeshStandardMaterial({ color: '#101014', roughness: 0.65 }),
      sclera: new THREE.MeshStandardMaterial({ color: '#f2f4f6', roughness: 0.25 }),
      iris: new THREE.MeshStandardMaterial({ color: '#4a2f1d', roughness: 0.3 }),
      pupil: new THREE.MeshBasicMaterial({ color: '#0a0a0c' }),
      sparkle: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      lip: new THREE.MeshStandardMaterial({ color: '#7a4a3a', roughness: 0.5 }),
      stick: new THREE.MeshStandardMaterial({ color: '#181c26', roughness: 0.4, metalness: 0.6 }),
      stickTip: new THREE.MeshBasicMaterial({ color: '#67e8f9' }),
    }),
    []
  )

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const t = state.clock.elapsedTime
    const a = anim.current

    if (!root.current) return

    /* ---------- target & standing spot ----------
       The active card always sits front-center, so its world position is pure
       layout math (see stageLayout.ts) — no cross-component refs, immune to
       Suspense/ref-timing differences between browsers. */
    const narrow = isNarrowStage(size.width)
    _t.set(narrow ? STAGE_X_NARROW : STAGE_X_WIDE, CARD_Y, FRONT_Z)
    root.current.scale.setScalar(narrow ? 0.95 : 1.1)
    _spot.set(_t.x + (narrow ? 0.4 : 1.45), 0, _t.z + 1.1)
    _spot.x = THREE.MathUtils.clamp(_spot.x, -3.4, 3.3)
    _spot.z = THREE.MathUtils.clamp(_spot.z, -1.3, 1.8)

    /* ---------- locomotion ---------- */
    const dx = _spot.x - a.pos.x
    const dz = _spot.z - a.pos.z
    const dist = Math.hypot(dx, dz)
    const walking = !reduced && dist > 0.22
    a.walkBlend = THREE.MathUtils.damp(a.walkBlend, walking ? 1 : 0, 7, dt)

    if (walking) {
      const speed = Math.min(1.3, 0.4 + dist * 2.2)
      a.pos.x += (dx / dist) * speed * dt
      a.pos.z += (dz / dist) * speed * dt
      a.phase += dt * (4.4 + speed * 1.8)
      a.yaw = THREE.MathUtils.damp(a.yaw, Math.atan2(dx, dz), 8, dt)
    } else {
      // settled (or reduced-motion): glide to the spot — never frozen offstage
      const glide = reduced ? 10 : 6
      a.pos.x = THREE.MathUtils.damp(a.pos.x, _spot.x, glide, dt)
      a.pos.z = THREE.MathUtils.damp(a.pos.z, _spot.z, glide, dt)
      const settle = Math.round(a.phase / Math.PI) * Math.PI
      a.phase = THREE.MathUtils.damp(a.phase, settle, 6, dt)
    }

    a.pointBlend = THREE.MathUtils.damp(a.pointBlend, walking ? 0 : 1, reduced ? 16 : 4.2, dt)

    const bob = Math.abs(Math.sin(a.phase)) * 0.024 * a.walkBlend
    root.current.position.set(a.pos.x, bob, a.pos.z)
    root.current.rotation.y = a.yaw

    /* ---------- aim the right arm + stick at the card ---------- */
    const sh = shoulderR.current
    sh.getWorldPosition(_shWorld)
    _dir.copy(_t).sub(_shWorld)
    _dir.normalize()
    // direction in shoulder-parent (spine) space
    sh.parent!.getWorldQuaternion(_qParent).invert()
    _dir.applyQuaternion(_qParent)
    _q.setFromUnitVectors(DOWN, _dir)
    // slight natural bend: pull the aim 6° toward straight-down
    _e.set(-0.06, 0, 0)
    _qA.setFromEuler(_e)
    _q.multiply(_qA)

    // walking arm-swing applied in arm-local space
    _e.set(Math.sin(a.phase + Math.PI) * 0.3 * a.walkBlend, 0, 0)
    _qSwing.setFromEuler(_e)
    _q.multiply(_qSwing)

    // rest → aim blended by pointBlend, then swing layered on top
    sh.quaternion.slerpQuaternions(REST_SHOULDER_R, _q, a.pointBlend)
    // elbow: relaxed bend at rest, nearly straight while pointing
    elbowR.current.rotation.x = THREE.MathUtils.lerp(-0.5, -0.1, a.pointBlend) - Math.abs(Math.sin(a.phase + Math.PI)) * 0.22 * a.walkBlend
    // hand: cocked stick at rest, straight grip while pointing
    handR.current.rotation.x = THREE.MathUtils.damp(handR.current.rotation.x, THREE.MathUtils.lerp(-0.42, 0, a.pointBlend), 8, dt)

    /* ---------- left arm: counter-swing + presenting gesture ---------- */
    const idleAmp = (1 - a.walkBlend) * (reduced ? 0 : 1)
    _e.set(
      0.1 + Math.sin(a.phase) * 0.3 * a.walkBlend + 0.02 * Math.sin(t * 1.1) * idleAmp,
      THREE.MathUtils.damp(0, THREE.MathUtils.clamp(Math.atan2(_t.x - _shWorld.x, _t.z - _shWorld.z), -0.6, 0.6) * 0.35 * a.pointBlend, 6, dt),
      0.12
    )
    shoulderL.current.quaternion.setFromEuler(_e)
    elbowL.current.rotation.x = THREE.MathUtils.lerp(-0.45, -0.95, a.pointBlend * (1 - a.walkBlend)) + Math.abs(Math.sin(a.phase)) * 0.2 * a.walkBlend

    /* ---------- head tracking ---------- */
    head.current.getWorldPosition(_headWorld)
    _dir.copy(_t).sub(_headWorld)
    const headYaw = THREE.MathUtils.clamp(Math.atan2(_dir.x, _dir.z), -0.85, 0.85)
    const headPitch = THREE.MathUtils.clamp(Math.atan2(_dir.y, Math.hypot(_dir.x, _dir.z)), -0.28, 0.34)
    // occasionally glance at the visitor on a slow cycle
    const cycle = t % 12
    const glance = reduced ? 0 : cycle > 8 ? Math.sin(((cycle - 8) / 4) * Math.PI) : 0
    const camYaw = _dir.set(state.camera.position.x - _headWorld.x, 0, state.camera.position.z - _headWorld.z)
    const camYawAngle = THREE.MathUtils.clamp(Math.atan2(camYaw.x, camYaw.z), -0.6, 0.6)
    const targetYaw = THREE.MathUtils.lerp(headYaw, camYawAngle, glance * 0.75)
    neck.current.rotation.y = THREE.MathUtils.damp(neck.current.rotation.y, targetYaw * a.pointBlend + Math.sin(t * 0.5) * 0.03 * idleAmp, 5, dt)
    neck.current.rotation.x = THREE.MathUtils.damp(
      neck.current.rotation.x,
      -headPitch * a.pointBlend + Math.sin(t * 0.8) * 0.02 * idleAmp + Math.abs(Math.sin(a.phase)) * 0.03 * a.walkBlend,
      5,
      dt
    )

    /* ---------- torso & weight ---------- */
    if (t > a.nextLean) {
      a.leanTarget = -a.leanTarget
      a.nextLean = t + 4.5 + Math.random() * 3.5
    }
    a.lean = THREE.MathUtils.damp(a.lean, a.leanTarget * idleAmp, 2.2, dt)
    spine.current.rotation.z = 0.016 * Math.sin(t * 0.6) * idleAmp + a.lean * 0.02
    spine.current.rotation.x = 0.03 * Math.sin(t * 0.85) * idleAmp + 0.07 * a.walkBlend
    hips.current.rotation.z = a.lean * 0.025
    hips.current.position.y = 0.98 + 0.004 * Math.sin(t * 1.5) * idleAmp
    if (chest.current) {
      const breathe = 1 + 0.012 * Math.sin(t * 1.5) * idleAmp
      chest.current.scale.set(1.18, breathe, 0.9) // preserve base proportions
    }

    /* ---------- legs ---------- */
    const swingL = Math.sin(a.phase) * 0.55 * a.walkBlend
    const swingR = Math.sin(a.phase + Math.PI) * 0.55 * a.walkBlend
    thighL.current.rotation.x = swingL - 0.03 + a.lean * 0.012
    thighR.current.rotation.x = swingR + 0.05 - a.lean * 0.012
    kneeL.current.rotation.x = Math.max(0, -Math.sin(a.phase)) * 0.95 * a.walkBlend + 0.07
    kneeR.current.rotation.x = Math.max(0, -Math.sin(a.phase + Math.PI)) * 0.95 * a.walkBlend + 0.05

    /* ---------- blinking ---------- */
    if (!reduced) {
      if (t > a.nextBlink) {
        a.blinkT = t
        a.nextBlink = t + 2.4 + Math.random() * 3.2
      }
      if (a.blinkT >= 0) {
        const p = (t - a.blinkT) / 0.16
        const s = p >= 1 ? 1 : Math.max(0.08, 1 - Math.sin(Math.min(p, 1) * Math.PI))
        eyeL.current.scale.y = s
        eyeR.current.scale.y = s
        if (p >= 1) a.blinkT = -1
      }
    }

    /* ---------- pointer beam from stick tip to the card ---------- */
    const beamOn = a.pointBlend > 0.55 && a.walkBlend < 0.4
    if (stickTip.current && beam.current && reticle.current) {
      stickTip.current.getWorldPosition(_tip)
      _beamEnd.copy(_t)
      const mid = _tip.clone().add(_beamEnd).multiplyScalar(0.5) // rare alloc OK (2/frame)
      const dir = _beamEnd.clone().sub(_tip)
      const len = Math.max(dir.length(), 0.01)
      beam.current.position.copy(mid)
      beam.current.scale.set(1, len, 1)
      beam.current.quaternion.setFromUnitVectors(UP_Y, dir.normalize())
      const target = beamOn ? 0.3 * ((a.pointBlend - 0.55) / 0.45) : 0
      if (beamMat.current) beamMat.current.opacity = THREE.MathUtils.damp(beamMat.current.opacity, target, 10, dt)
      reticle.current.position.copy(_t)
      reticle.current.quaternion.copy(state.camera.quaternion)
      const rs = 1 + 0.07 * Math.sin(t * 3.2)
      reticle.current.scale.setScalar(rs)
      if (reticleMat.current) reticleMat.current.opacity = THREE.MathUtils.damp(reticleMat.current.opacity, beamOn ? 0.55 : 0, 10, dt)
    }
  })

  return (
    <group ref={root} position={[5.4, 0, 1.4]}>
      {/* pointer beam (stick tip → card) — never raycastable */}
      <mesh ref={beam} frustumCulled={false} raycast={() => null}>
        <cylinderGeometry args={[0.007, 0.007, 1, 6, 1, true]} />
        <meshBasicMaterial ref={beamMat} color="#67e8f9" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={reticle} raycast={() => null}>
        <torusGeometry args={[0.07, 0.009, 8, 24]} />
        <meshBasicMaterial ref={reticleMat} color="#67e8f9" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <group ref={hips} position={[0, 0.98, 0]}>
        {/* pelvis */}
        <mesh material={mats.hoodie} position={[0, -0.03, 0]} scale={[1.16, 0.78, 0.92]}>
          <capsuleGeometry args={[0.13, 0.1, 4, 14]} />
        </mesh>

        <group ref={spine} position={[0, 0.06, 0]}>
          {/* lower torso */}
          <mesh material={mats.hoodie} position={[0, 0.12, 0]} scale={[1.12, 1, 0.86]}>
            <capsuleGeometry args={[0.14, 0.14, 4, 16]} />
          </mesh>
          {/* chest (breathes) */}
          <mesh ref={chest} material={mats.hoodie} position={[0, 0.34, 0]} scale={[1.18, 1, 0.9]}>
            <capsuleGeometry args={[0.155, 0.16, 4, 16]} />
          </mesh>
          {/* hood resting on shoulders */}
          <mesh material={mats.hoodieAccent} position={[0, 0.545, -0.035]} rotation={[1.15, 0, 0]}>
            <torusGeometry args={[0.14, 0.052, 10, 20]} />
          </mesh>
          {/* kangaroo pocket */}
          <mesh material={mats.hoodieAccent} position={[0, 0.08, 0.148]}>
            <boxGeometry args={[0.22, 0.1, 0.025]} />
          </mesh>
          {/* zip line */}
          <mesh material={mats.pants} position={[0, 0.3, 0.158]}>
            <boxGeometry args={[0.012, 0.42, 0.012]} />
          </mesh>
          {/* drawstrings */}
          {[0.045, -0.045].map((x) => (
            <mesh key={x} material={mats.hoodieAccent} position={[x, 0.46, 0.152]} rotation={[0.06, 0, x > 0 ? -0.05 : 0.05]}>
              <cylinderGeometry args={[0.006, 0.006, 0.11, 6]} />
            </mesh>
          ))}

          {/* neck + head */}
          <group ref={neck} position={[0, 0.56, 0]}>
            <mesh material={mats.skin} position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.05, 0.058, 0.1, 12]} />
            </mesh>
            <group ref={head} position={[0, 0.085, 0]}>
              {/* skull */}
              <mesh material={mats.skin} scale={[0.94, 1.08, 0.98]}>
                <sphereGeometry args={[0.115, 24, 20]} />
              </mesh>
              {/* jaw */}
              <mesh material={mats.skin} position={[0, -0.05, 0.012]} scale={[0.82, 0.82, 0.9]}>
                <sphereGeometry args={[0.095, 18, 14]} />
              </mesh>
              {/* hair — top/back cap, face open */}
              <mesh material={mats.hair} position={[0, 0.012, -0.014]} rotation={[-0.32, 0, 0]}>
                <sphereGeometry args={[0.123, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
              </mesh>
              <mesh material={mats.hair} position={[0, 0.075, 0.09]} rotation={[0.3, 0, 0]}>
                <boxGeometry args={[0.15, 0.05, 0.03]} />
              </mesh>
              {/* ears */}
              {[-0.107, 0.107].map((x) => (
                <mesh key={x} material={mats.skin} position={[x, -0.005, -0.008]} scale={[0.55, 1, 0.8]}>
                  <sphereGeometry args={[0.026, 10, 8]} />
                </mesh>
              ))}
              {/* brows */}
              {[-0.043, 0.043].map((x) => (
                <mesh key={x} material={mats.hair} position={[x, 0.06, 0.098]} rotation={[-0.1, 0, x > 0 ? 0.12 : -0.12]}>
                  <boxGeometry args={[0.05, 0.011, 0.015]} />
                </mesh>
              ))}
              {/* eyes */}
              {[
                { x: -0.043, ref: eyeL },
                { x: 0.043, ref: eyeR },
              ].map(({ x, ref }) => (
                <group key={x} ref={ref} position={[x, 0.015, 0.096]}>
                  <mesh material={mats.sclera}>
                    <sphereGeometry args={[0.0235, 14, 12]} />
                  </mesh>
                  <mesh material={mats.iris} position={[0, 0, 0.014]}>
                    <sphereGeometry args={[0.0125, 12, 10]} />
                  </mesh>
                  <mesh material={mats.pupil} position={[0, 0, 0.02]}>
                    <sphereGeometry args={[0.006, 8, 8]} />
                  </mesh>
                  <mesh material={mats.sparkle} position={[0.005, 0.005, 0.022]}>
                    <sphereGeometry args={[0.003, 6, 6]} />
                  </mesh>
                </group>
              ))}
              {/* nose */}
              <mesh material={mats.skin} position={[0, -0.02, 0.108]} rotation={[1.15, 0, 0]}>
                <coneGeometry args={[0.016, 0.052, 10]} />
              </mesh>
              {/* mouth — gentle smile (arc centred at the bottom) */}
              <mesh material={mats.lip} position={[0, -0.055, 0.1]} rotation={[0.12, 0, Math.PI * 1.075]}>
                <torusGeometry args={[0.026, 0.005, 8, 16, Math.PI * 0.85]} />
              </mesh>
            </group>
          </group>

          {/* left arm */}
          <group ref={shoulderL} position={[-0.215, 0.47, 0]}>
            <mesh material={mats.hoodie} position={[0, -0.01, 0]} scale={[1, 1.05, 1]}>
              <sphereGeometry args={[0.077, 14, 12]} />
            </mesh>
            <mesh material={mats.hoodie} position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.052, 0.16, 4, 12]} />
            </mesh>
            <group ref={elbowL} position={[0, -0.3, 0]}>
              <mesh material={mats.hoodie} position={[0, -0.12, 0]}>
                <capsuleGeometry args={[0.046, 0.15, 4, 12]} />
              </mesh>
              <mesh material={mats.skin} position={[0, -0.285, 0]} scale={[0.8, 1.2, 0.5]}>
                <sphereGeometry args={[0.047, 12, 10]} />
              </mesh>
            </group>
          </group>

          {/* right arm + pointer stick */}
          <group ref={shoulderR} position={[0.215, 0.47, 0]}>
            <mesh material={mats.hoodie} position={[0, -0.01, 0]} scale={[1, 1.05, 1]}>
              <sphereGeometry args={[0.077, 14, 12]} />
            </mesh>
            <mesh material={mats.hoodie} position={[0, -0.15, 0]}>
              <capsuleGeometry args={[0.052, 0.16, 4, 12]} />
            </mesh>
            <group ref={elbowR} position={[0, -0.3, 0]}>
              <mesh material={mats.hoodie} position={[0, -0.12, 0]}>
                <capsuleGeometry args={[0.046, 0.15, 4, 12]} />
              </mesh>
              <group ref={handR} position={[0, -0.285, 0]}>
                <mesh material={mats.skin} scale={[0.8, 1.15, 0.5]}>
                  <sphereGeometry args={[0.047, 12, 10]} />
                </mesh>
                {/* the presentation pointer stick — essential */}
                <group position={[0, -0.03, 0]}>
                  <mesh material={mats.stick} position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[0.011, 0.011, 0.66, 10]} />
                  </mesh>
                  <mesh material={mats.stickTip} position={[0, -0.528, 0]}>
                    <torusGeometry args={[0.016, 0.006, 8, 16]} />
                  </mesh>
                  <object3D ref={stickTip} position={[0, -0.545, 0]} />
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* legs */}
        <group ref={thighL} position={[-0.095, -0.1, 0]}>
          <mesh material={mats.pants} position={[0, -0.17, 0]}>
            <capsuleGeometry args={[0.072, 0.24, 4, 12]} />
          </mesh>
          <group ref={kneeL} position={[0, -0.4, 0]}>
            <mesh material={mats.pants} position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.058, 0.26, 4, 12]} />
            </mesh>
            <group position={[0, -0.415, 0]}>
              <mesh material={mats.shoe} position={[0, -0.005, 0.04]}>
                <boxGeometry args={[0.105, 0.07, 0.2]} />
              </mesh>
              <mesh material={mats.sole} position={[0, -0.05, 0.045]}>
                <boxGeometry args={[0.112, 0.026, 0.21]} />
              </mesh>
            </group>
          </group>
        </group>
        <group ref={thighR} position={[0.095, -0.1, 0]}>
          <mesh material={mats.pants} position={[0, -0.17, 0]}>
            <capsuleGeometry args={[0.072, 0.24, 4, 12]} />
          </mesh>
          <group ref={kneeR} position={[0, -0.4, 0]}>
            <mesh material={mats.pants} position={[0, -0.17, 0]}>
              <capsuleGeometry args={[0.058, 0.26, 4, 12]} />
            </mesh>
            <group position={[0, -0.415, 0]}>
              <mesh material={mats.shoe} position={[0, -0.005, 0.04]}>
                <boxGeometry args={[0.105, 0.07, 0.2]} />
              </mesh>
              <mesh material={mats.sole} position={[0, -0.05, 0.045]}>
                <boxGeometry args={[0.112, 0.026, 0.21]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

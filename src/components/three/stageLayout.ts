/**
 * Shared 3D stage layout constants — single source of truth for the carousel
 * and the presenter so their positions can never drift apart across browsers.
 */
export const ARC_R = 4.4
export const ARC_STEP = 0.55
export const CARD_Y = 1.95
export const FRONT_Z = 0.35 // world z of the front-most (active) card
export const STAGE_X_WIDE = 0.55 // carousel center offset on wide screens
export const STAGE_X_NARROW = 0
export const NARROW_RAISE = 0.55 // stage raised on small screens so intro copy stays clear

export const isNarrowStage = (width: number) => width < 900

/** World position of the ACTIVE card — it is always front-center by design. */
export function activeCardWorld(out: { x: number; y: number; z: number }, narrow: boolean, floatY = 0) {
  out.x = (narrow ? STAGE_X_NARROW : STAGE_X_WIDE)
  out.y = CARD_Y + (narrow ? NARROW_RAISE : 0) + floatY
  out.z = FRONT_Z
  return out
}

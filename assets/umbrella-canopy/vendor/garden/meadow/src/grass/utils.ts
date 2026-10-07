import * as THREE from 'three'

export function hasOwn(value: object, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, property)
}

export function finitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0
}

export function finiteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0
}

/**
 * Deterministic LCG-based PRNG. The first call produces the initial stream
 * value; the seed itself is never returned directly.
 */
export function seededRandom(seed: number): () => number {
  let state = (seed * 1664525 + 1013904223) >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

/** Converts a wind direction in degrees to a normalised XY vector. */
export function windDirectionVec2(degrees: number): THREE.Vector2 {
  const radians = THREE.MathUtils.degToRad(degrees)
  const x = Math.cos(radians)
  const z = Math.sin(radians)
  return new THREE.Vector2(
    Math.abs(x) < Number.EPSILON ? 0 : x,
    Math.abs(z) < Number.EPSILON ? 0 : z,
  )
}

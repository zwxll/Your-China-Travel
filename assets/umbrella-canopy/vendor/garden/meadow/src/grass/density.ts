const DENSITY_CONTROL_SCALE = 20

export const DENSITY_CONTROL = {
  min: 8,
  max: 1000,
  default: 800,
} as const

/** Converts the demo's ergonomic density control into blades per world unit. */
export function densityFromControl(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError('Density control value must be a finite positive number.')
  }
  return value / DENSITY_CONTROL_SCALE
}

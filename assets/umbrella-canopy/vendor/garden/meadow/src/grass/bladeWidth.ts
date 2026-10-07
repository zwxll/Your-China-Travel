const DEFAULT_MIN_WIDTH = 0.035

export const BLADE_WIDTH_CONTROL = {
  min: 0.01,
  max: 0.2,
  default: 0.16,
} as const

const MIN_WIDTH_RATIO = DEFAULT_MIN_WIDTH / BLADE_WIDTH_CONTROL.default

/** Converts the demo's width control into the renderer's varied blade widths. */
export function bladeWidthsFromControl(value: number): { minWidth: number; maxWidth: number } {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError('Blade width control value must be a finite positive number.')
  }
  return {
    minWidth: value * MIN_WIDTH_RATIO,
    maxWidth: value,
  }
}

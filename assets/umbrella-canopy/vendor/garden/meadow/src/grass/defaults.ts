export const DEFAULT_TERRAIN_OPTIONS = Object.freeze({
  width: 20,
  depth: 20,
  segments: 72,
  seed: 17,
  terrainDegree: 0.8,
  groundColor: '#557d24',
})

export const DEFAULT_GRASS_OPTIONS = Object.freeze({
  density: 40,
  seed: 1,
  blade: Object.freeze({
    minWidth: 0.035,
    maxWidth: 0.16,
    minHeight: 0.705,
    maxHeight: 1.5,
    segments: 4,
    lean: 0.1,
  }),
  wind: Object.freeze({
    strength: 0.22,
    speed: 1.1,
    frequency: 0.55,
    turbulence: 0.24,
    lean: 0.035,
    direction: 32,
  }),
  colors: Object.freeze({
    bottom: '#4f7c13',
    top: '#b8da57',
    backlight: '#c1e54d',
    ground: '#4f7c13',
  }),
  brightness: 0.35,
  shadow: false,
  lighting: Object.freeze({
    direction: Object.freeze([-0.4, 0.85, 0.3] as const),
    color: '#fff5cf',
    intensity: 1.1,
    backlightStrength: 2.5,
    backlightPower: 3,
    backlightTip: 0.6,
  }),
})

export const DEFAULT_WILDFLOWER_OPTIONS = Object.freeze({
  enabled: true,
  density: 0.84,
  maxCount: 240,
  seed: 29,
})

import type * as THREE from 'three'

export type GrassColor = THREE.ColorRepresentation

export type GrassCoverageChannel = 'r' | 'g' | 'b' | 'a'

/** A readable texture, or a URL loaded by the Grass facade. */
export type GrassCoverageMap = THREE.Texture | string

export interface GrassCoveragePoint {
  position: THREE.Vector3
  normal: THREE.Vector3
  uv: THREE.Vector2 | null
  seed: number
}

export interface GrassCoverageOptions {
  map?: GrassCoverageMap
  attribute?: string
  sample?: (point: GrassCoveragePoint) => number
  channel?: GrassCoverageChannel
  threshold?: number
  power?: number
}

export interface NormalizedGrassCoverageOptions {
  map?: THREE.Texture
  attribute?: string
  sample?: (point: GrassCoveragePoint) => number
  channel: GrassCoverageChannel
  threshold: number
  power: number
}

export enum GrassLayerKind {
  Terrain = 'terrain',
  Blades = 'blades',
  Wildflowers = 'wildflowers',
}

export interface GrassBladeOptions {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  segments?: number
  lean?: number
}

export interface GrassWindOptions {
  strength?: number
  speed?: number
  frequency?: number
  turbulence?: number
  lean?: number
  direction?: number
}

export interface GrassColorOptions {
  bottom?: GrassColor
  top?: GrassColor
  backlight?: GrassColor
  ground?: GrassColor
}

export interface GrassLightingOptions {
  direction?: THREE.Vector3
  color?: GrassColor
  intensity?: number
  backlightStrength?: number
  backlightPower?: number
  backlightTip?: number
}

export interface TerrainOptions {
  width?: number
  depth?: number
  segments?: number
  seed?: number
  terrainDegree?: number
  groundColor?: THREE.ColorRepresentation
}

export interface GrassLayerOptions {
  density?: number
  seed?: number
  coverage?: GrassCoverageOptions
  blade?: GrassBladeOptions
  wind?: GrassWindOptions
  colors?: GrassColorOptions
  brightness?: number
  /** Whether grass blades cast and receive directional shadows. */
  shadow?: boolean
  lighting?: GrassLightingOptions
}

export interface WildflowerLayerOptions {
  enabled?: boolean
  density?: number
  maxCount?: number
  seed?: number
  coverage?: GrassCoverageOptions
}

/** Public configuration accepted by the Grass facade. */
export interface GrassOptions {
  surface?: THREE.Mesh
  coverage?: GrassCoverageOptions
  terrain?: TerrainOptions
  grass?: GrassLayerOptions
  wildflowers?: WildflowerLayerOptions
}

export interface NormalizedGrassBladeOptions {
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
  segments: number
  lean: number
}

export interface NormalizedGrassWindOptions {
  strength: number
  speed: number
  frequency: number
  turbulence: number
  lean: number
  direction: number
}

export interface NormalizedGrassColorOptions {
  bottom: THREE.Color
  top: THREE.Color
  backlight: THREE.Color
  ground: THREE.Color
}

export interface NormalizedGrassLightingOptions {
  direction: THREE.Vector3
  color: THREE.Color
  intensity: number
  backlightStrength: number
  backlightPower: number
  backlightTip: number
}

export interface NormalizedTerrainOptions {
  width: number
  depth: number
  segments: number
  seed: number
  terrainDegree: number
  groundColor: GrassColor
}

/** Private renderer configuration after facade normalization. */
export interface NormalizedGrassLayerOptions {
  surface: THREE.Mesh
  width: number
  depth: number
  density: number
  seed: number
  coverage?: NormalizedGrassCoverageOptions
  blade: NormalizedGrassBladeOptions
  wind: NormalizedGrassWindOptions
  colors: NormalizedGrassColorOptions
  brightness: number
  shadow: boolean
  lighting: NormalizedGrassLightingOptions
}

export interface NormalizedWildflowerLayerOptions {
  enabled: boolean
  density: number
  maxCount: number
  seed: number
  coverage?: NormalizedGrassCoverageOptions
}

export interface NormalizedGrassFacadeOptions {
  surface: THREE.Mesh
  coverage?: NormalizedGrassCoverageOptions
  terrain: NormalizedTerrainOptions
  grass: NormalizedGrassLayerOptions
  wildflowers: NormalizedWildflowerLayerOptions
}

export interface ReadonlyNormalizedGrassBladeOptions {
  readonly minWidth: number
  readonly maxWidth: number
  readonly minHeight: number
  readonly maxHeight: number
  readonly segments: number
  readonly lean: number
}

export interface ReadonlyNormalizedGrassWindOptions {
  readonly strength: number
  readonly speed: number
  readonly frequency: number
  readonly turbulence: number
  readonly lean: number
  readonly direction: number
}

export interface ReadonlyNormalizedGrassColorOptions {
  readonly bottom: THREE.Color
  readonly top: THREE.Color
  readonly backlight: THREE.Color
  readonly ground: THREE.Color
}

export interface ReadonlyNormalizedGrassLightingOptions {
  readonly direction: THREE.Vector3
  readonly color: THREE.Color
  readonly intensity: number
  readonly backlightStrength: number
  readonly backlightPower: number
  readonly backlightTip: number
}

export interface ReadonlyNormalizedTerrainOptions {
  readonly width: number
  readonly depth: number
  readonly segments: number
  readonly seed: number
  readonly terrainDegree: number
  readonly groundColor: GrassColor
}

export interface ReadonlyNormalizedGrassLayerOptions {
  readonly surface: THREE.Mesh
  readonly width: number
  readonly depth: number
  readonly density: number
  readonly seed: number
  readonly coverage?: Readonly<NormalizedGrassCoverageOptions>
  readonly blade: ReadonlyNormalizedGrassBladeOptions
  readonly wind: ReadonlyNormalizedGrassWindOptions
  readonly colors: ReadonlyNormalizedGrassColorOptions
  readonly brightness: number
  readonly shadow: boolean
  readonly lighting: ReadonlyNormalizedGrassLightingOptions
}

export interface ReadonlyNormalizedWildflowerLayerOptions {
  readonly enabled: boolean
  readonly density: number
  readonly maxCount: number
  readonly seed: number
  readonly coverage?: Readonly<NormalizedGrassCoverageOptions>
}

/**
 * Frozen facade snapshot. Three.js values intentionally retain their usable
 * class types because the facade will clone them before exposing a snapshot.
 */
export interface ReadonlyGrassFacadeOptions {
  readonly surface: THREE.Mesh
  readonly coverage?: Readonly<NormalizedGrassCoverageOptions>
  readonly terrain: ReadonlyNormalizedTerrainOptions
  readonly grass: ReadonlyNormalizedGrassLayerOptions
  readonly wildflowers: ReadonlyNormalizedWildflowerLayerOptions
}

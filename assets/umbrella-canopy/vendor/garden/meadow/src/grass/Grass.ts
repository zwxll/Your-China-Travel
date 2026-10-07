import * as THREE from 'three'
import {
  cloneCoverage,
  coverageEquals,
  normalizeCoverage,
  validateSurfaceCoverage,
} from './coverage'
import { createTerrain, type Terrain } from './Terrain'
import { Wildflowers } from './Wildflowers'
import { vegetationSeeds } from './seedStreams'
import {
  DEFAULT_GRASS_OPTIONS,
  DEFAULT_TERRAIN_OPTIONS,
  DEFAULT_WILDFLOWER_OPTIONS,
} from './defaults'
import { GrassLayer } from './GrassLayer'
import type {
  GrassCoverageMap,
  GrassOptions,
  NormalizedGrassFacadeOptions,
  ReadonlyGrassFacadeOptions,
} from './types'

import { finiteNonNegative, finitePositive, hasOwn } from './utils'

function isMesh(surface: unknown): surface is THREE.Mesh {
  return surface instanceof THREE.Mesh
}

function validateExternalSurface(surface: unknown): asserts surface is THREE.Mesh {
  if (!isMesh(surface) || !surface.geometry?.getAttribute('position')) {
    throw new RangeError('Grass surface must be a THREE.Mesh with position geometry.')
  }
}

function surfaceSize(surface: THREE.Mesh): { width: number; depth: number } {
  surface.geometry.computeBoundingBox()
  const size = surface.geometry.boundingBox?.getSize(new THREE.Vector3())
  return {
    width: Math.max(size?.x ?? 0, Number.EPSILON),
    depth: Math.max(size?.z ?? 0, Number.EPSILON),
  }
}

function normalizedColor(value: THREE.ColorRepresentation): string {
  return `#${new THREE.Color(value).getHexString()}`
}

function cloneOptions(options: GrassOptions): GrassOptions {
  const clone: GrassOptions = {}
  if (hasOwn(options, 'surface')) clone.surface = options.surface
  if (hasOwn(options, 'coverage')) clone.coverage = cloneCoverage(options.coverage)
  if (options.terrain) {
    clone.terrain = {
      ...options.terrain,
      groundColor:
        options.terrain.groundColor === undefined
          ? undefined
          : normalizedColor(options.terrain.groundColor),
    }
  }
  if (options.grass) {
    clone.grass = {
      ...options.grass,
      coverage: cloneCoverage(options.grass.coverage),
      blade: options.grass.blade && { ...options.grass.blade },
      wind: options.grass.wind && { ...options.grass.wind },
      colors: options.grass.colors && {
        bottom:
          options.grass.colors.bottom === undefined
            ? undefined
            : normalizedColor(options.grass.colors.bottom),
        top:
          options.grass.colors.top === undefined
            ? undefined
            : normalizedColor(options.grass.colors.top),
        backlight:
          options.grass.colors.backlight === undefined
            ? undefined
            : normalizedColor(options.grass.colors.backlight),
        ground:
          options.grass.colors.ground === undefined
            ? undefined
            : normalizedColor(options.grass.colors.ground),
      },
      lighting: options.grass.lighting && {
        ...options.grass.lighting,
        direction: options.grass.lighting.direction?.clone(),
        color:
          options.grass.lighting.color === undefined
            ? undefined
            : normalizedColor(options.grass.lighting.color),
      },
    }
  }
  if (options.wildflowers) {
    clone.wildflowers = {
      ...options.wildflowers,
      coverage: cloneCoverage(options.wildflowers.coverage),
    }
  }
  return clone
}

function mergeOptions(current: GrassOptions, patch: GrassOptions): GrassOptions {
  const next = cloneOptions(current)
  if (hasOwn(patch, 'surface')) next.surface = patch.surface
  if (hasOwn(patch, 'coverage')) next.coverage = cloneCoverage(patch.coverage)
  if (patch.terrain) next.terrain = { ...current.terrain, ...patch.terrain }
  if (patch.grass) {
    next.grass = {
      ...current.grass,
      ...patch.grass,
      blade: { ...current.grass?.blade, ...patch.grass.blade },
      wind: { ...current.grass?.wind, ...patch.grass.wind },
      colors: { ...current.grass?.colors, ...patch.grass.colors },
      lighting: { ...current.grass?.lighting, ...patch.grass.lighting },
    }
  }
  if (patch.wildflowers) next.wildflowers = { ...current.wildflowers, ...patch.wildflowers }
  return next
}

function validateOptions(options: NormalizedGrassFacadeOptions): void {
  const { terrain, grass, wildflowers } = options
  if (!finitePositive(terrain.width) || !finitePositive(terrain.depth)) {
    throw new RangeError('Terrain dimensions must be finite positive numbers.')
  }
  if (!Number.isInteger(terrain.segments) || terrain.segments < 2) {
    throw new RangeError('Terrain segments must be an integer of at least 2.')
  }
  if (!Number.isFinite(terrain.seed)) throw new RangeError('Terrain seed must be finite.')
  if (
    !Number.isFinite(terrain.terrainDegree) ||
    terrain.terrainDegree < 0 ||
    terrain.terrainDegree > 1
  ) {
    throw new RangeError('Terrain degree must be a finite number from 0 to 1.')
  }
  if (!finitePositive(grass.density))
    throw new RangeError('Grass density must be a finite positive number.')
  if (!Number.isFinite(grass.seed)) throw new RangeError('Grass seed must be finite.')
  if (!Number.isInteger(grass.blade.segments) || grass.blade.segments < 1) {
    throw new RangeError('Grass blade segments must be a positive integer.')
  }
  if (!finitePositive(grass.blade.minWidth) || !finitePositive(grass.blade.maxWidth)) {
    throw new RangeError('Grass blade widths must be finite positive numbers.')
  }
  if (!finitePositive(grass.blade.minHeight) || !finitePositive(grass.blade.maxHeight)) {
    throw new RangeError('Grass blade heights must be finite positive numbers.')
  }
  if (
    grass.blade.minWidth > grass.blade.maxWidth ||
    grass.blade.minHeight > grass.blade.maxHeight
  ) {
    throw new RangeError('Grass blade minimum dimensions cannot exceed maximum dimensions.')
  }
  if (!Number.isFinite(grass.blade.lean)) throw new RangeError('Grass blade lean must be finite.')
  if (
    !finiteNonNegative(grass.wind.strength) ||
    !finiteNonNegative(grass.wind.speed) ||
    !finiteNonNegative(grass.wind.frequency) ||
    !finiteNonNegative(grass.wind.turbulence) ||
    !Number.isFinite(grass.wind.lean) ||
    !Number.isFinite(grass.wind.direction)
  ) {
    throw new RangeError('Grass wind values must be finite and nonnegative where applicable.')
  }
  if (!finiteNonNegative(grass.brightness))
    throw new RangeError('Grass brightness must be finite and nonnegative.')
  if (typeof grass.shadow !== 'boolean') throw new RangeError('Grass shadow must be a boolean.')
  if (
    !finiteNonNegative(grass.lighting.intensity) ||
    !finiteNonNegative(grass.lighting.backlightStrength)
  ) {
    throw new RangeError('Grass light values must be finite and nonnegative.')
  }
  if (!finitePositive(grass.lighting.backlightPower)) {
    throw new RangeError('Grass backlight power must be finite and positive.')
  }
  if (!finiteNonNegative(grass.lighting.backlightTip) || grass.lighting.backlightTip > 1) {
    throw new RangeError('Grass backlight tip must be a finite number from 0 to 1.')
  }
  const direction = grass.lighting.direction
  if (
    !Number.isFinite(direction.x) ||
    !Number.isFinite(direction.y) ||
    !Number.isFinite(direction.z)
  ) {
    throw new RangeError('Grass light direction components must be finite.')
  }
  if (
    !finiteNonNegative(wildflowers.density) ||
    !Number.isInteger(wildflowers.maxCount) ||
    wildflowers.maxCount < 0
  ) {
    throw new RangeError('Wildflower density and maximum count must be nonnegative.')
  }
  if (!Number.isFinite(wildflowers.seed)) throw new RangeError('Wildflower seed must be finite.')
}

function normalizeOptions(input: GrassOptions = {}): NormalizedGrassFacadeOptions {
  const terrainInput = input.terrain ?? {}
  const grassInput = input.grass ?? {}
  const wildflowerInput = input.wildflowers ?? {}
  const terrain = {
    ...DEFAULT_TERRAIN_OPTIONS,
    ...terrainInput,
    groundColor: normalizedColor(terrainInput.groundColor ?? DEFAULT_TERRAIN_OPTIONS.groundColor),
  }
  const seeds = vegetationSeeds(terrain.seed)
  const coverage = normalizeCoverage(input.coverage)
  const surface = input.surface
  if (surface !== undefined) validateExternalSurface(surface)
  const dimensions = surface ? surfaceSize(surface) : { width: terrain.width, depth: terrain.depth }
  const grass = {
    surface: surface as THREE.Mesh,
    width: dimensions.width,
    depth: dimensions.depth,
    density: grassInput.density ?? DEFAULT_GRASS_OPTIONS.density,
    seed: grassInput.seed ?? seeds.grass,
    coverage: normalizeCoverage(grassInput.coverage ?? input.coverage),
    blade: {
      ...DEFAULT_GRASS_OPTIONS.blade,
      ...grassInput.blade,
    },
    wind: {
      ...DEFAULT_GRASS_OPTIONS.wind,
      ...grassInput.wind,
    },
    colors: {
      bottom: new THREE.Color(grassInput.colors?.bottom ?? DEFAULT_GRASS_OPTIONS.colors.bottom),
      top: new THREE.Color(grassInput.colors?.top ?? DEFAULT_GRASS_OPTIONS.colors.top),
      backlight: new THREE.Color(
        grassInput.colors?.backlight ?? DEFAULT_GRASS_OPTIONS.colors.backlight,
      ),
      ground: new THREE.Color(grassInput.colors?.ground ?? DEFAULT_GRASS_OPTIONS.colors.ground),
    },
    brightness: grassInput.brightness ?? DEFAULT_GRASS_OPTIONS.brightness,
    shadow: grassInput.shadow ?? DEFAULT_GRASS_OPTIONS.shadow,
    lighting: {
      direction: new THREE.Vector3(
        ...(grassInput.lighting?.direction?.toArray() ?? DEFAULT_GRASS_OPTIONS.lighting.direction),
      ).normalize(),
      color: new THREE.Color(grassInput.lighting?.color ?? DEFAULT_GRASS_OPTIONS.lighting.color),
      intensity: grassInput.lighting?.intensity ?? DEFAULT_GRASS_OPTIONS.lighting.intensity,
      backlightStrength:
        grassInput.lighting?.backlightStrength ?? DEFAULT_GRASS_OPTIONS.lighting.backlightStrength,
      backlightPower:
        grassInput.lighting?.backlightPower ?? DEFAULT_GRASS_OPTIONS.lighting.backlightPower,
      backlightTip:
        grassInput.lighting?.backlightTip ?? DEFAULT_GRASS_OPTIONS.lighting.backlightTip,
    },
  }
  const wildflowers = {
    enabled: wildflowerInput.enabled ?? DEFAULT_WILDFLOWER_OPTIONS.enabled,
    density: wildflowerInput.density ?? DEFAULT_WILDFLOWER_OPTIONS.density,
    maxCount: wildflowerInput.maxCount ?? DEFAULT_WILDFLOWER_OPTIONS.maxCount,
    seed: wildflowerInput.seed ?? seeds.wildflowers,
    coverage: normalizeCoverage(wildflowerInput.coverage),
  }

  const normalized = {
    surface: surface as THREE.Mesh,
    coverage,
    terrain,
    grass,
    wildflowers,
  }
  validateOptions(normalized)
  return normalized
}

function frozenColor(color: THREE.Color): THREE.Color {
  return Object.freeze(color.clone())
}

function frozenCoverage(
  coverage: NormalizedGrassFacadeOptions['coverage'],
): Readonly<NonNullable<NormalizedGrassFacadeOptions['coverage']>> | undefined {
  return coverage && Object.freeze({ ...coverage })
}

function readonlySnapshot(
  options: NormalizedGrassFacadeOptions,
  surface: THREE.Mesh,
): ReadonlyGrassFacadeOptions {
  return Object.freeze({
    surface,
    coverage: frozenCoverage(options.coverage),
    terrain: Object.freeze({ ...options.terrain }),
    grass: Object.freeze({
      surface,
      width: options.grass.width,
      depth: options.grass.depth,
      density: options.grass.density,
      seed: options.grass.seed,
      coverage: frozenCoverage(options.grass.coverage),
      blade: Object.freeze({ ...options.grass.blade }),
      wind: Object.freeze({ ...options.grass.wind }),
      colors: Object.freeze({
        bottom: frozenColor(options.grass.colors.bottom),
        top: frozenColor(options.grass.colors.top),
        backlight: frozenColor(options.grass.colors.backlight),
        ground: frozenColor(options.grass.colors.ground),
      }),
      brightness: options.grass.brightness,
      shadow: options.grass.shadow,
      lighting: Object.freeze({
        direction: Object.freeze(options.grass.lighting.direction.clone()),
        color: frozenColor(options.grass.lighting.color),
        intensity: options.grass.lighting.intensity,
        backlightStrength: options.grass.lighting.backlightStrength,
        backlightPower: options.grass.lighting.backlightPower,
        backlightTip: options.grass.lighting.backlightTip,
      }),
    }),
    wildflowers: Object.freeze({
      ...options.wildflowers,
      coverage: frozenCoverage(options.wildflowers.coverage),
    }),
  })
}

/**
 * Public meadow facade. It owns generated terrain and vegetation layers while
 * treating an optional caller-supplied sampling surface as read-only.
 */
export class Grass extends THREE.Group {
  blades: GrassLayer
  wildflowers?: Wildflowers
  /** Resolves after every URL-backed coverage map in the current options is readable. */
  ready: Promise<void> = Promise.resolve()

  private terrain?: Terrain
  private externalSurface?: THREE.Mesh
  private externalSurfaceVisual?: THREE.Mesh
  private activeSurface: THREE.Mesh
  private sourceOptions: GrassOptions
  private normalized: NormalizedGrassFacadeOptions
  private readonly coverageMapLoads = new Map<
    string,
    { texture: THREE.Texture; ready: Promise<void> }
  >()
  private initialized = false
  private disposed = false

  get ground(): THREE.Mesh | undefined {
    return this.terrain?.ground
  }

  get surface(): THREE.Mesh {
    return this.activeSurface
  }

  get bladeCount(): number {
    return this.blades.bladeCount
  }

  get wildflowerCount(): number {
    return this.wildflowers?.count ?? 0
  }

  get options(): ReadonlyGrassFacadeOptions {
    return readonlySnapshot(this.normalized, this.surface)
  }

  constructor(options: GrassOptions = {}) {
    super()
    this.sourceOptions = cloneOptions(options)
    this.normalized = this.normalizeSourceOptions(this.sourceOptions)
    this.validateCoverageOptions(this.normalized)
    this.externalSurface = this.sourceOptions.surface
    this.terrain = this.externalSurface ? undefined : createTerrain(this.normalized.terrain)
    this.activeSurface = this.externalSurface ?? this.terrain!.grassSurface
    this.blades = this.createBlades()
    if (this.terrain) this.add(this.terrain.ground, this.terrain.grassSurface)
    else this.addExternalSurfaceVisual()
    this.add(this.blades)
    this.rebuildWildflowers()
    this.initialized = true
    this.ready = this.coverageReady(this.sourceOptions)
  }

  setOptions(patch: GrassOptions): void {
    if (this.disposed) return

    const nextSource = mergeOptions(this.sourceOptions, patch)
    const next = this.normalizeSourceOptions(nextSource)
    this.validateCoverageOptions(next)
    const surfaceChanged = this.externalSurface !== nextSource.surface
    const terrainChanged =
      !this.externalSurface &&
      !nextSource.surface &&
      (this.normalized.terrain.width !== next.terrain.width ||
        this.normalized.terrain.depth !== next.terrain.depth ||
        this.normalized.terrain.segments !== next.terrain.segments ||
        this.normalized.terrain.seed !== next.terrain.seed ||
        this.normalized.terrain.terrainDegree !== next.terrain.terrainDegree)
    const wildflowersChanged =
      !coverageEquals(this.normalized.coverage, next.coverage) ||
      this.normalized.wildflowers.enabled !== next.wildflowers.enabled ||
      this.normalized.wildflowers.density !== next.wildflowers.density ||
      this.normalized.wildflowers.maxCount !== next.wildflowers.maxCount ||
      this.normalized.wildflowers.seed !== next.wildflowers.seed ||
      !coverageEquals(this.normalized.wildflowers.coverage, next.wildflowers.coverage)

    this.sourceOptions = nextSource
    this.normalized = next
    this.ready = this.coverageReady(nextSource)
    this.disposeUnusedCoverageMaps(nextSource)
    if (surfaceChanged || terrainChanged) {
      this.rebuildTerrainAndVegetation()
      return
    }

    this.applyLiveOptions()
    if (wildflowersChanged) this.rebuildWildflowers()
  }

  update(timeSeconds: number): void {
    if (!Number.isFinite(timeSeconds)) throw new RangeError('Grass update time must be finite.')
    if (this.disposed) return
    this.syncExternalSurfaceVisual()
    this.blades.update(timeSeconds)
    this.wildflowers?.update(timeSeconds)
  }

  /** Keeps stylized blade lighting synchronized with a scene DirectionalLight. */
  syncDirectionalLight(light: THREE.DirectionalLight): void {
    if (this.disposed) return
    this.blades.syncDirectionalLight(light)
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.disposeVegetation()
    this.disposeOwnedTerrain()
    this.removeExternalSurfaceVisual()
    this.disposeCoverageMaps()
    this.clear()
  }

  private validateCoverageOptions(options: NormalizedGrassFacadeOptions): void {
    validateSurfaceCoverage(options.surface, options.grass.coverage)
    if (options.wildflowers.enabled) {
      validateSurfaceCoverage(options.surface, options.wildflowers.coverage ?? options.coverage)
    }
  }

  private createBlades(): GrassLayer {
    return new GrassLayer({
      surface: this.surface,
      density: this.normalized.grass.density,
      seed: this.normalized.grass.seed,
      coverage: this.normalized.grass.coverage,
      blade: this.normalized.grass.blade,
      wind: this.normalized.grass.wind,
      colors: {
        bottom: this.normalized.grass.colors.bottom,
        top: this.normalized.grass.colors.top,
        backlight: this.normalized.grass.colors.backlight,
      },
      brightness: this.normalized.grass.brightness,
      shadow: this.normalized.grass.shadow,
      lighting: this.normalized.grass.lighting,
    })
  }

  private applyLiveOptions(): void {
    this.blades.setOptions({
      density: this.normalized.grass.density,
      seed: this.normalized.grass.seed,
      coverage: this.normalized.grass.coverage,
      blade: this.normalized.grass.blade,
      wind: this.normalized.grass.wind,
      colors: {
        bottom: this.normalized.grass.colors.bottom,
        top: this.normalized.grass.colors.top,
        backlight: this.normalized.grass.colors.backlight,
      },
      brightness: this.normalized.grass.brightness,
      shadow: this.normalized.grass.shadow,
      lighting: this.normalized.grass.lighting,
    })
    this.wildflowers?.setWind(this.normalized.grass.wind)
    this.wildflowers?.setShadow(this.normalized.grass.shadow)
    this.terrain?.setGroundColor(this.normalized.terrain.groundColor)
  }

  private rebuildTerrainAndVegetation(): void {
    this.disposeVegetation()
    this.disposeOwnedTerrain()
    this.removeExternalSurfaceVisual()
    this.externalSurface = this.sourceOptions.surface
    this.terrain = this.externalSurface ? undefined : createTerrain(this.normalized.terrain)
    this.activeSurface = this.externalSurface ?? this.terrain!.grassSurface
    if (this.terrain) this.add(this.terrain.ground, this.terrain.grassSurface)
    else this.addExternalSurfaceVisual()
    this.blades = this.createBlades()
    this.add(this.blades)
    this.rebuildWildflowers()
  }

  private rebuildWildflowers(): void {
    if (this.wildflowers) {
      this.remove(this.wildflowers)
      this.wildflowers.dispose()
      this.wildflowers = undefined
    }
    if (!this.normalized.wildflowers.enabled) return
    this.wildflowers = new Wildflowers({
      surface: this.surface,
      density: this.normalized.wildflowers.density,
      maxCount: this.normalized.wildflowers.maxCount,
      seed: this.normalized.wildflowers.seed,
      coverage: this.normalized.wildflowers.coverage ?? this.normalized.coverage,
      wind: this.normalized.grass.wind,
      shadow: this.normalized.grass.shadow,
    })
    this.add(this.wildflowers)
  }

  private normalizeSourceOptions(options: GrassOptions): NormalizedGrassFacadeOptions {
    const resolved = cloneOptions(options)
    if (resolved.coverage) resolved.coverage.map = this.resolveCoverageMap(resolved.coverage.map)
    if (resolved.grass?.coverage) {
      resolved.grass.coverage.map = this.resolveCoverageMap(resolved.grass.coverage.map)
    }
    if (resolved.wildflowers?.coverage) {
      resolved.wildflowers.coverage.map = this.resolveCoverageMap(resolved.wildflowers.coverage.map)
    }
    return normalizeOptions(resolved)
  }

  private resolveCoverageMap(map: GrassCoverageMap | undefined): THREE.Texture | undefined {
    if (map === undefined || map instanceof THREE.Texture) return map
    let load = this.coverageMapLoads.get(map)
    if (!load) {
      let resolveReady!: () => void
      let rejectReady!: (reason: unknown) => void
      const ready = new Promise<void>((resolve, reject) => {
        resolveReady = resolve
        rejectReady = reject
      })
      const texture = new THREE.TextureLoader().load(
        map,
        () => {
          try {
            if (this.initialized && !this.disposed) this.refreshCoverageLayouts()
            resolveReady()
          } catch (error) {
            rejectReady(error)
          }
        },
        undefined,
        rejectReady,
      )
      load = { texture, ready }
      this.coverageMapLoads.set(map, load)
    }
    return load.texture
  }

  private coverageReady(options: GrassOptions): Promise<void> {
    const urls = this.coverageMapUrls(options)
    return Promise.all(urls.map((url) => this.coverageMapLoads.get(url)!.ready)).then(
      () => undefined,
    )
  }

  private coverageMapUrls(options: GrassOptions): string[] {
    return [options.coverage, options.grass?.coverage, options.wildflowers?.coverage]
      .map((coverage) => coverage?.map)
      .filter((map): map is string => typeof map === 'string')
  }

  private refreshCoverageLayouts(): void {
    this.blades.refreshLayout()
    this.rebuildWildflowers()
  }

  private disposeCoverageMaps(): void {
    for (const { texture } of this.coverageMapLoads.values()) texture.dispose()
    this.coverageMapLoads.clear()
  }

  private disposeUnusedCoverageMaps(options: GrassOptions): void {
    const activeUrls = new Set(this.coverageMapUrls(options))
    for (const [url, { texture }] of this.coverageMapLoads) {
      if (activeUrls.has(url)) continue
      texture.dispose()
      this.coverageMapLoads.delete(url)
    }
  }

  private disposeVegetation(): void {
    this.remove(this.blades)
    this.blades.dispose()
    if (this.wildflowers) {
      this.remove(this.wildflowers)
      this.wildflowers.dispose()
      this.wildflowers = undefined
    }
  }

  private disposeOwnedTerrain(): void {
    if (!this.terrain) return
    this.remove(this.terrain.ground, this.terrain.grassSurface)
    this.terrain.dispose()
    this.terrain = undefined
  }

  /**
   * Draws caller-owned surfaces without reparenting or disposing them. The
   * shared geometry and material keep caller-side visual changes live.
   */
  private addExternalSurfaceVisual(): void {
    if (!this.externalSurface) return
    const visual = this.externalSurface.clone(false)
    visual.matrixAutoUpdate = false
    visual.frustumCulled = false
    visual.onBeforeRender = () => this.syncExternalSurfaceVisual()
    this.externalSurfaceVisual = visual
    this.add(visual)
    this.syncExternalSurfaceVisual()
  }

  private removeExternalSurfaceVisual(): void {
    if (!this.externalSurfaceVisual) return
    this.remove(this.externalSurfaceVisual)
    this.externalSurfaceVisual.onBeforeRender = () => undefined
    this.externalSurfaceVisual = undefined
  }

  private syncExternalSurfaceVisual(): void {
    if (!this.externalSurface || !this.externalSurfaceVisual) return
    this.externalSurface.updateWorldMatrix(true, false)
    this.updateWorldMatrix(true, false)
    this.externalSurfaceVisual.matrix
      .copy(this.matrixWorld)
      .invert()
      .multiply(this.externalSurface.matrixWorld)
    this.externalSurfaceVisual.matrix.decompose(
      this.externalSurfaceVisual.position,
      this.externalSurfaceVisual.quaternion,
      this.externalSurfaceVisual.scale,
    )
    // onBeforeRender runs after the renderer has updated scene matrices.
    this.externalSurfaceVisual.matrixWorld.copy(this.externalSurface.matrixWorld)
    this.externalSurfaceVisual.matrixWorldNeedsUpdate = true
  }
}

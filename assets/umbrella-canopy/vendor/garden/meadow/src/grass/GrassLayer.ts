import * as THREE from 'three'
import { coverageEquals, normalizeCoverage, validateSurfaceCoverage } from './coverage'
import { buildSurfaceLayout, sampleSurfaceData } from './surfaceSampler'
import {
  grassFragmentShader,
  grassVertexShader,
  grassWindVertexTransform,
  grassWindVertexUniforms,
} from './shaders'
import type {
  GrassColorOptions,
  NormalizedGrassCoverageOptions,
  GrassLayerOptions as FacadeGrassLayerOptions,
  NormalizedGrassBladeOptions,
  NormalizedGrassLightingOptions,
  NormalizedGrassWindOptions,
} from './types'

import { finiteNonNegative, finitePositive, hasOwn, seededRandom, windDirectionVec2 } from './utils'

type GrassLayerOptions = Omit<FacadeGrassLayerOptions, 'colors'> & {
  surface: THREE.Mesh
  colors?: Omit<GrassColorOptions, 'ground'>
}

type GrassLayerPatch = Omit<GrassLayerOptions, 'surface'> & { surface?: THREE.Mesh }

type NormalizedGrassLayerRendererOptions = {
  surface: THREE.Mesh
  density: number
  seed: number
  coverage?: NormalizedGrassCoverageOptions
  blade: NormalizedGrassBladeOptions
  wind: NormalizedGrassWindOptions
  colors: {
    bottom: THREE.Color
    top: THREE.Color
    backlight: THREE.Color
  }
  brightness: number
  shadow: boolean
  lighting: NormalizedGrassLightingOptions
}

type ReadonlyGrassLayerOptions = {
  readonly surface: THREE.Mesh
  readonly density: number
  readonly seed: number
  readonly coverage?: Readonly<NormalizedGrassCoverageOptions>
  readonly blade: Readonly<NormalizedGrassBladeOptions>
  readonly wind: Readonly<NormalizedGrassWindOptions>
  readonly colors: Readonly<NormalizedGrassLayerRendererOptions['colors']>
  readonly brightness: number
  readonly shadow: boolean
  readonly lighting: Readonly<NormalizedGrassLightingOptions>
}

const DEFAULT_OPTIONS: Omit<NormalizedGrassLayerRendererOptions, 'surface'> = {
  density: 36,
  seed: 1,
  blade: {
    minWidth: 0.035,
    maxWidth: 0.065,
    minHeight: 0.22,
    maxHeight: 0.48,
    segments: 3,
    lean: 0.08,
  },
  wind: {
    strength: 0.14,
    speed: 1.3,
    frequency: 0.55,
    turbulence: 0.2,
    lean: 0.04,
    direction: 35,
  },
  colors: {
    bottom: new THREE.Color('#4f7c13'),
    top: new THREE.Color('#91b936'),
    backlight: new THREE.Color('#c1e54d'),
  },
  brightness: 1,
  shadow: true,
  lighting: {
    direction: new THREE.Vector3(-0.4, 0.85, 0.3).normalize(),
    color: new THREE.Color('#fff7d1'),
    intensity: 1,
    backlightStrength: 2.5,
    backlightPower: 3,
    backlightTip: 0.6,
  },
}

type GrassUniforms = {
  uTime: THREE.IUniform<number>
  uWindStrength: THREE.IUniform<number>
  uWindSpeed: THREE.IUniform<number>
  uWindFrequency: THREE.IUniform<number>
  uWindTurbulence: THREE.IUniform<number>
  uWindLean: THREE.IUniform<number>
  uWindDirection: THREE.IUniform<THREE.Vector2>
  uGrassBottom: THREE.IUniform<THREE.Color>
  uGrassTop: THREE.IUniform<THREE.Color>
  uLightDirection: THREE.IUniform<THREE.Vector3>
  uLightColor: THREE.IUniform<THREE.Color>
  uLightIntensity: THREE.IUniform<number>
  uBacklightColor: THREE.IUniform<THREE.Color>
  uBacklightStrength: THREE.IUniform<number>
  uBacklightPower: THREE.IUniform<number>
  uBacklightTip: THREE.IUniform<number>
  uBrightness: THREE.IUniform<number>
}

function rejectUnsupportedOptions(options: object): void {
  if (hasOwn(options, 'width') || hasOwn(options, 'depth')) {
    throw new RangeError(
      'GrassLayer does not support width or depth; size the sampling surface instead.',
    )
  }
  const colors = (options as { colors?: unknown }).colors
  if (colors && typeof colors === 'object' && hasOwn(colors, 'ground')) {
    throw new RangeError('GrassLayer does not support colors.ground.')
  }
}

function validateOptions(options: NormalizedGrassLayerRendererOptions): void {
  if (!options.surface) throw new RangeError('GrassLayer requires a sampling surface.')
  if (!finitePositive(options.density))
    throw new RangeError('Grass density must be a finite positive number.')
  if (!Number.isFinite(options.seed)) throw new RangeError('Grass seed must be finite.')
  const { blade } = options
  if (!Number.isInteger(blade.segments) || blade.segments < 1) {
    throw new RangeError('Grass blade segments must be a positive integer.')
  }
  if (!finitePositive(blade.minWidth) || !finitePositive(blade.maxWidth)) {
    throw new RangeError('Grass blade widths must be finite positive numbers.')
  }
  if (!finitePositive(blade.minHeight) || !finitePositive(blade.maxHeight)) {
    throw new RangeError('Grass blade heights must be finite positive numbers.')
  }
  if (blade.minWidth > blade.maxWidth || blade.minHeight > blade.maxHeight) {
    throw new RangeError('Grass blade minimum dimensions cannot exceed maximum dimensions.')
  }
  if (!Number.isFinite(blade.lean)) throw new RangeError('Grass blade lean must be finite.')
  const { wind, lighting } = options
  if (!finiteNonNegative(wind.strength))
    throw new RangeError('Grass wind strength must be finite and nonnegative.')
  if (!finiteNonNegative(wind.speed))
    throw new RangeError('Grass wind speed must be finite and nonnegative.')
  if (!finiteNonNegative(wind.frequency))
    throw new RangeError('Grass wind frequency must be finite and nonnegative.')
  if (!finiteNonNegative(wind.turbulence))
    throw new RangeError('Grass wind turbulence must be finite and nonnegative.')
  if (!Number.isFinite(wind.lean)) throw new RangeError('Grass wind lean must be finite.')
  if (!Number.isFinite(wind.direction)) throw new RangeError('Grass wind direction must be finite.')
  if (!finiteNonNegative(options.brightness))
    throw new RangeError('Grass brightness must be finite and nonnegative.')
  if (typeof options.shadow !== 'boolean') throw new RangeError('Grass shadow must be a boolean.')
  if (!finiteNonNegative(lighting.intensity))
    throw new RangeError('Grass light intensity must be finite and nonnegative.')
  if (!finiteNonNegative(lighting.backlightStrength)) {
    throw new RangeError('Grass backlight strength must be finite and nonnegative.')
  }
  if (!finitePositive(lighting.backlightPower)) {
    throw new RangeError('Grass backlight power must be finite and positive.')
  }
  if (!finiteNonNegative(lighting.backlightTip) || lighting.backlightTip > 1) {
    throw new RangeError('Grass backlight tip must be a finite number from 0 to 1.')
  }
  if (
    !Number.isFinite(lighting.direction.x) ||
    !Number.isFinite(lighting.direction.y) ||
    !Number.isFinite(lighting.direction.z)
  ) {
    throw new RangeError('Grass light direction components must be finite.')
  }
}

function readonlySnapshot(options: NormalizedGrassLayerRendererOptions): ReadonlyGrassLayerOptions {
  const colors = Object.freeze({
    bottom: Object.freeze(options.colors.bottom.clone()),
    top: Object.freeze(options.colors.top.clone()),
    backlight: Object.freeze(options.colors.backlight.clone()),
  })
  const lighting = Object.freeze({
    direction: Object.freeze(options.lighting.direction.clone()),
    color: Object.freeze(options.lighting.color.clone()),
    intensity: options.lighting.intensity,
    backlightStrength: options.lighting.backlightStrength,
    backlightPower: options.lighting.backlightPower,
    backlightTip: options.lighting.backlightTip,
  })
  return Object.freeze({
    surface: options.surface,
    density: options.density,
    seed: options.seed,
    coverage: options.coverage && Object.freeze({ ...options.coverage }),
    blade: Object.freeze({ ...options.blade }),
    wind: Object.freeze({ ...options.wind }),
    colors,
    brightness: options.brightness,
    shadow: options.shadow,
    lighting,
  })
}

function normalizedOptions(
  input: GrassLayerOptions | GrassLayerPatch,
  previous?: NormalizedGrassLayerRendererOptions,
): NormalizedGrassLayerRendererOptions {
  rejectUnsupportedOptions(input)
  const suppliedSurface = hasOwn(input, 'surface') ? input.surface : previous?.surface
  if (!suppliedSurface) throw new RangeError('GrassLayer requires a sampling surface.')

  const source = previous ?? { ...DEFAULT_OPTIONS, surface: suppliedSurface }
  const wind = { ...source.wind, ...input.wind }
  const blade = { ...source.blade, ...input.blade }
  const colors = {
    bottom: new THREE.Color(input.colors?.bottom ?? source.colors.bottom),
    top: new THREE.Color(input.colors?.top ?? source.colors.top),
    backlight: new THREE.Color(input.colors?.backlight ?? source.colors.backlight),
  }
  const lighting = {
    direction: (input.lighting?.direction ?? source.lighting.direction).clone().normalize(),
    color: new THREE.Color(input.lighting?.color ?? source.lighting.color),
    intensity: input.lighting?.intensity ?? source.lighting.intensity,
    backlightStrength: input.lighting?.backlightStrength ?? source.lighting.backlightStrength,
    backlightPower: input.lighting?.backlightPower ?? source.lighting.backlightPower,
    backlightTip: input.lighting?.backlightTip ?? source.lighting.backlightTip,
  }
  const next: NormalizedGrassLayerRendererOptions = {
    surface: suppliedSurface,
    density: input.density ?? source.density,
    seed: input.seed ?? source.seed,
    coverage: normalizeCoverage(hasOwn(input, 'coverage') ? input.coverage : source.coverage),
    blade,
    wind,
    colors,
    brightness: input.brightness ?? source.brightness,
    shadow: input.shadow ?? source.shadow,
    lighting,
  }
  validateOptions(next)
  return next
}

function makeBladeGeometry(segments: number, lean: number): THREE.BufferGeometry {
  const positions = new Float32Array((segments * 2 + 1) * 3)
  const uvs = new Float32Array((segments * 2 + 1) * 2)
  const indices: number[] = []
  for (let row = 0; row < segments; row += 1) {
    const t = row / segments
    const width = 0.5 * Math.pow(1 - t, 1.2)
    const bend = lean * t * t
    const vertex = row * 2
    positions.set([-width, t, bend, width, t, bend], vertex * 3)
    uvs.set([0, t, 1, t], vertex * 2)
    if (row < segments - 1)
      indices.push(vertex, vertex + 2, vertex + 1, vertex + 1, vertex + 2, vertex + 3)
  }
  positions.set([0, 1, lean], segments * 6)
  uvs.set([0.5, 1], segments * 4)
  const finalLeft = (segments - 1) * 2
  indices.push(finalLeft, segments * 2, finalLeft + 1)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function layoutChanged(
  before: NormalizedGrassLayerRendererOptions,
  after: NormalizedGrassLayerRendererOptions,
): boolean {
  return (
    before.surface !== after.surface ||
    before.density !== after.density ||
    before.seed !== after.seed ||
    !coverageEquals(before.coverage, after.coverage) ||
    before.blade.minWidth !== after.blade.minWidth ||
    before.blade.maxWidth !== after.blade.maxWidth ||
    before.blade.minHeight !== after.blade.minHeight ||
    before.blade.maxHeight !== after.blade.maxHeight ||
    before.blade.segments !== after.blade.segments ||
    before.blade.lean !== after.blade.lean
  )
}

export class GrassLayer extends THREE.Group {
  blades!: THREE.InstancedMesh<THREE.BufferGeometry, THREE.ShaderMaterial>
  bladeCount = 0
  time = 0

  private normalized: NormalizedGrassLayerRendererOptions
  private readonly uniforms: GrassUniforms
  private material: THREE.ShaderMaterial
  private depthMaterial: THREE.MeshDepthMaterial
  private readonly lastGrassWorldMatrix = new THREE.Matrix4()
  private lastExternalSurfaceWorldMatrix?: THREE.Matrix4
  private disposed = false

  get options(): ReadonlyGrassLayerOptions {
    return readonlySnapshot(this.normalized)
  }

  constructor(options: GrassLayerOptions) {
    super()
    this.normalized = normalizedOptions(options)
    validateSurfaceCoverage(this.normalized.surface, this.normalized.coverage)
    this.uniforms = this.createUniforms()
    this.material = this.createMaterial()
    this.depthMaterial = this.createDepthMaterial()
    this.rebuild(true)
  }

  setOptions(options: GrassLayerPatch): void {
    if (this.disposed) return
    const next = normalizedOptions(options, this.normalized)
    validateSurfaceCoverage(next.surface, next.coverage)
    const rebuild = layoutChanged(this.normalized, next)
    this.normalized = next
    if (rebuild) {
      this.rebuild()
      return
    }
    this.applyUniforms()
    this.applyShadowOptions()
  }

  /** Re-samples the surface when an externally loaded coverage map becomes readable. */
  refreshLayout(): void {
    if (this.disposed) return
    this.rebuild()
  }

  update(timeSeconds: number): void {
    if (!Number.isFinite(timeSeconds)) throw new RangeError('Grass update time must be finite.')
    if (this.disposed) return
    if (this.externalSurfaceTransformChanged()) this.rebuild()
    this.time = timeSeconds
    this.uniforms.uTime.value = timeSeconds
  }

  /** Mirrors a scene directional light so grass highlights track the real sun. */
  syncDirectionalLight(light: THREE.DirectionalLight): void {
    if (this.disposed) return
    light.updateWorldMatrix(true, false)
    light.target.updateWorldMatrix(true, false)
    const lightPosition = light.getWorldPosition(new THREE.Vector3())
    const targetPosition = light.target.getWorldPosition(new THREE.Vector3())
    const direction = lightPosition.sub(targetPosition)
    if (direction.lengthSq() === 0) return
    this.uniforms.uLightDirection.value.copy(direction.normalize())
    this.uniforms.uLightColor.value.copy(light.color)
    this.uniforms.uLightIntensity.value = light.intensity
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.remove(this.blades)
    this.disposeBladeMesh(this.blades)
    this.clear()
    this.bladeCount = 0
  }

  private createUniforms(): GrassUniforms {
    const colors = this.normalized.colors
    const lighting = this.normalized.lighting
    return {
      uTime: { value: 0 },
      uWindStrength: { value: 0 },
      uWindSpeed: { value: 0 },
      uWindFrequency: { value: 0 },
      uWindTurbulence: { value: 0 },
      uWindLean: { value: 0 },
      uWindDirection: { value: new THREE.Vector2() },
      uGrassBottom: { value: colors.bottom.clone() },
      uGrassTop: { value: colors.top.clone() },
      uLightDirection: { value: lighting.direction.clone() },
      uLightColor: { value: lighting.color.clone() },
      uLightIntensity: { value: lighting.intensity },
      uBacklightColor: { value: colors.backlight.clone() },
      uBacklightStrength: { value: lighting.backlightStrength },
      uBacklightPower: { value: lighting.backlightPower },
      uBacklightTip: { value: lighting.backlightTip },
      uBrightness: { value: this.normalized.brightness },
    }
  }

  private createMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: Object.assign(THREE.UniformsUtils.clone(THREE.UniformsLib.lights), this.uniforms),
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: true,
      toneMapped: true,
      lights: true,
    })
  }

  private createDepthMaterial(): THREE.MeshDepthMaterial {
    const material = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms)
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>\n${grassWindVertexUniforms}`,
      )
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `${grassWindVertexTransform}\nvoid main() {`,
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\ntransformed = deformGrassBlade(transformed);`,
      )
    }
    material.customProgramCacheKey = () => 'grass-wind-depth-v1'
    return material
  }

  private rebuild(initial = false): void {
    const surface = this.normalized.surface
    const layout = buildSurfaceLayout(surface, this.normalized.coverage)
    const requestedCount =
      layout.coveredArea > 0
        ? Math.max(1, Math.floor(layout.coveredArea * this.normalized.density))
        : 0
    const samples = sampleSurfaceData(
      surface,
      requestedCount,
      this.normalized.seed,
      this.normalized.coverage,
      layout,
    )
    this.updateWorldMatrix(true, false)
    const worldToGrassLocal = this.matrixWorld.clone().invert()
    const geometry = makeBladeGeometry(this.normalized.blade.segments, this.normalized.blade.lean)
    const mesh = new THREE.InstancedMesh(geometry, this.material, samples.length)
    mesh.frustumCulled = false
    mesh.castShadow = this.normalized.shadow
    mesh.receiveShadow = this.normalized.shadow
    mesh.customDepthMaterial = this.depthMaterial
    const random = seededRandom(this.normalized.seed ^ 0x9e3779b9)
    const rotation = new THREE.Quaternion()
    const spin = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    const matrix = new THREE.Matrix4()
    const blade = this.normalized.blade
    for (let index = 0; index < samples.length; index += 1) {
      const localNormal = samples[index].normal.clone().transformDirection(worldToGrassLocal)
      rotation.setFromUnitVectors(THREE.Object3D.DEFAULT_UP, localNormal)
      spin.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, random() * Math.PI * 2)
      rotation.multiply(spin)
      scale.set(
        THREE.MathUtils.lerp(blade.minWidth, blade.maxWidth, random()),
        THREE.MathUtils.lerp(blade.minHeight, blade.maxHeight, random()),
        1,
      )
      matrix.compose(
        samples[index].position.clone().applyMatrix4(worldToGrassLocal),
        rotation,
        scale,
      )
      mesh.setMatrixAt(index, matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    this.bladeCount = samples.length

    if (!initial) {
      this.remove(this.blades)
      this.disposeBladeMesh(this.blades)
    }
    this.blades = mesh
    this.add(mesh)
    this.applyUniforms()
    this.applyShadowOptions()
    this.cacheWorldMatrices()
  }

  private applyUniforms(): void {
    const { wind, colors, brightness, lighting } = this.normalized
    this.uniforms.uWindDirection.value.copy(windDirectionVec2(wind.direction))
    this.uniforms.uWindStrength.value = wind.strength
    this.uniforms.uWindSpeed.value = wind.speed
    this.uniforms.uWindFrequency.value = wind.frequency
    this.uniforms.uWindTurbulence.value = wind.turbulence
    this.uniforms.uWindLean.value = wind.lean
    this.uniforms.uGrassBottom.value.copy(colors.bottom)
    this.uniforms.uGrassTop.value.copy(colors.top)
    this.uniforms.uBacklightColor.value.copy(colors.backlight)
    this.uniforms.uBrightness.value = brightness
    this.uniforms.uLightDirection.value.copy(lighting.direction)
    this.uniforms.uLightColor.value.copy(lighting.color)
    this.uniforms.uLightIntensity.value = lighting.intensity
    this.uniforms.uBacklightStrength.value = lighting.backlightStrength
    this.uniforms.uBacklightPower.value = lighting.backlightPower
    this.uniforms.uBacklightTip.value = lighting.backlightTip
  }

  private applyShadowOptions(): void {
    this.blades.castShadow = this.normalized.shadow
    this.blades.receiveShadow = this.normalized.shadow
  }

  private externalSurfaceTransformChanged(): boolean {
    this.updateWorldMatrix(true, false)
    this.normalized.surface.updateWorldMatrix(true, false)
    return (
      !this.lastGrassWorldMatrix.equals(this.matrixWorld) ||
      !this.lastExternalSurfaceWorldMatrix?.equals(this.normalized.surface.matrixWorld)
    )
  }

  private cacheWorldMatrices(): void {
    this.updateWorldMatrix(true, false)
    this.lastGrassWorldMatrix.copy(this.matrixWorld)
    this.normalized.surface.updateWorldMatrix(true, false)
    if (!this.lastExternalSurfaceWorldMatrix)
      this.lastExternalSurfaceWorldMatrix = new THREE.Matrix4()
    this.lastExternalSurfaceWorldMatrix.copy(this.normalized.surface.matrixWorld)
  }

  private disposeBladeMesh(
    mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.ShaderMaterial>,
  ): void {
    mesh.geometry.dispose()
    // Rebuilt meshes share a single ShaderMaterial, which is released only by dispose().
    if (this.disposed) {
      mesh.material.dispose()
      this.depthMaterial.dispose()
    }
  }
}

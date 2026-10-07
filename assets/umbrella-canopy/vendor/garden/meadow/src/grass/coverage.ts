import * as THREE from 'three'
import type {
  GrassCoverageChannel,
  GrassCoverageOptions,
  GrassCoveragePoint,
  NormalizedGrassCoverageOptions,
} from './types'

const CHANNELS: readonly GrassCoverageChannel[] = ['r', 'g', 'b', 'a']

export function normalizeCoverage(
  input?: GrassCoverageOptions,
): NormalizedGrassCoverageOptions | undefined {
  if (input === undefined) return undefined

  if (typeof input.map === 'string') {
    throw new RangeError('Grass coverage map URLs must be resolved through the Grass facade.')
  }

  const sourceCount =
    Number(input.map !== undefined) +
    Number(input.attribute !== undefined) +
    Number(input.sample !== undefined)
  if (sourceCount > 1) throw new RangeError('Grass coverage accepts only one source.')
  if (sourceCount === 0) throw new RangeError('Grass coverage requires a source.')
  if (input.attribute !== undefined && input.attribute.trim().length === 0) {
    throw new RangeError('Grass coverage attribute must not be empty.')
  }
  if (input.channel !== undefined && !CHANNELS.includes(input.channel)) {
    throw new RangeError('Grass coverage channel must be r, g, b, or a.')
  }
  if (input.threshold !== undefined && !Number.isFinite(input.threshold)) {
    throw new RangeError('Grass coverage threshold must be finite.')
  }
  if (input.power !== undefined && (!Number.isFinite(input.power) || input.power < 0)) {
    throw new RangeError('Grass coverage power must be finite and nonnegative.')
  }

  return Object.freeze({
    map: input.map,
    attribute: input.attribute,
    sample: input.sample,
    channel: input.channel ?? 'r',
    threshold: input.threshold ?? 0,
    power: input.power ?? 1,
  })
}

export function cloneCoverage(coverage?: GrassCoverageOptions): GrassCoverageOptions | undefined {
  return coverage && { ...coverage }
}

export function coverageEquals(
  left?: NormalizedGrassCoverageOptions,
  right?: NormalizedGrassCoverageOptions,
): boolean {
  return (
    left === right ||
    (left?.map === right?.map &&
      left?.attribute === right?.attribute &&
      left?.sample === right?.sample &&
      left?.channel === right?.channel &&
      left?.threshold === right?.threshold &&
      left?.power === right?.power)
  )
}

type CoverageTriangle = readonly [number, number, number]

export type SurfaceCoverageEvaluator = {
  evaluate: (
    triangle: CoverageTriangle,
    weights: readonly [number, number, number],
    position: THREE.Vector3,
    normal: THREE.Vector3,
    seed: number,
  ) => number
  isCallback: boolean
}

function channelIndex(channel: GrassCoverageChannel): number {
  return CHANNELS.indexOf(channel)
}

function attributeComponent(
  attribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  index: number,
  component: number,
): number {
  if (component === 0) return attribute.getX(index)
  if (component === 1) return attribute.getY(index)
  if (component === 2) return attribute.getZ(index)
  return attribute.getW(index)
}

function transformCoverage(value: number, threshold: number, power: number): number {
  const clamped = THREE.MathUtils.clamp(value, 0, 1)
  if (clamped <= threshold) return 0
  if (threshold >= 1) return 0
  return Math.pow(THREE.MathUtils.clamp((clamped - threshold) / (1 - threshold), 0, 1), power)
}

type TexturePixels = {
  data: ArrayBufferView
  width: number
  height: number
  channels: number
  sourceVersion: number
}

const texturePixels = new WeakMap<THREE.Texture, TexturePixels>()

function dataTexturePixels(map: THREE.DataTexture): TexturePixels | undefined {
  const image = map.image as { data?: ArrayBufferView; height?: number; width?: number }
  const { data, height, width } = image
  if (!data || !width || !height) return undefined
  const values = data as unknown as { [index: number]: number; length: number }
  const channels = values.length / (width * height)
  if (!Number.isInteger(channels)) return undefined
  return { data, width, height, channels, sourceVersion: map.source.version }
}

function canvasTexturePixels(map: THREE.Texture): TexturePixels | undefined {
  const image = map.image as CanvasImageSource | undefined
  const dimensions = image as
    | (CanvasImageSource & {
        naturalWidth?: number
        naturalHeight?: number
        videoWidth?: number
        videoHeight?: number
        width?: number
        height?: number
      })
    | undefined
  const width = dimensions?.naturalWidth ?? dimensions?.videoWidth ?? dimensions?.width ?? 0
  const height = dimensions?.naturalHeight ?? dimensions?.videoHeight ?? dimensions?.height ?? 0
  if (!image || !width || !height || typeof document === 'undefined') return undefined

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new RangeError('Grass coverage map could not create a readable canvas.')
  try {
    context.drawImage(image, 0, 0, width, height)
    const pixels = context.getImageData(0, 0, width, height)
    return { data: pixels.data, width, height, channels: 4, sourceVersion: map.source.version }
  } catch (error) {
    throw new RangeError(
      `Grass coverage map pixels could not be read. Ensure its image is loaded and CORS-readable. (${error instanceof Error ? error.message : 'unknown error'})`,
    )
  }
}

function readableTexturePixels(map: THREE.Texture): TexturePixels | undefined {
  if (map instanceof THREE.DataTexture) return dataTexturePixels(map)
  const cached = texturePixels.get(map)
  if (cached?.sourceVersion === map.source.version) return cached
  const pixels = canvasTexturePixels(map)
  if (pixels) texturePixels.set(map, pixels)
  return pixels
}

function textureValue(map: THREE.Texture, uv: THREE.Vector2, component: number): number {
  const pixels = readableTexturePixels(map)
  // URL-backed textures are constructed before their image is decoded. Treat
  // them as empty until Grass refreshes the layout after loading completes.
  if (!pixels) return 0
  const { data, height, width, channels } = pixels
  if (component >= channels) throw new RangeError('Grass coverage map channel is not available.')
  const x = Math.min(width - 1, Math.max(0, Math.floor(uv.x * width)))
  const y = Math.min(height - 1, Math.max(0, Math.floor(uv.y * height)))
  const values = data as unknown as { [index: number]: number }
  const value = values[(y * width + x) * channels + component]
  return normalizedTextureValue(data, value)
}

function normalizedTextureValue(data: ArrayBufferView, value: number): number {
  if (data instanceof Uint8Array || data instanceof Uint8ClampedArray) return value / 255
  if (data instanceof Uint16Array) return value / 65535
  return value
}

/**
 * Returns a whole-texture coverage average when pixels are readable. This is
 * used only as a non-zero fallback when sparse map coverage misses all area
 * probes on a coarse mesh.
 */
export function mapCoverageAverage(coverage?: NormalizedGrassCoverageOptions): number | undefined {
  if (!coverage?.map) return undefined
  const pixels = readableTexturePixels(coverage.map)
  if (!pixels) return undefined
  const component = channelIndex(coverage.channel)
  if (component >= pixels.channels) {
    throw new RangeError('Grass coverage map channel is not available.')
  }
  const values = pixels.data as unknown as { [index: number]: number }
  const pixelCount = pixels.width * pixels.height
  let total = 0
  for (let index = 0; index < pixelCount; index += 1) {
    total += transformCoverage(
      normalizedTextureValue(pixels.data, values[index * pixels.channels + component]),
      coverage.threshold,
      coverage.power,
    )
  }
  return total / pixelCount
}

export function createSurfaceCoverageEvaluator(
  surface: THREE.Mesh,
  coverage?: NormalizedGrassCoverageOptions,
): SurfaceCoverageEvaluator | undefined {
  if (!coverage) return undefined

  const position = surface.geometry.getAttribute('position')
  if (!position) throw new RangeError('Grass coverage surface must have position geometry.')
  const component = channelIndex(coverage.channel)
  const uvAttribute = surface.geometry.getAttribute('uv')
  if (coverage.map && (!uvAttribute || uvAttribute.itemSize < 2)) {
    throw new RangeError('Grass coverage map requires a surface uv attribute.')
  }
  if (coverage.map) {
    const pixels = readableTexturePixels(coverage.map)
    if (pixels && component >= pixels.channels) {
      throw new RangeError('Grass coverage map channel is not available.')
    }
  }
  const sourceAttribute = coverage.attribute
    ? surface.geometry.getAttribute(coverage.attribute)
    : undefined
  if (coverage.attribute && !sourceAttribute) {
    throw new RangeError(`Grass coverage attribute "${coverage.attribute}" was not found.`)
  }
  if (sourceAttribute && component >= sourceAttribute.itemSize) {
    throw new RangeError('Grass coverage attribute channel is not available.')
  }

  const evaluate = (
    triangle: CoverageTriangle,
    weights: readonly [number, number, number],
    worldPosition: THREE.Vector3,
    normal: THREE.Vector3,
    seed: number,
  ): number => {
    const [first, second, third] = triangle
    const [w, u, v] = weights
    let raw: number
    let uv: THREE.Vector2 | null = null
    if (uvAttribute) {
      uv = new THREE.Vector2(
        uvAttribute.getX(first) * w + uvAttribute.getX(second) * u + uvAttribute.getX(third) * v,
        uvAttribute.getY(first) * w + uvAttribute.getY(second) * u + uvAttribute.getY(third) * v,
      )
    }

    if (coverage.map) {
      if (!uv) throw new RangeError('Grass coverage map requires a surface uv attribute.')
      raw = textureValue(coverage.map, coverage.map.transformUv(uv), component)
    } else if (sourceAttribute) {
      raw =
        attributeComponent(sourceAttribute, first, component) * w +
        attributeComponent(sourceAttribute, second, component) * u +
        attributeComponent(sourceAttribute, third, component) * v
    } else {
      const point: GrassCoveragePoint = {
        position: worldPosition.clone(),
        normal: normal.clone(),
        uv: uv?.clone() ?? null,
        seed,
      }
      raw = coverage.sample!(point)
      if (!Number.isFinite(raw))
        throw new RangeError('Grass coverage callback must return a finite number.')
    }

    return transformCoverage(raw, coverage.threshold, coverage.power)
  }

  return { evaluate, isCallback: coverage.sample !== undefined }
}

/** Throws when a coverage source cannot be used with the supplied surface. */
export function validateSurfaceCoverage(
  surface: THREE.Mesh | undefined,
  coverage?: NormalizedGrassCoverageOptions,
): void {
  if (!surface || !coverage) return
  createSurfaceCoverageEvaluator(surface, coverage)
}

import * as THREE from 'three'
import { createSurfaceCoverageEvaluator, mapCoverageAverage, normalizeCoverage } from './coverage'
import type { GrassCoverageOptions, NormalizedGrassCoverageOptions } from './types'
import { seededRandom } from './utils'

export type SurfaceSampler = {
  cumulativeAreas: number[]
  normals: number[]
  totalArea: number
  triangles: [number, number, number][]
  vertices: number[]
}

export type SurfaceLayout = {
  sampler: SurfaceSampler
  coveredArea: number
  totalArea: number
}

export interface SurfaceSample {
  position: THREE.Vector3
  normal: THREE.Vector3
}

function buildSurfaceSampler(surface: THREE.Mesh): SurfaceSampler {
  surface.updateWorldMatrix(true, false)

  const position = surface.geometry.getAttribute('position')
  const index = surface.geometry.index
  const vertices: number[] = []
  const normals: number[] = []
  const cumulativeAreas: number[] = []
  const triangles: [number, number, number][] = []
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const cross = new THREE.Vector3()
  const triangleCount = Math.floor((index?.count ?? position?.count ?? 0) / 3)
  let totalArea = 0

  if (!position) {
    return { vertices, normals, cumulativeAreas, totalArea, triangles }
  }

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const offset = triangle * 3
    const first = index ? index.getX(offset) : offset
    const second = index ? index.getX(offset + 1) : offset + 1
    const third = index ? index.getX(offset + 2) : offset + 2

    a.fromBufferAttribute(position, first).applyMatrix4(surface.matrixWorld)
    b.fromBufferAttribute(position, second).applyMatrix4(surface.matrixWorld)
    c.fromBufferAttribute(position, third).applyMatrix4(surface.matrixWorld)

    const doubleArea = cross.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)).length()
    if (doubleArea < 1e-8) {
      continue
    }

    totalArea += doubleArea * 0.5
    cumulativeAreas.push(totalArea)
    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
    normals.push(cross.x / doubleArea, cross.y / doubleArea, cross.z / doubleArea)
    triangles.push([first, second, third])
  }

  return { vertices, normals, cumulativeAreas, totalArea, triangles }
}

/** Returns the world-space surface area of a mesh. */
export function surfaceArea(surface: THREE.Mesh): number {
  surface.updateWorldMatrix(true, false)
  const position = surface.geometry.getAttribute('position')
  if (!position) return 0
  const index = surface.geometry.index
  const triangleCount = Math.floor((index?.count ?? position.count) / 3)
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const cross = new THREE.Vector3()
  let area = 0
  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const offset = triangle * 3
    const first = index ? index.getX(offset) : offset
    const second = index ? index.getX(offset + 1) : offset + 1
    const third = index ? index.getX(offset + 2) : offset + 2
    a.fromBufferAttribute(position, first).applyMatrix4(surface.matrixWorld)
    b.fromBufferAttribute(position, second).applyMatrix4(surface.matrixWorld)
    c.fromBufferAttribute(position, third).applyMatrix4(surface.matrixWorld)
    area += cross.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a)).length() * 0.5
  }
  return area
}

function samplePoint(
  sampler: SurfaceSampler,
  random: () => number,
): { sample: SurfaceSample; triangleIndex: number; weights: [number, number, number] } {
  const targetArea = random() * sampler.totalArea
  let low = 0
  let high = sampler.cumulativeAreas.length - 1

  while (low < high) {
    const middle = (low + high) >> 1
    if (sampler.cumulativeAreas[middle] < targetArea) {
      low = middle + 1
    } else {
      high = middle
    }
  }

  let u = random()
  let v = random()
  if (u + v > 1) {
    u = 1 - u
    v = 1 - v
  }
  const w = 1 - u - v
  const offset = low * 9

  const position = new THREE.Vector3(
    sampler.vertices[offset] * w +
      sampler.vertices[offset + 3] * u +
      sampler.vertices[offset + 6] * v,
    sampler.vertices[offset + 1] * w +
      sampler.vertices[offset + 4] * u +
      sampler.vertices[offset + 7] * v,
    sampler.vertices[offset + 2] * w +
      sampler.vertices[offset + 5] * u +
      sampler.vertices[offset + 8] * v,
  )
  const normal = new THREE.Vector3(
    sampler.normals[low * 3],
    sampler.normals[low * 3 + 1],
    sampler.normals[low * 3 + 2],
  )
  return {
    sample: { position, normal },
    triangleIndex: low,
    weights: [w, u, v],
  }
}

const COVERAGE_AREA_SAMPLES = 16

function radicalInverse(value: number): number {
  let result = 0
  let factor = 0.5
  let remainder = value
  while (remainder > 0) {
    result += (remainder & 1) * factor
    remainder >>= 1
    factor *= 0.5
  }
  return result
}

function coverageSampleWeights(index: number): [number, number, number] {
  const u = (index + 0.5) / COVERAGE_AREA_SAMPLES
  const v = radicalInverse(index + 1)
  const root = Math.sqrt(u)
  return [1 - root, root * (1 - v), root * v]
}

function coverageArea(
  sampler: SurfaceSampler,
  coverage: NormalizedGrassCoverageOptions | undefined,
  surface?: THREE.Mesh,
): number {
  if (!coverage || !surface) return sampler.totalArea
  const coverageEvaluator = createSurfaceCoverageEvaluator(surface, coverage)
  if (!coverageEvaluator) return sampler.totalArea
  let area = 0
  for (let index = 0; index < sampler.cumulativeAreas.length; index += 1) {
    const triangleArea =
      sampler.cumulativeAreas[index] - (index === 0 ? 0 : sampler.cumulativeAreas[index - 1])
    const offset = index * 9
    const normalOffset = index * 3
    const position = new THREE.Vector3()
    const normal = new THREE.Vector3(
      sampler.normals[normalOffset],
      sampler.normals[normalOffset + 1],
      sampler.normals[normalOffset + 2],
    )
    const evaluateAt = (sampleWeights: [number, number, number], seed: number): number => {
      position.set(
        sampler.vertices[offset] * sampleWeights[0] +
          sampler.vertices[offset + 3] * sampleWeights[1] +
          sampler.vertices[offset + 6] * sampleWeights[2],
        sampler.vertices[offset + 1] * sampleWeights[0] +
          sampler.vertices[offset + 4] * sampleWeights[1] +
          sampler.vertices[offset + 7] * sampleWeights[2],
        sampler.vertices[offset + 2] * sampleWeights[0] +
          sampler.vertices[offset + 5] * sampleWeights[1] +
          sampler.vertices[offset + 8] * sampleWeights[2],
      )
      return coverageEvaluator.evaluate(
        sampler.triangles[index],
        sampleWeights,
        position,
        normal,
        seed,
      )
    }
    let amount = 0
    for (let sample = 0; sample < COVERAGE_AREA_SAMPLES; sample += 1) {
      amount += evaluateAt(coverageSampleWeights(sample), index * COVERAGE_AREA_SAMPLES + sample)
    }
    area += triangleArea * (amount / COVERAGE_AREA_SAMPLES)
  }
  // Fixed triangle probes are deliberately inexpensive, but a small map island
  // can fall between every probe. A readable map's average prevents that case
  // from being treated as definitively empty; rejection sampling refines it.
  if (area === 0) {
    const mapAverage = mapCoverageAverage(coverage)
    if (mapAverage && mapAverage > 0) return sampler.totalArea * mapAverage
  }
  return area
}

/** Builds a surface sampler and the estimated world-space coverage area in one pass. */
export function buildSurfaceLayout(
  surface: THREE.Mesh,
  coverage?: GrassCoverageOptions,
): SurfaceLayout {
  const sampler = buildSurfaceSampler(surface)
  const normalizedCoverage = normalizeCoverage(coverage)
  return {
    sampler,
    coveredArea: coverageArea(sampler, normalizedCoverage, surface),
    totalArea: sampler.totalArea,
  }
}

/** Returns the estimated world-space area where coverage permits vegetation. */
export function surfaceCoverageArea(surface: THREE.Mesh, coverage?: GrassCoverageOptions): number {
  return buildSurfaceLayout(surface, coverage).coveredArea
}

/** Returns deterministic, area-weighted world-space positions and face normals. */
export function sampleSurfaceData(
  surface: THREE.Mesh,
  count: number,
  seed: number,
  coverage?: GrassCoverageOptions,
  layout?: SurfaceLayout,
): SurfaceSample[] {
  const sampleCount = Math.floor(count)
  if (!Number.isFinite(sampleCount) || sampleCount <= 0) {
    return []
  }

  const sampler = layout?.sampler ?? buildSurfaceSampler(surface)
  if (sampler.totalArea === 0) {
    return []
  }

  const random = seededRandom(seed)
  const normalizedCoverage = normalizeCoverage(coverage)
  const coverageEvaluator = createSurfaceCoverageEvaluator(surface, normalizedCoverage)
  const samples: SurfaceSample[] = []
  if (!coverageEvaluator) {
    for (let index = 0; index < sampleCount; index += 1) {
      samples.push(samplePoint(sampler, random).sample)
    }
    return samples
  }
  const coveredArea = layout?.coveredArea ?? coverageArea(sampler, normalizedCoverage, surface)
  if (coveredArea === 0) return []
  const coverageRatio = coveredArea / sampler.totalArea
  const maxAttempts = Math.max(sampleCount * 64, Math.ceil((sampleCount * 4) / coverageRatio), 256)
  for (let attempt = 0; attempt < maxAttempts && samples.length < sampleCount; attempt += 1) {
    const point = samplePoint(sampler, random)
    const coverageAtPoint = coverageEvaluator.evaluate(
      sampler.triangles[point.triangleIndex],
      point.weights,
      point.sample.position,
      point.sample.normal,
      Math.floor(random() * 0x1_0000_0000),
    )
    if (random() <= coverageAtPoint) samples.push(point.sample)
  }

  return samples
}

/**
 * Returns deterministic, area-weighted world-space samples on a mesh surface.
 */
export function sampleSurface(
  surface: THREE.Mesh,
  count: number,
  seed: number,
  coverage?: GrassCoverageOptions,
): THREE.Vector3[] {
  return sampleSurfaceData(surface, count, seed, coverage).map((sample) => sample.position)
}

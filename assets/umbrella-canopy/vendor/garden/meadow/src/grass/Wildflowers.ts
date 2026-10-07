import * as THREE from 'three'
import { normalizeCoverage } from './coverage'
import { DEFAULT_GRASS_OPTIONS } from './defaults'
import { buildSurfaceLayout, sampleSurfaceData } from './surfaceSampler'
import type { GrassCoverageOptions, NormalizedGrassWindOptions } from './types'
import { seededRandom, windDirectionVec2 } from './utils'

import { createMaskTexture, FLOWER_PALETTES, MASK_VARIANTS } from './flowerShapes'

export interface WildflowerOptions {
  surface: THREE.Mesh
  density?: number
  maxCount?: number
  seed?: number
  coverage?: GrassCoverageOptions
  wind?: Readonly<NormalizedGrassWindOptions>
  shadow?: boolean
}

type FlowerUniforms = {
  uMask: THREE.IUniform<THREE.Texture>
  uTime: THREE.IUniform<number>
  uWindStrength: THREE.IUniform<number>
  uWindSpeed: THREE.IUniform<number>
  uWindFrequency: THREE.IUniform<number>
  uWindTurbulence: THREE.IUniform<number>
  uWindLean: THREE.IUniform<number>
  uWindDirection: THREE.IUniform<THREE.Vector2>
}

const flowerWindVertexUniforms = /* glsl */ `
uniform float uTime;
uniform float uWindStrength;
uniform float uWindSpeed;
uniform float uWindFrequency;
uniform float uWindTurbulence;
uniform float uWindLean;
uniform vec2 uWindDirection;
`

const flowerWindVertexTransform = /* glsl */ `
vec3 deformWildflower(vec3 transformed) {
  mat4 instanceWorldMatrix = modelMatrix * instanceMatrix;
  vec3 baseWorldPosition = (instanceWorldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float primaryWave = sin(dot(baseWorldPosition.xz, uWindDirection) * uWindFrequency + uTime * uWindSpeed);
  vec2 perpendicular = vec2(-uWindDirection.y, uWindDirection.x);
  float secondaryWave = sin(dot(baseWorldPosition.xz, perpendicular) * uWindFrequency * 1.7 + uTime * uWindSpeed * 0.73) * uWindTurbulence;
  vec3 worldWind = vec3(uWindDirection.x, 0.0, uWindDirection.y)
    * ((primaryWave + secondaryWave) * uWindStrength + uWindLean);

  vec3 axisX = vec3(instanceWorldMatrix[0]);
  vec3 axisY = vec3(instanceWorldMatrix[1]);
  vec3 axisZ = vec3(instanceWorldMatrix[2]);
  vec3 localWind = vec3(
    dot(worldWind, axisX) / max(dot(axisX, axisX), 0.00001),
    dot(worldWind, axisY) / max(dot(axisY, axisY), 0.00001),
    dot(worldWind, axisZ) / max(dot(axisZ, axisZ), 0.00001)
  );
  float tipMask = uv.y * uv.y;
  return transformed + localWind * tipMask * 0.45;
}
`

const flowerVertexShader = /* glsl */ `
${flowerWindVertexUniforms}
${flowerWindVertexTransform}

attribute float aVariant;
attribute vec3 aPetalColor;
attribute vec3 aFoliageColor;
attribute vec3 aCentreColor;
varying vec2 vMaskUv;
varying vec3 vPetalColor;
varying vec3 vFoliageColor;
varying vec3 vCentreColor;

void main() {
  vMaskUv = vec2((uv.x + aVariant) / ${MASK_VARIANTS.toFixed(1)}, uv.y);
  vPetalColor = aPetalColor;
  vFoliageColor = aFoliageColor;
  vCentreColor = aCentreColor;

  vec3 transformed = deformWildflower(position);
  mat4 instanceWorldMatrix = modelMatrix * instanceMatrix;
  vec4 worldPosition = instanceWorldMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

const flowerFragmentShader = /* glsl */ `
uniform sampler2D uMask;
varying vec2 vMaskUv;
varying vec3 vPetalColor;
varying vec3 vFoliageColor;
varying vec3 vCentreColor;

void main() {
  vec4 mask = texture2D(uMask, vMaskUv);
  if (mask.a < 0.28) discard;

  vec3 color = mask.r * vPetalColor
    + mask.g * vFoliageColor
    + mask.b * vCentreColor;
  gl_FragColor = vec4(color, mask.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

function variedColor(
  color: THREE.Color,
  random: () => number,
  hue: number,
  saturation: number,
  lightness: number,
): THREE.Color {
  return color
    .clone()
    .offsetHSL((random() - 0.5) * hue, (random() - 0.5) * saturation, (random() - 0.5) * lightness)
}

function writeColor(colors: Float32Array, index: number, color: THREE.Color): void {
  const offset = index * 3
  colors[offset] = color.r
  colors[offset + 1] = color.g
  colors[offset + 2] = color.b
}

function createFlowerAttributes(
  count: number,
  random: () => number,
): {
  variants: Float32Array
  petalColors: Float32Array
  foliageColors: Float32Array
  centreColors: Float32Array
} {
  const variants = new Float32Array(count)
  const petalColors = new Float32Array(count * 3)
  const foliageColors = new Float32Array(count * 3)
  const centreColors = new Float32Array(count * 3)
  for (let index = 0; index < count; index += 1) {
    const palette = FLOWER_PALETTES[Math.floor(random() * FLOWER_PALETTES.length)]
    variants[index] = (index + Math.floor(random() * MASK_VARIANTS)) % MASK_VARIANTS
    writeColor(petalColors, index, variedColor(palette.petal, random, 0.06, 0.1, 0.08))
    writeColor(foliageColors, index, variedColor(palette.foliage, random, 0.025, 0.06, 0.04))
    writeColor(centreColors, index, variedColor(palette.centre, random, 0.04, 0.08, 0.06))
  }
  return { variants, petalColors, foliageColors, centreColors }
}

function createCardGeometry(
  attributes: ReturnType<typeof createFlowerAttributes>,
): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(1, 1)
  geometry.translate(0, 0.5, 0)
  geometry.setAttribute('aVariant', new THREE.InstancedBufferAttribute(attributes.variants, 1))
  geometry.setAttribute(
    'aPetalColor',
    new THREE.InstancedBufferAttribute(attributes.petalColors, 3),
  )
  geometry.setAttribute(
    'aFoliageColor',
    new THREE.InstancedBufferAttribute(attributes.foliageColors, 3),
  )
  geometry.setAttribute(
    'aCentreColor',
    new THREE.InstancedBufferAttribute(attributes.centreColors, 3),
  )
  return geometry
}

function createFlowerUniforms(mask: THREE.Texture): FlowerUniforms {
  return {
    uMask: { value: mask },
    uTime: { value: 0 },
    uWindStrength: { value: 0 },
    uWindSpeed: { value: 0 },
    uWindFrequency: { value: 0 },
    uWindTurbulence: { value: 0 },
    uWindLean: { value: 0 },
    uWindDirection: { value: new THREE.Vector2() },
  }
}

function createFlowerMaterial(uniforms: FlowerUniforms): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: flowerVertexShader,
    fragmentShader: flowerFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    alphaTest: 0.28,
    depthWrite: true,
    toneMapped: true,
  })
  // WebGLShadowMap copies `material.map` onto custom depth materials at render time.
  Object.assign(material, { map: uniforms.uMask.value })
  return material
}

function createFlowerDepthMaterial(uniforms: FlowerUniforms): THREE.MeshDepthMaterial {
  const material = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: uniforms.uMask.value,
    alphaTest: 0.28,
    side: THREE.DoubleSide,
  })
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>\n${flowerWindVertexUniforms}\nattribute float aVariant;`,
    )
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `${flowerWindVertexTransform}\nvoid main() {`,
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
      `#include <uv_vertex>
      #ifdef USE_MAP
        vMapUv = vec2((uv.x + aVariant) / ${MASK_VARIANTS.toFixed(1)}, uv.y);
      #endif`,
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\ntransformed = deformWildflower(transformed);`,
    )
  }
  material.customProgramCacheKey = () => 'wildflower-wind-depth-v1'
  return material
}

export class Wildflowers extends THREE.Group {
  flowers!: THREE.InstancedMesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  count = 0
  private readonly uniforms: FlowerUniforms
  private readonly depthMaterial: THREE.MeshDepthMaterial
  private disposed = false

  constructor(options: WildflowerOptions) {
    super()
    const density = options.density ?? 0.75
    const maxCount = options.maxCount ?? 260
    const seed = options.seed ?? 29
    const coverage = normalizeCoverage(options.coverage)
    if (!Number.isFinite(density) || density < 0 || !Number.isInteger(maxCount) || maxCount < 0) {
      throw new RangeError('Wildflower density and maximum count must be nonnegative.')
    }

    const layout = buildSurfaceLayout(options.surface, coverage)
    const requested = Math.min(maxCount, Math.round(layout.coveredArea * density))
    const samples = sampleSurfaceData(options.surface, requested, seed, coverage, layout)
    this.count = samples.length

    const random = seededRandom(seed ^ 0x85ebca6b)
    const attributes = createFlowerAttributes(this.count, random)

    this.uniforms = createFlowerUniforms(createMaskTexture())
    this.depthMaterial = createFlowerDepthMaterial(this.uniforms)
    this.flowers = new THREE.InstancedMesh(
      createCardGeometry(attributes),
      createFlowerMaterial(this.uniforms),
      this.count,
    )
    this.flowers.frustumCulled = false
    this.flowers.customDepthMaterial = this.depthMaterial
    this.setShadow(options.shadow ?? DEFAULT_GRASS_OPTIONS.shadow)
    this.setWind(options.wind ?? DEFAULT_GRASS_OPTIONS.wind)

    this.updateWorldMatrix(true, false)
    const worldToLocal = this.matrixWorld.clone().invert()
    const up = new THREE.Vector3(0, 1, 0)
    const root = new THREE.Vector3()
    const localNormal = new THREE.Vector3()
    const rotation = new THREE.Quaternion()
    const spin = new THREE.Quaternion()
    const matrix = new THREE.Matrix4()
    const scale = new THREE.Vector3()

    for (let index = 0; index < samples.length; index += 1) {
      const height = THREE.MathUtils.lerp(0.32, 0.72, random())
      root.copy(samples[index].position).applyMatrix4(worldToLocal)
      localNormal.copy(samples[index].normal).transformDirection(worldToLocal).normalize()
      rotation.setFromUnitVectors(up, localNormal)
      spin.setFromAxisAngle(up, random() * Math.PI * 2)
      rotation.multiply(spin)
      matrix.compose(
        root,
        rotation,
        scale.set(height * THREE.MathUtils.lerp(0.45, 0.62, random()), height, 1),
      )
      this.flowers.setMatrixAt(index, matrix)
    }
    this.flowers.instanceMatrix.needsUpdate = true
    this.add(this.flowers)
  }

  update(timeSeconds: number): void {
    if (!Number.isFinite(timeSeconds))
      throw new RangeError('Wildflower update time must be finite.')
    if (this.disposed) return
    this.uniforms.uTime.value = timeSeconds
  }

  setWind(wind: Readonly<NormalizedGrassWindOptions>): void {
    if (this.disposed) return
    this.uniforms.uWindDirection.value.copy(windDirectionVec2(wind.direction))
    this.uniforms.uWindTurbulence.value = wind.turbulence
    this.uniforms.uWindFrequency.value = wind.frequency
    this.uniforms.uWindSpeed.value = wind.speed
    this.uniforms.uWindStrength.value = wind.strength
    this.uniforms.uWindLean.value = wind.lean
  }

  setShadow(enabled: boolean): void {
    if (this.disposed) return
    this.flowers.castShadow = enabled
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.remove(this.flowers)
    this.flowers.geometry.dispose()
    this.flowers.material.uniforms.uMask.value.dispose()
    this.flowers.material.dispose()
    this.depthMaterial.dispose()
    this.clear()
    this.count = 0
  }
}

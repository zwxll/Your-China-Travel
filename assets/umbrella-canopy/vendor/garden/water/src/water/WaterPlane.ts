import * as THREE from 'three';
import {
  WATER_FOAM_CAPACITY,
  WATER_FRAGMENT,
  WATER_RIPPLE_CAPACITY,
  WATER_VERTEX,
} from './waterShader.glsl';
import { WaterMask } from './WaterMask';
import { WaterNoiseLUT } from './WaterNoiseLUT';

export interface WaterPlaneOptions {
  /** Edge length of the water quad in world units. Default 80. */
  size?: number;
  /** Tessellation. 128×128 is plenty for terrain conformance. Default 128. */
  segments?: number;
  /** Y offset above the terrain heightmap value. Default 0.01. */
  surfaceOffset?: number;
  /** A pre-built {@link WaterMask}. If omitted, the whole plane is full water. */
  mask?: WaterMask;
  /** A pre-built {@link WaterNoiseLUT}. If omitted, one is generated procedurally. */
  noiseLUT?: WaterNoiseLUT;
  /** Deep water tint. Default `#0e2a3d`. */
  deepColor?: THREE.Color;
  /** Shallow / shoreline tint. Default `#3d8a8f`. */
  shallowColor?: THREE.Color;
  /** Sky low-band color used for reflections. Default RGB(0.5, 0.6, 0.7). */
  skyLowColor?: THREE.Color;
  /** Sky high-band color used for reflections. Default RGB(0.75, 0.88, 1.0). */
  skyHighColor?: THREE.Color;
  /** Sun direction (will be normalized). Default (0.44, 0.78, 0.45). */
  sunDirection?: THREE.Vector3;
}

const DEFAULTS: Required<Omit<WaterPlaneOptions, 'mask' | 'noiseLUT'>> & {
  mask: WaterMask | null;
  noiseLUT: WaterNoiseLUT | null;
} = {
  size: 80,
  segments: 128,
  surfaceOffset: 0.01,
  deepColor: new THREE.Color(0x0e2a3d),
  shallowColor: new THREE.Color(0x3d8a8f),
  skyLowColor: new THREE.Color(0.5, 0.6, 0.7),
  skyHighColor: new THREE.Color(0.75, 0.88, 1.0),
  sunDirection: new THREE.Vector3(0.44, 0.78, 0.45),
  mask: null,
  noiseLUT: null,
};

/**
 * A self-contained stylized water plane.
 *
 * Owns a mask, a noise LUT (lazily created), and a `THREE.ShaderMaterial`.
 * Drop into any scene, then call `update(time)` per frame.
 *
 * ```ts
 * const water = new WaterPlane({ size: 80 });
 * water.mask.paintCircle(0, 0, 12);
 * scene.add(water.mesh);
 * function tick(t: number) { water.update(t); }
 * ```
 */
export class WaterPlane {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.ShaderMaterial;
  readonly mask: WaterMask;
  readonly noiseLUT: WaterNoiseLUT;
  private readonly opts: typeof DEFAULTS;
  private readonly geometry: THREE.PlaneGeometry;

  constructor(options: WaterPlaneOptions = {}) {
    this.opts = { ...DEFAULTS, ...options };
    this.mask = this.opts.mask ?? new WaterMask(512, this.opts.size);
    this.noiseLUT = this.opts.noiseLUT ?? new WaterNoiseLUT(256);

    const flatTerrain = createFlatHeightTexture();

    this.material = new THREE.ShaderMaterial({
      vertexShader: WATER_VERTEX,
      fragmentShader: WATER_FRAGMENT,
      lights: true,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        {
          time:                { value: 0 },
          waterMask:           { value: this.mask.getTexture() },
          noiseLUT:            { value: this.noiseLUT.getTexture() },
          deepColor:           { value: new THREE.Vector3(this.opts.deepColor.r, this.opts.deepColor.g, this.opts.deepColor.b) },
          shallowColor:        { value: new THREE.Vector3(this.opts.shallowColor.r, this.opts.shallowColor.g, this.opts.shallowColor.b) },
          sunDirection:        { value: this.opts.sunDirection.clone().normalize() },
          skyLowColor:         { value: new THREE.Vector3(this.opts.skyLowColor.r, this.opts.skyLowColor.g, this.opts.skyLowColor.b) },
          skyHighColor:        { value: new THREE.Vector3(this.opts.skyHighColor.r, this.opts.skyHighColor.g, this.opts.skyHighColor.b) },
          maskWorldExtent:     { value: this.mask.worldExtent },
          rippleSources:       { value: new Float32Array(WATER_RIPPLE_CAPACITY * 4) },
          rippleCount:         { value: 0 },
          rippleBoost:         { value: 6.0 },
          flowSpeed:           { value: 3.0 },
          specularPower:       { value: 256 },
          specularIntensity:   { value: 0.8 },
          reflectionStrength:  { value: 0.25 },
          shoreGlow:           { value: 0.08 },
          waterOpacity:        { value: 0.92 },
          uTerrainHeightmap:   { value: flatTerrain },
          uTerrainWorldSize:   { value: this.opts.size },
          waterSurfaceOffset:  { value: this.opts.surfaceOffset },
          foamSources:         { value: new Float32Array(WATER_FOAM_CAPACITY * 3) },
          foamCount:           { value: 0 },
        },
      ]),
    });

    this.geometry = new THREE.PlaneGeometry(this.opts.size, this.opts.size, this.opts.segments, this.opts.segments);
    this.geometry.rotateX(-Math.PI / 2);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 0.005;
    this.mesh.renderOrder = 2;
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
    this.mesh.name = 'water-plane';
  }

  /** Bind a terrain heightmap so the surface dips into valleys. */
  setTerrainHeightTexture(tex: THREE.Texture, worldSize: number): void {
    this.material.uniforms.uTerrainHeightmap.value = tex;
    this.material.uniforms.uTerrainWorldSize.value = worldSize;
  }

  /** Spawn a ripple at a world-space position; auto-fades over ~1.8 s. */
  spawnRipple(x: number, z: number, time: number, strength = 1): void {
    const arr = this.material.uniforms.rippleSources.value as Float32Array;
    const count = this.material.uniforms.rippleCount.value as number;

    let slot = -1;
    for (let i = 0; i < WATER_RIPPLE_CAPACITY; i++) {
      const s = arr[i * 4 + 1];
      if (time - s > 1.8 || arr[i * 4 + 3] < 0.001) { slot = i; break; }
    }
    if (slot < 0) slot = (count) % WATER_RIPPLE_CAPACITY;
    const base = slot * 4;
    arr[base + 0] = x;
    arr[base + 1] = time;
    arr[base + 2] = z;
    arr[base + 3] = strength;
    this.material.uniforms.rippleCount.value = Math.max(count, slot + 1);
  }

  /**
   * Set foam sources (e.g. where rocks pierce the surface).
   * `data` is a flat array of [x, z, radius] triplets.
   */
  setFoamSources(data: Float32Array, count: number): void {
    const dst = this.material.uniforms.foamSources.value as Float32Array;
    const n = Math.min(count, WATER_FOAM_CAPACITY);
    dst.set(data.subarray(0, n * 3));
    this.material.uniforms.foamCount.value = n;
  }

  setSunDirection(dir: THREE.Vector3): void {
    (this.material.uniforms.sunDirection.value as THREE.Vector3).copy(dir).normalize();
  }

  setSkyColors(low: THREE.Color, high: THREE.Color): void {
    (this.material.uniforms.skyLowColor.value as THREE.Vector3).set(low.r, low.g, low.b);
    (this.material.uniforms.skyHighColor.value as THREE.Vector3).set(high.r, high.g, high.b);
  }

  setColors(deep: THREE.Color, shallow: THREE.Color): void {
    (this.material.uniforms.deepColor.value as THREE.Vector3).set(deep.r, deep.g, deep.b);
    (this.material.uniforms.shallowColor.value as THREE.Vector3).set(shallow.r, shallow.g, shallow.b);
  }

  setFlowSpeed(value: number): void { this.material.uniforms.flowSpeed.value = value; }
  setRippleBoost(value: number): void { this.material.uniforms.rippleBoost.value = value; }
  setReflectionStrength(value: number): void { this.material.uniforms.reflectionStrength.value = value; }
  setShoreGlow(value: number): void { this.material.uniforms.shoreGlow.value = value; }
  setOpacity(value: number): void { this.material.uniforms.waterOpacity.value = value; }
  setSpecular(power: number, intensity: number): void {
    this.material.uniforms.specularPower.value = power;
    this.material.uniforms.specularIntensity.value = intensity;
  }

  /** Advance the shader clock. Call once per frame. */
  update(timeSeconds: number): void {
    this.material.uniforms.time.value = timeSeconds;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    if (!this.opts.mask) this.mask.dispose();
    if (!this.opts.noiseLUT) this.noiseLUT.dispose();
  }
}

function createFlatHeightTexture(): THREE.DataTexture {
  const tex = new THREE.DataTexture(
    new Float32Array([0]),
    1,
    1,
    THREE.RedFormat,
    THREE.FloatType,
  );
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

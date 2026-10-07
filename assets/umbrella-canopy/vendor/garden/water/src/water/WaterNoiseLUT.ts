import * as THREE from 'three';

/**
 * Pre-computed value-noise lookup texture with packed derivatives.
 *
 * Pixel layout (RGBA, 8-bit):
 *   R = noise value
 *   G = ∂/∂x  (encoded around 0.5 — subtract 0.5 in the shader)
 *   B = ∂/∂y  (encoded around 0.5 — subtract 0.5 in the shader)
 *   A = 1.0
 *
 * Generated entirely on the CPU at construction so there is no fetch and
 * no external asset required.
 */
export class WaterNoiseLUT {
  private texture: THREE.DataTexture;

  constructor(resolution = 256, seed = 1337) {
    const data = generateNoiseLUT(resolution, seed);
    this.texture = new THREE.DataTexture(
      data as unknown as BufferSource,
      resolution,
      resolution,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.generateMipmaps = true;
    this.texture.needsUpdate = true;
  }

  getTexture(): THREE.DataTexture {
    return this.texture;
  }

  dispose(): void {
    this.texture.dispose();
  }
}

function generateNoiseLUT(res: number, seed: number): Uint8Array {
  // Build a base random scalar field, then smooth with a 4x4 B-spline kernel
  // for soft, low-frequency variation. Derivatives use centred differences.
  const random = new Float32Array(res * res);
  let s = seed >>> 0;
  for (let i = 0; i < random.length; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    random[i] = (s & 0xffff) / 0xffff;
  }

  const smoothed = new Float32Array(res * res);
  for (let y = 0; y < res; y++) {
    for (let x = 0; x < res; x++) {
      smoothed[y * res + x] = bicubicSample(random, res, x + 0.5, y + 0.5);
    }
  }

  const data = new Uint8Array(res * res * 4);
  for (let y = 0; y < res; y++) {
    for (let x = 0; x < res; x++) {
      const c = smoothed[y * res + x];
      const xR = (x + 1) % res;
      const xL = (x - 1 + res) % res;
      const yU = (y + 1) % res;
      const yD = (y - 1 + res) % res;
      const dx = (smoothed[y * res + xR] - smoothed[y * res + xL]) * (-1.0 / 3.0);
      const dy = (smoothed[yU * res + x] - smoothed[yD * res + x]) * (-1.0 / 3.0);

      const idx = (y * res + x) * 4;
      data[idx + 0] = Math.round(clamp01(c) * 255);
      data[idx + 1] = Math.round(clamp01(dx + 0.5) * 255);
      data[idx + 2] = Math.round(clamp01(dy + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  return data;
}

function bicubicSample(field: Float32Array, size: number, fx: number, fy: number): number {
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const dx = fx - ix;
  const dy = fy - iy;
  let value = 0;
  for (let ky = -1; ky <= 2; ky++) {
    const wy = bsplineWeight(dy - ky);
    const sy = ((iy + ky) % size + size) % size;
    for (let kx = -1; kx <= 2; kx++) {
      const wx = bsplineWeight(dx - kx);
      const sx = ((ix + kx) % size + size) % size;
      value += field[sy * size + sx] * wx * wy;
    }
  }
  return value;
}

function bsplineWeight(t: number): number {
  const at = Math.abs(t);
  if (at < 1) return (3 * at * at * at - 6 * at * at + 4) / 6;
  if (at < 2) {
    const v = 2 - at;
    return (v * v * v) / 6;
  }
  return 0;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

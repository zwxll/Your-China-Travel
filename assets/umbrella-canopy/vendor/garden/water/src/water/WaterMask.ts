import * as THREE from 'three';

/**
 * Painted world-space water mask.
 *
 * Stores a [0..1] water-presence field in a square area of `worldExtent`
 * world units. Use `paintCircle` / `paintCapsule` to carve pond and river
 * shapes — the shoreline noise in the water shader gives them soft, natural
 * edges automatically.
 */
export class WaterMask {
  readonly resolution: number;
  readonly worldExtent: number;
  private data: Float32Array;
  private texture: THREE.DataTexture;

  constructor(resolution = 512, worldExtent = 80) {
    this.resolution = resolution;
    this.worldExtent = worldExtent;
    this.data = new Float32Array(resolution * resolution * 4);
    this.texture = new THREE.DataTexture(
      this.data as unknown as BufferSource,
      resolution,
      resolution,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.needsUpdate = true;
  }

  /** Three.js texture suitable for binding to the water shader's `waterMask` uniform. */
  getTexture(): THREE.DataTexture {
    return this.texture;
  }

  /** Reset the mask to fully dry. */
  clear(): void {
    this.data.fill(0);
    this.texture.needsUpdate = true;
  }

  /**
   * Paint a soft-edged circular pond at world position (cx, cz) with the
   * given radius and edge falloff.
   */
  paintCircle(cx: number, cz: number, radius: number, blur = 1.5): void {
    const res = this.resolution;
    const half = this.worldExtent * 0.5;
    const texel = this.worldExtent / res;
    const margin = radius + blur;

    const x0 = Math.max(0, Math.floor((cx - margin + half) / texel));
    const x1 = Math.min(res - 1, Math.ceil((cx + margin + half) / texel));
    const z0 = Math.max(0, Math.floor((cz - margin + half) / texel));
    const z1 = Math.min(res - 1, Math.ceil((cz + margin + half) / texel));

    for (let iz = z0; iz <= z1; iz++) {
      const wz = iz * texel - half + texel * 0.5;
      for (let ix = x0; ix <= x1; ix++) {
        const wx = ix * texel - half + texel * 0.5;
        const d = Math.hypot(wx - cx, wz - cz);
        const v = 1.0 - smoothstep(radius - blur * 0.5, radius + blur, d);
        const idx = (iz * res + ix) * 4;
        if (v > this.data[idx]) {
          this.data[idx] = v;
          this.data[idx + 1] = v;
          this.data[idx + 2] = v;
          this.data[idx + 3] = 1.0;
        }
      }
    }
    this.texture.needsUpdate = true;
  }

  /**
   * Paint a capsule (rounded rectangle) — useful for rivers and channels.
   * `halfWidth` is the river half-thickness, `blur` is the soft falloff.
   */
  paintCapsule(
    ax: number, az: number,
    bx: number, bz: number,
    halfWidth: number,
    blur = 1.5,
  ): void {
    const res = this.resolution;
    const half = this.worldExtent * 0.5;
    const texel = this.worldExtent / res;
    const margin = halfWidth + blur;

    const minWX = Math.min(ax, bx) - margin;
    const maxWX = Math.max(ax, bx) + margin;
    const minWZ = Math.min(az, bz) - margin;
    const maxWZ = Math.max(az, bz) + margin;

    const x0 = Math.max(0, Math.floor((minWX + half) / texel));
    const x1 = Math.min(res - 1, Math.ceil((maxWX + half) / texel));
    const z0 = Math.max(0, Math.floor((minWZ + half) / texel));
    const z1 = Math.min(res - 1, Math.ceil((maxWZ + half) / texel));

    const dx = bx - ax;
    const dz = bz - az;
    const lenSq = dx * dx + dz * dz;

    for (let iz = z0; iz <= z1; iz++) {
      const wz = iz * texel - half + texel * 0.5;
      for (let ix = x0; ix <= x1; ix++) {
        const wx = ix * texel - half + texel * 0.5;
        let dist: number;
        if (lenSq < 1e-8) {
          dist = Math.hypot(wx - ax, wz - az);
        } else {
          const t = Math.max(0, Math.min(1, ((wx - ax) * dx + (wz - az) * dz) / lenSq));
          const cx = ax + dx * t;
          const cz = az + dz * t;
          dist = Math.hypot(wx - cx, wz - cz);
        }
        const v = 1.0 - smoothstep(halfWidth - blur * 0.5, halfWidth + blur, dist);
        const idx = (iz * res + ix) * 4;
        if (v > this.data[idx]) {
          this.data[idx] = v;
          this.data[idx + 1] = v;
          this.data[idx + 2] = v;
          this.data[idx + 3] = 1.0;
        }
      }
    }
    this.texture.needsUpdate = true;
  }

  dispose(): void {
    this.texture.dispose();
  }
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

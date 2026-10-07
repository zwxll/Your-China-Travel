import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { buildFlowerGarden } from './garden.js';

// ---------------------------------------------------------------------------
// Geometry of the installation (world units ~ metres, floor at y = 0)
// ---------------------------------------------------------------------------
const BG_HEX = 0xe9eddf;
const BG_SRGB = new THREE.Vector3(0xe9 / 255, 0xed / 255, 0xdf / 255);
const FOG_DENSITY = 0.006;
const SWAY = 0.016; // horizontal drift per metre of thread

const canopyRadius = (t) => 10.1 + 0.65 * Math.sin(3 * t + 1.0) + 0.4 * Math.sin(5 * t + 2.1) + 0.22 * Math.sin(9 * t + 0.3);
const canopyUnder = (r) => 8.7 + 0.55 * (1 - Math.min(1, r / 10.5) ** 2); // where threads attach
const carpetRadius = (t) => .4 * (5.7 + 0.85 * Math.sin(2 * t + 0.4) + 0.55 * Math.sin(5 * t + 1.3) + 0.3 * Math.sin(9 * t + 2.0));
const CARPET_SX = 1.22, CARPET_SZ = 0.95;

const CARD_W = 1.0;
const PHOTO_MIN_R = 2.15, PHOTO_MAX_R = 8.3;

function pompomGeometry(detail = 0, squash = 0.66) {
  // a ruffled, squashed dodecahedron: reads as a paper / carnation pompom
  const g = new THREE.DodecahedronGeometry(1, detail);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const h = Math.abs(Math.sin(Math.round(x * 97) * 12.9898 + Math.round(y * 97) * 78.233 + Math.round(z * 97) * 37.719) * 43758.5453) % 1;
    const k = 0.82 + h * 0.36;
    pos.setXYZ(i, x * k, y * k * squash, z * k);
  }
  g.computeVertexNormals();
  return g;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const srgb = (hex) => { const c = new THREE.Color(hex).getRGB({}, THREE.SRGBColorSpace); return [c.r, c.g, c.b]; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => t * t * (3 - 2 * t);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// exponential approach that lands exactly on the target (so finished fades stop re-uploading)
const ease = (v, target, k) => { v += (target - v) * k; return Math.abs(target - v) < 1e-4 ? target : v; };

// Same drift as GLSL swayAt(); keeps JS-driven cards on the shader-driven threads.
function swayAt(t, phase, amp, out) {
  out.x = (Math.sin(t * 0.55 + phase) * 0.6 + Math.sin(t * 1.13 + phase * 2.3) * 0.4) * amp;
  out.y = (Math.cos(t * 0.47 + phase * 1.7) * 0.6 + Math.sin(t * 0.91 + phase * 0.7) * 0.4) * amp;
  return out;
}

const GLSL_COMMON = /* glsl */ `
  uniform float uTime;
  uniform float uSway;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform vec3 uFocusPos;
  uniform float uFocusOn;
  // 0 when p sits between the camera and the focused photo, 1 elsewhere
  float clearOfFocus(vec3 p) {
    vec3 seg = uFocusPos - cameraPosition;
    float L = dot(seg, seg);
    float t = clamp(dot(p - cameraPosition, seg) / max(L, 1e-4), 0.0, 1.0);
    float d = length(p - (cameraPosition + seg * t));
    float keep = max(smoothstep(0.22, 0.75, d), step(0.93, t));
    return mix(1.0, keep, uFocusOn);
  }
  vec2 swayAt(float phase) {
    return vec2(sin(uTime * 0.55 + phase) * 0.6 + sin(uTime * 1.13 + phase * 2.3) * 0.4,
                cos(uTime * 0.47 + phase * 1.7) * 0.6 + sin(uTime * 0.91 + phase * 0.7) * 0.4) * uSway;
  }
  float fogAmount(float d) { return clamp(1.0 - exp(-uFogDensity * uFogDensity * d * d), 0.0, 1.0); }
`;

// ---------------------------------------------------------------------------
export class CanopyScene {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.rand = mulberry32(20261004);
    this._last = performance.now();
    this.time = 0;
    this.photos = [];
    this.cards = [];
    this.hovered = null;
    this.selected = null;
    this.focusStory = null;
    this.flight = null;
    this.inset = { right: 0, bottom: 0 };
    this.insetTarget = { right: 0, bottom: 0 };
    this.listeners = {};
    this._tmp2 = new THREE.Vector2();
    this._v = new THREE.Vector3();
    // scratch objects reused every frame (no per-frame allocations)
    this._m = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._s = new THREE.Vector3();
    this._p = new THREE.Vector3();
    this._sw = new THREE.Vector2();
    this._flightTarget = new THREE.Vector3();
    this._flightOff = new THREE.Vector3();
    this._flightSph = new THREE.Spherical();
    this._frameSum = 0;
    this._frameCount = 0;
    this._warmup = 0;
    this._good = 0;
    this._upAfter = 4;

    // The loop runs only while the work is on screen; see setRunning().
    this.running = false;
    this.contextLost = false;
    this._wantRunning = false;
    this._pausedAt = performance.now();
    this._loop = () => {
      this._raf = requestAnimationFrame(this._loop);
      this.frame();
    };

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.toneMapping = THREE.NoToneMapping;
    // The shaders are fixed; reading back their compile logs stalls the first frame ~40 ms.
    renderer.debug.checkShaderErrors = false;
    // MSAA at 1.5x looks the same as 2x on a retina screen at ~half the pixels.
    this.maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.dpr = this.maxDpr;
    renderer.setPixelRatio(this.dpr);
    this.renderer = renderer;
    // three.js already allows the context to be restored; just stop drawing meanwhile.
    canvas.addEventListener('webglcontextlost', () => {
      this.contextLost = true;
      this.setRunning(this._wantRunning);
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.emit('contextrestored');
    });
    // An empty white map until the photo arrives: card shaders compile once, up front.
    this.blankMap = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.blankMap.needsUpdate = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_HEX);
    scene.fog = new THREE.FogExp2(BG_HEX, FOG_DENSITY);
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.08, 220);
    this.camera.position.set(0, 3.6, 24);

    const controls = new OrbitControls(this.camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.zoomToCursor = true;
    controls.minDistance = 0.7;
    controls.maxDistance = 46;
    controls.maxPolarAngle = Math.PI * 0.64;
    controls.rotateSpeed = 0.55;
    controls.panSpeed = 0.8;
    controls.autoRotateSpeed = 0.35;
    controls.target.set(0, 5.2, 0);
    controls.addEventListener('start', () => { this.lastInteraction = performance.now(); this.emit('interact'); });
    this.controls = controls;
    this.lastInteraction = performance.now();

    this.common = {
      uTime: { value: 0 },
      uSway: { value: reducedMotion ? 0 : SWAY },
      uFogColor: { value: BG_SRGB },
      uFogDensity: { value: FOG_DENSITY },
      uFocusPos: { value: new THREE.Vector3() },
      uFocusOn: { value: 0 },
    };

    this.raycaster = new THREE.Raycaster();

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  // The room and everything that does not depend on the photos. Separate from the
  // constructor (which creates the WebGL context) to keep start-up tasks short.
  buildRoom() {
    this._buildLights();
    this.garden = buildFlowerGarden(this.scene, this.reducedMotion);
    this._buildColumn();
    this._buildCarpet();
    this._buildLightVolume();
  }

  on(name, fn) { (this.listeners[name] ||= []).push(fn); }
  emit(name, ...a) { (this.listeners[name] || []).forEach((fn) => fn(...a)); }

  // -------------------------------------------------------------------------
  // Build: everything that depends on the photo list
  // -------------------------------------------------------------------------
  setPhotos(photos, stories) {
    this.photos = photos;
    this.stories = stories;
    this._layoutPhotos();
    this._buildCanopy();
    this._buildCrystals();
    this._buildCards();
    this._buildPhotoThreads();
    this._pickables = [...this.plateHits, this.anchors, this.pompoms];
    this.recolorCarpet(); // palettes come with photos.json; see main.js for photos without one
    this.resize();
  }

  _layoutPhotos() {
    const rand = mulberry32(7);
    const stories = this.stories;
    const total = this.photos.length;
    const gap = 0.07;
    const usable = Math.PI * 2 - gap * stories.length;
    // First story faces the opening camera (which looks from +z).
    const w0 = (usable * stories[0].photos.length) / total;
    let a = Math.PI / 2 - w0 / 2;
    const placed = [];
    for (const s of stories) {
      const w = (usable * s.photos.length) / total;
      s.sector = { a0: a, a1: a + w, mid: a + w / 2 };
      for (const p of s.photos) {
        let best = null, bestScore = -1;
        for (let k = 0; k < 60; k++) {
          const th = a + 0.06 + rand() * (w - 0.12);
          const r = Math.sqrt(lerp(PHOTO_MIN_R ** 2, PHOTO_MAX_R ** 2, rand()));
          if (r > canopyRadius(th) - 1.5) continue;
          const x = Math.cos(th) * r, z = Math.sin(th) * r;
          let d = 3.2;
          for (const q of placed) d = Math.min(d, Math.hypot(q.x - x, q.z - z));
          const score = d + rand() * 0.15;
          if (score > bestScore) { bestScore = score; best = { x, z, r, th }; }
        }
        const t = (best.r - PHOTO_MIN_R) / (PHOTO_MAX_R - PHOTO_MIN_R);
        const y = lerp(3.05, 5.9, t) + (rand() - 0.5) * 0.9;
        p.w = CARD_W;
        p.h = CARD_W * p.aspect;
        p.rest = new THREE.Vector3(best.x, y, best.z);
        p.anchorY = canopyUnder(best.r) + 0.2;
        p.capY = y + p.h / 2 + 0.085;
        p.phase = rand() * 100;
        placed.push(best);
      }
      a += w + gap;
    }
  }

  // ---------------- lights & room ----------------
  _buildLights() {
    const s = this.scene;
    s.add(new THREE.HemisphereLight(0xfff1dc, 0x7e906c, 0.9));
    const key = new THREE.DirectionalLight(0xfff4e6, 1.1);
    key.position.set(-6, 12, 9);
    s.add(key);
    const spot = new THREE.SpotLight(0xfff0d8, 1.4, 0, 0.62, 0.55, 0);
    spot.position.set(0, 17, 3);
    spot.target.position.set(0, 0, 0);
    s.add(spot, spot.target);
    const under = new THREE.PointLight(0xfff2e0, 1.6, 0, 0);
    under.position.set(0, 7.5, 0);
    s.add(under);
  }

  _buildRoom() {
    // A dim warehouse: brick walls, black posts and ceiling beams.
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const g = c.getContext('2d');
    const rand = mulberry32(3);
    g.fillStyle = '#2a1712'; g.fillRect(0, 0, 512, 256);
    const bw = 64, bh = 21;
    for (let row = 0; row < 256 / bh + 1; row++) {
      for (let col = -1; col < 512 / bw + 1; col++) {
        const x = col * bw + (row % 2 ? bw / 2 : 0), y = row * bh;
        const v = 0.7 + rand() * 0.45;
        g.fillStyle = `rgb(${Math.round(120 * v)},${Math.round(58 * v)},${Math.round(44 * v)})`;
        g.fillRect(x + 2, y + 2, bw - 4, bh - 4);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(13, 4);
    tex.anisotropy = 4;
    const wallMat = new THREE.MeshLambertMaterial({ map: tex, color: 0x4a4440 });
    const wallGeo = new THREE.PlaneGeometry(90, 18);
    const walls = [
      [0, 9, -40, 0], [0, 9, 40, Math.PI], [-40, 9, 0, Math.PI / 2], [40, 9, 0, -Math.PI / 2],
    ];
    for (const [x, y, z, ry] of walls) {
      const m = new THREE.Mesh(wallGeo, wallMat);
      m.position.set(x, y, z); m.rotation.y = ry;
      this.scene.add(m);
    }
    const dark = new THREE.MeshLambertMaterial({ color: 0x141414 });
    const postGeo = new THREE.CylinderGeometry(0.17, 0.17, 18, 12);
    for (const [x, z] of [[-13.5, -6], [13.8, -7.5], [-14.5, 9], [14, 8.5]]) {
      const p = new THREE.Mesh(postGeo, dark);
      p.position.set(x, 9, z);
      this.scene.add(p);
    }
    const beamGeo = new THREE.BoxGeometry(80, 0.35, 0.25);
    for (const z of [-16, -6, 6, 16]) {
      const b = new THREE.Mesh(beamGeo, dark);
      b.position.set(0, 16.5, z);
      this.scene.add(b);
    }
  }

  _buildFloor() {
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...this.common },
      vertexShader: /* glsl */ `
        varying vec3 vW;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        varying vec3 vW;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
        }
        void main() {
          vec2 p = vW.xz;
          float r = length(p * vec2(0.85, 1.0));
          float pool = exp(-r * r / (2.0 * 10.5 * 10.5));
          float n = noise(p * 1.7) * 0.5 + noise(p * 6.0) * 0.3 + noise(p * 0.4) * 0.2;
          // light broken up by the crystals: soft dappled caustics in the pool
          float c1 = sin(p.x * 1.9 + sin(p.y * 1.3 + uTime * 0.05) * 2.0) * sin(p.y * 2.3 + sin(p.x * 1.1) * 2.0);
          float c2 = sin(p.x * 4.1 + p.y * 1.7) * sin(p.y * 3.7 - p.x * 1.3);
          float caustic = smoothstep(0.25, 0.95, c1 * 0.6 + c2 * 0.4);
          vec3 base = vec3(0.045, 0.044, 0.046) * (0.8 + 0.4 * n);
          vec3 lit = vec3(0.36, 0.34, 0.31) * pool * (0.72 + 0.28 * n);
          lit += vec3(0.13, 0.125, 0.11) * caustic * pool * smoothstep(3.0, 7.5, r);
          vec3 col = base + lit;
          col = mix(col, uFogColor, fogAmount(length(vW - cameraPosition)));
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), mat);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  _buildColumn() {
    const prof = [
      [0, 0], [0.98, 0], [0.98, 0.07], [0.62, 0.11], [0.36, 0.3], [0.21, 0.8], [0.155, 1.6], [0.135, 3.0],
      [0.135, 5.4], [0.16, 6.4], [0.24, 7.2], [0.42, 7.9], [0.72, 8.45], [1.1, 8.9], [1.45, 9.25], [1.55, 9.5], [0, 9.6],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(prof, 72);
    const mat = new THREE.MeshStandardMaterial({ color: 0xf1ece3, roughness: 0.42, metalness: 0, emissive: 0x5a554e });
    const col = new THREE.Mesh(geo, mat);
    this.scene.add(col);
    this.column = col;
  }

  // ---------------- flower carpet ----------------
  _buildCarpet() {
    const rand = mulberry32(11);
    const base = pompomGeometry();
    const items = [];
    let guard = 0;
    while (items.length < 1800 && guard++ < 20000) {
      const x = (rand() * 2 - 1) * 3.28, z = (rand() * 2 - 1) * 2.56;
      const lx = x / CARPET_SX, lz = z / CARPET_SZ;
      const r = Math.hypot(lx, lz), t = Math.atan2(lz, lx);
      const e = r / carpetRadius(t);
      if (e > 1) continue;
      if (Math.hypot(x, z) < 1.0) continue; // column foot
      items.push({ x, z, e });
    }
    const mesh = new THREE.InstancedMesh(base, new THREE.MeshLambertMaterial({ color: 0xffffff }), items.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), eu = new THREE.Euler();
    items.forEach((it, i) => {
      const edge = smooth(clamp((it.e - 0.82) / 0.18, 0, 1));
      const sc = (0.125 + rand() * 0.08) * (1 - 0.35 * edge);
      p.set(it.x, sc * 0.4 + rand() * 0.09 * (1 - edge) + 0.01, it.z);
      eu.set((rand() - 0.5) * 0.6, rand() * Math.PI * 2, (rand() - 0.5) * 0.6);
      q.setFromEuler(eu);
      s.setScalar(sc);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
      it.rand = rand();
      it.rand2 = rand();
    });
    this.carpet = mesh;
    this.carpetItems = items;
    const tmp = new THREE.Color(1, 1, 1);
    for (let i = 0; i < items.length; i++) mesh.setColorAt(i, tmp);
    this.scene.add(mesh);
  }

  // Dye the carpet from the photos above it: each flower takes a colour from the
  // palette of the nearest hanging photo, brightened like dyed paper.
  recolorCarpet() {
    if (!this.carpet || !this.photos.length) return;
    const pastels = ['#f4b3c2', '#f6dc8c', '#f3eee6', '#f2ad7e', '#d9c2ef', '#bfe0c3', '#f58f98', '#fbe9c4', '#ffffff', '#f7c6d6'].map((h) => new THREE.Color(h));
    const c = new THREE.Color();
    const hsl = {};
    const anchors = this.photos.map((ph) => ({ x: ph.rest.x * 0.72, z: ph.rest.z * 0.72, ph }));
    this.carpetItems.forEach((it, i) => {
      let best = null, bd = 1e9;
      for (const a of anchors) {
        const d = (a.x - it.x) ** 2 + (a.z - it.z) ** 2;
        if (d < bd) { bd = d; best = a.ph; }
      }
      const pal = best.palette;
      if (pal && it.rand < 0.5) {
        const rgb = pal[Math.floor(it.rand2 * pal.length) % pal.length];
        c.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace);
        c.getHSL(hsl, THREE.SRGBColorSpace);
        const sat = clamp(0.3 + hsl.s * 0.9, 0, 0.78);
        const lig = clamp(0.66 + (hsl.l - 0.5) * 0.35, 0.56, 0.86);
        c.setHSL(hsl.h, sat, lig, THREE.SRGBColorSpace);
      } else {
        c.copy(pastels[Math.floor(it.rand2 * 7919) % pastels.length]);
      }
      this.carpet.setColorAt(i, c);
    });
    this.carpet.instanceColor.needsUpdate = true;
  }

  _buildLightVolume() {
    const geo = new THREE.CylinderGeometry(8.6, 6.6, 8.4, 64, 1, true);
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...this.common },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vW; varying vec2 vUv;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz; vUv = uv; vN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        varying vec3 vN; varying vec3 vW; varying vec2 vUv;
        void main() {
          vec3 V = normalize(cameraPosition - vW);
          float facing = abs(dot(normalize(vN), V));
          float streak = 0.55 + 0.45 * sin(vUv.x * 170.0 + sin(vUv.x * 41.0) * 3.0);
          float a = 0.028 * pow(facing, 1.6) * smoothstep(0.0, 1.0, vUv.y) * streak;
          a *= 1.0 - fogAmount(length(vW - cameraPosition));
          gl_FragColor = vec4(vec3(1.0, 0.95, 0.86), a);
        }`,
    });
    const vol = new THREE.Mesh(geo, mat);
    vol.position.y = 4.4;
    vol.renderOrder = 10;
    this.scene.add(vol);
    this.lightVolume = vol;
  }

  // ---------------- umbrella canopy ----------------
  _umbrellaGeometry() {
    const seg = 30, rings = 4;
    const positions = [], uvs = [], index = [];
    for (let i = 0; i <= rings; i++) {
      const r = i / rings;
      for (let j = 0; j <= seg; j++) {
        const th = (j / seg) * Math.PI * 2;
        const y = -0.34 * Math.pow(r, 1.25);
        positions.push(Math.cos(th) * r, y, Math.sin(th) * r);
        uvs.push(j / seg, r);
      }
    }
    for (let i = 0; i < rings; i++) {
      for (let j = 0; j < seg; j++) {
        const a = i * (seg + 1) + j, b = a + seg + 1;
        index.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
  }

  _umbrellaMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: { ...this.common },
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        attribute vec3 aColor; attribute vec3 aHiColor; attribute float aHi; attribute float aDim; attribute float aSeed;
        varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec3 vColor; varying vec3 vHiColor; varying float vHi; varying float vDim; varying float vSeed;
        void main() {
          vHiColor = aHiColor;
          mat4 m = modelMatrix * instanceMatrix;
          vec4 w = m * vec4(position, 1.0);
          vW = w.xyz; vUv = uv; vN = normalize(mat3(m) * normal);
          vColor = aColor; vHi = aHi; vDim = aDim; vSeed = aSeed;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec3 vColor; varying vec3 vHiColor; varying float vHi; varying float vDim; varying float vSeed;
        void main() {
          float r = vUv.y;
          float a = vUv.x * 30.0;
          float dr = min(fract(a), 1.0 - fract(a));
          float w = 0.035 / max(r, 0.1);
          float fw = fwidth(a);
          float rib = 1.0 - smoothstep(w * 0.5, w * 0.5 + fw * 1.2, dr);
          vec3 N = normalize(vN);
          vec3 V = normalize(cameraPosition - vW);
          bool underside = dot(N, V) < 0.0; // normals point up/out of the dome
          float lit = mix(0.84, 1.08, smoothstep(0.0, 0.7, r)) * (0.88 + 0.18 * vSeed);
          float facing = abs(dot(N, V));
          lit *= mix(0.9, 1.04, facing);
          vec3 col = vColor * lit;
          float ribFade = smoothstep(0.0, 0.35, r);
          col *= 1.0 - rib * ribFade * (underside ? 0.16 : 0.07);
          float ring = 1.0 - smoothstep(0.0, 0.01 + fwidth(r), abs(r - 0.3));
          col *= 1.0 - ring * (underside ? 0.12 : 0.05);
          float hub = 1.0 - smoothstep(0.035, 0.055, r);
          col = mix(col, vec3(0.16, 0.14, 0.12), hub * (underside ? 0.9 : 0.3));
          col += vec3(1.0, 0.97, 0.9) * smoothstep(0.9, 1.0, r) * 0.06;
          // deeper in the cloud = a little shadowed; the very edge glows
          col *= mix(1.0, 0.84, clamp((vW.y - 9.6) / 1.5, 0.0, 1.0));
          float lum = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(col, vec3(lum) * 0.75, vDim * 0.8);
          col = mix(col, col * 0.75 + vHiColor * 0.55, vHi);
          col = mix(col, uFogColor, fogAmount(length(vW - cameraPosition)));
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
  }

  _buildCanopy() {
    const rand = mulberry32(19);
    const geo = this._umbrellaGeometry();
    const white = [];
    const anchors = this.photos.map((p) => ({ x: p.rest.x, z: p.rest.z }));
    const up = new THREE.Vector3(0, 1, 0);
    const makeQuat = (tilt, dirX, dirZ) => {
      const axis = new THREE.Vector3(dirZ, 0, -dirX).normalize();
      return new THREE.Quaternion().setFromAxisAngle(axis, tilt);
    };
    for (let layer = 0; layer < 3; layer++) {
      const step = layer === 2 ? 1.05 : 0.9;
      const off = layer * 0.37;
      for (let gx = -12; gx <= 12; gx += step) {
        for (let gz = -12; gz <= 12; gz += step) {
          const x = gx + off + (rand() - 0.5) * 0.62 * step;
          const z = gz + off * 0.6 + (rand() - 0.5) * 0.62 * step;
          const r = Math.hypot(x, z), th = Math.atan2(z, x);
          const R = canopyRadius(th);
          const lim = layer === 2 ? R * 0.8 : layer === 1 ? R * 0.96 : R;
          if (r > lim) continue;
          if (layer === 0 && anchors.some((a) => Math.hypot(a.x - x, a.z - z) < 0.72)) continue;
          const t = r / R;
          const y = canopyUnder(r) + 0.28 + layer * 0.42 + (rand() - 0.5) * 0.22 + (layer === 2 ? 0.45 * (1 - t * t) : 0);
          // edge umbrellas lean inward so their undersides face the room
          const inward = -1;
          const ra = rand() * Math.PI * 2;
          const rnd = (layer === 0 ? 0.1 + 0.3 * rand() : layer === 1 ? 0.2 + 0.5 * rand() : 0.15 + 0.4 * rand());
          const edge = 0.75 * t * t * t;
          const dx = Math.cos(ra) * rnd + inward * Math.cos(th) * edge;
          const dz = Math.sin(ra) * rnd + inward * Math.sin(th) * edge;
          const tilt = Math.min(1.05, Math.hypot(dx, dz));
          white.push({ x, y, z, q: makeQuat(tilt, dx, dz), s: 0.56 + rand() * 0.24, seed: rand() });
        }
      }
    }
    const mat = this._umbrellaMaterial();
    const build = (list, color) => {
      const n = list.length;
      const g = geo.clone();
      const aColor = new Float32Array(n * 3), aHiColor = new Float32Array(n * 3), aHi = new Float32Array(n), aDim = new Float32Array(n), aSeed = new Float32Array(n);
      g.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
      g.setAttribute('aHiColor', new THREE.InstancedBufferAttribute(aHiColor, 3));
      g.setAttribute('aHi', new THREE.InstancedBufferAttribute(aHi, 1).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('aDim', new THREE.InstancedBufferAttribute(aDim, 1).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
      const mesh = new THREE.InstancedMesh(g, mat, n);
      const m = new THREE.Matrix4(), s = new THREE.Vector3(), p = new THREE.Vector3();
      list.forEach((u, i) => {
        p.set(u.x, u.y, u.z); s.setScalar(u.s);
        m.compose(p, u.q, s);
        mesh.setMatrixAt(i, m);
        aColor.set(color, i * 3);
        aHiColor.set(u.hiColor || [1.2, 1.18, 1.1], i * 3);
        aSeed[i] = u.seed;
      });
      mesh.computeBoundingSphere();
      this.scene.add(mesh);
      return mesh;
    };
    this.umbrellas = build(white, [0.97, 0.95, 0.9]);
    const anchorList = this.photos.map((p) => ({
      x: p.rest.x, y: p.anchorY, z: p.rest.z,
      q: makeQuat(0.06 + rand() * 0.08, rand() - 0.5, rand() - 0.5),
      s: 0.6, seed: 0.85 + rand() * 0.15,
      hiColor: srgb(p.story.color).map((v) => v * 1.4 + 0.25),
    }));
    this.anchors = build(anchorList, [0.98, 0.96, 0.92]);
    this._buildPompoms();
    this.umbrellaCount = white.length + anchorList.length;
  }

  _buildPompoms() {
    const n = this.photos.length;
    const g = pompomGeometry(1, 0.85);
    const aColor = new Float32Array(n * 3), aHi = new Float32Array(n), aDim = new Float32Array(n);
    this.photos.forEach((p, i) => aColor.set(srgb(p.story.color), i * 3));
    g.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
    g.setAttribute('aHi', new THREE.InstancedBufferAttribute(aHi, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aDim', new THREE.InstancedBufferAttribute(aDim, 1).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...this.common },
      vertexShader: /* glsl */ `
        attribute vec3 aColor; attribute float aHi; attribute float aDim;
        varying vec3 vN; varying vec3 vW; varying vec3 vColor; varying float vHi; varying float vDim;
        void main() {
          mat4 m = modelMatrix * instanceMatrix;
          vec4 w = m * vec4(position * (1.0 + 0.45 * aHi), 1.0);
          vW = w.xyz; vN = normalize(mat3(m) * normal);
          vColor = aColor; vHi = aHi; vDim = aDim;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        varying vec3 vN; varying vec3 vW; varying vec3 vColor; varying float vHi; varying float vDim;
        void main() {
          vec3 N = normalize(vN);
          float l = 0.62 + 0.38 * max(dot(N, normalize(vec3(0.2, -0.9, 0.4))), 0.0) + 0.12 * max(dot(N, vec3(0.0, 1.0, 0.0)), 0.0);
          vec3 col = vColor * l * 1.08;
          float lum = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(col, vec3(lum) * 0.8, vDim * 0.7);
          col += vColor * vHi * 0.45;
          col = mix(col, uFogColor, fogAmount(length(vW - cameraPosition)));
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const mesh = new THREE.InstancedMesh(g, mat, n);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3();
    const rand = mulberry32(31);
    this.photos.forEach((ph, i) => {
      p.set(ph.rest.x, ph.anchorY - 0.2, ph.rest.z);
      e.set(rand() * 0.5, rand() * 6.28, rand() * 0.5);
      q.setFromEuler(e);
      s.setScalar(0.25);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.computeBoundingSphere();
    this.scene.add(mesh);
    this.pompoms = mesh;
  }

  // ---------------- crystals, threads, sparkles ----------------
  _crystalMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: { ...this.common },
      vertexShader: /* glsl */ `
        ${GLSL_COMMON}
        attribute float aPhase; attribute float aLen; attribute vec3 aColor; attribute float aTint; attribute float aSpin;
        varying vec3 vN; varying vec3 vW; varying vec3 vColor; varying float vTint; varying float vPhase;
        void main() {
          float an = uTime * aSpin + aPhase * 3.0;
          float c = cos(an), s = sin(an);
          mat3 rot = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
          vec3 p = rot * position;
          vec4 center = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          center.xz += swayAt(aPhase) * aLen;
          float clear = aLen > 0.0 ? clearOfFocus(center.xyz) : 1.0;
          vec4 w = modelMatrix * instanceMatrix * vec4(p * clear, 1.0);
          w.xz += swayAt(aPhase) * aLen;
          vW = w.xyz;
          vN = normalize(mat3(modelMatrix * instanceMatrix) * (rot * normal));
          vColor = aColor; vTint = aTint; vPhase = aPhase;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        varying vec3 vN; varying vec3 vW; varying vec3 vColor; varying float vTint; varying float vPhase;
        void main() {
          vec3 N = normalize(vN);
          vec3 V = normalize(cameraPosition - vW);
          float f = 1.0 - abs(dot(N, V));
          vec3 R = reflect(-V, N);
          float s1 = pow(max(dot(R, normalize(vec3(0.3, 1.0, 0.25))), 0.0), 18.0);
          float s2 = pow(max(dot(R, normalize(vec3(-0.6, 0.35, 0.7))), 0.0), 12.0);
          float s3 = pow(max(dot(R, normalize(vec3(0.5, -0.6, -0.4))), 0.0), 10.0);
          vec3 irid = 0.5 + 0.5 * cos(6.2831 * (f * 1.3 + vec3(0.0, 0.33, 0.67)) + vPhase);
          vec3 base = mix(vec3(0.78, 0.8, 0.84), vColor, vTint);
          float facet = 0.5 + 0.5 * sin(dot(N, vec3(12.0, 7.0, 9.0)) + vPhase);
          vec3 col = base * (0.5 + 0.3 * f + 0.25 * facet) + irid * 0.08 * f + vec3(1.0) * (s1 * 1.6 + s2 * 1.0 + s3 * 0.6);
          col = mix(col, uFogColor, fogAmount(length(vW - cameraPosition)));
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
  }

  _buildCrystals() {
    const rand = mulberry32(23);
    const cards = this.photos.map((p) => ({ x: p.rest.x, z: p.rest.z }));
    const tints = ['#ff9fb5', '#ff6f7d', '#ffc08a', '#ffb3c7', '#f7a0d0', '#ff8a6e', '#ffd0a0', '#c9b6ff'].map(srgb);
    const threads = [], crystals = [];
    let guard = 0;
    while (threads.length < 540 && guard++ < 40000) {
      const th = rand() * Math.PI * 2;
      const r = Math.sqrt(lerp(1.6 ** 2, 9.7 ** 2, rand()));
      if (r > canopyRadius(th) - 0.55) continue;
      const x = Math.cos(th) * r, z = Math.sin(th) * r;
      if (cards.some((c) => Math.hypot(c.x - x, c.z - z) < 0.64)) continue;
      const top = canopyUnder(r);
      const floorCurve = 1.45 + 0.4 * r;
      const yb = lerp(top - 0.8, floorCurve, Math.pow(rand(), 0.6));
      const phase = rand() * 100;
      threads.push({ x, z, top, yb, phase });
      const nBeads = rand() < 0.5 ? 0 : rand() < 0.65 ? 1 : 2;
      const ys = [yb];
      for (let k = 0; k < nBeads; k++) ys.push(lerp(yb, top - 0.3, 0.2 + rand() * 0.65));
      for (const y of ys) {
        const tinted = rand() < 0.2;
        crystals.push({
          x, y, z, len: top - y, phase,
          size: 0.034 + rand() * 0.034 + (y === yb ? 0.012 : 0),
          color: tinted ? tints[Math.floor(rand() * tints.length)] : [0.9, 0.93, 1.0],
          tint: tinted ? 0.7 : 0.0,
          spin: (rand() - 0.5) * 0.8,
        });
      }
    }
    this.crystalCount = crystals.length;
    this.threadCount = threads.length;

    // crystals
    const cg = new THREE.OctahedronGeometry(1, 0);
    cg.scale(1, 1.55, 1);
    const n = crystals.length;
    const geo = cg.clone();
    const aPhase = new Float32Array(n), aLen = new Float32Array(n), aColor = new Float32Array(n * 3), aTint = new Float32Array(n), aSpin = new Float32Array(n);
    const mesh = new THREE.InstancedMesh(geo, this._crystalMaterial(), n);
    const m = new THREE.Matrix4();
    crystals.forEach((c, i) => {
      m.makeScale(c.size, c.size, c.size).setPosition(c.x, c.y, c.z);
      mesh.setMatrixAt(i, m);
      aPhase[i] = c.phase; aLen[i] = c.len; aColor.set(c.color, i * 3); aTint[i] = c.tint; aSpin[i] = c.spin;
    });
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
    geo.setAttribute('aLen', new THREE.InstancedBufferAttribute(aLen, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
    geo.setAttribute('aTint', new THREE.InstancedBufferAttribute(aTint, 1));
    geo.setAttribute('aSpin', new THREE.InstancedBufferAttribute(aSpin, 1));
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    this.crystals = mesh;

    // threads (decorative)
    this.threads = this._threadLines(threads.map((t) => ({ x: t.x, z: t.z, top: t.top, bottom: t.yb, phase: t.phase, color: [1, 1, 1] })), 0.15);
    this.scene.add(this.threads.mesh);

    // sparkles: a glint that flares on a crystal now and then
    const sp = new Float32Array(n * 3), sPhase = new Float32Array(n), sLen = new Float32Array(n), sRand = new Float32Array(n);
    crystals.forEach((c, i) => { sp.set([c.x, c.y, c.z], i * 3); sPhase[i] = c.phase; sLen[i] = c.len; sRand[i] = rand(); });
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    pg.setAttribute('aPhase', new THREE.BufferAttribute(sPhase, 1));
    pg.setAttribute('aLen', new THREE.BufferAttribute(sLen, 1));
    pg.setAttribute('aRand', new THREE.BufferAttribute(sRand, 1));
    const pm = new THREE.ShaderMaterial({
      uniforms: { ...this.common, uScale: { value: 1 }, uMaxSize: { value: 90 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        ${GLSL_COMMON}
        uniform float uScale; uniform float uMaxSize;
        attribute float aPhase; attribute float aLen; attribute float aRand;
        varying float vTw; varying float vFog;
        void main() {
          vec3 p = position;
          p.xz += swayAt(aPhase) * aLen;
          vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.0);
          float tw = pow(max(0.0, sin(uTime * (0.35 + aRand * 0.6) + aRand * 60.0)), 26.0);
          vTw = (0.12 + tw) * clearOfFocus((modelMatrix * vec4(p, 1.0)).xyz);
          vFog = fogAmount(-mv.z);
          gl_PointSize = min(uScale * (0.9 + 2.6 * tw) * 2.2 / max(-mv.z, 0.4), uMaxSize);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vTw; varying float vFog;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float core = exp(-d * d * 60.0);
          float cross = exp(-abs(c.x) * 34.0) * exp(-abs(c.y) * 5.5) + exp(-abs(c.y) * 34.0) * exp(-abs(c.x) * 5.5);
          float a = (core + cross * 0.7) * vTw * (1.0 - vFog);
          gl_FragColor = vec4(vec3(1.0, 0.97, 0.92), a);
        }`,
    });
    const pts = new THREE.Points(pg, pm);
    pts.frustumCulled = false;
    this.sparkles = pts;
    this.scene.add(pts);
  }

  _threadLines(list, alpha) {
    const n = list.length;
    const pos = new Float32Array(n * 6), len = new Float32Array(n * 2), phase = new Float32Array(n * 2);
    const color = new Float32Array(n * 6), hi = new Float32Array(n * 2), dim = new Float32Array(n * 2);
    list.forEach((t, i) => {
      pos.set([t.x, t.top, t.z, t.x, t.bottom, t.z], i * 6);
      len.set([0, t.top - t.bottom], i * 2);
      phase.set([t.phase, t.phase], i * 2);
      color.set([...t.color, ...t.color], i * 6);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aLen', new THREE.BufferAttribute(len, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    g.setAttribute('aHi', new THREE.BufferAttribute(hi, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aDim', new THREE.BufferAttribute(dim, 1).setUsage(THREE.DynamicDrawUsage));
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...this.common, uAlpha: { value: alpha } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        ${GLSL_COMMON}
        uniform float uAlpha;
        attribute float aLen; attribute float aPhase; attribute vec3 aColor; attribute float aHi; attribute float aDim;
        varying vec4 vC;
        varying vec3 vW;
        void main() {
          vec3 p = position;
          p.xz += swayAt(aPhase) * aLen;
          vec4 w = modelMatrix * vec4(p, 1.0);
          vW = w.xyz;
          float fog = fogAmount(length(w.xyz - cameraPosition));
          float a = uAlpha * (1.0 + aHi * 3.5) * (1.0 - 0.75 * aDim) * (1.0 - fog);
          vC = vec4(mix(vec3(1.0), aColor, 0.35 + 0.4 * aHi), a);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        varying vec4 vC;
        varying vec3 vW;
        void main() { gl_FragColor = vec4(vC.rgb, vC.a * clearOfFocus(vW)); }`,
    });
    const mesh = new THREE.LineSegments(g, mat);
    mesh.frustumCulled = false;
    return { mesh, hi, dim, geo: g };
  }

  // ---------------- photo cards ----------------
  _cardGeometry(w, h) {
    // front + back faces in one draw call; the back is mirrored so it reads correctly
    const z = 0.02;
    const x = w / 2, y = h / 2;
    const pos = [
      -x, -y, z, x, -y, z, x, y, z, -x, y, z,
      x, -y, -z, -x, -y, -z, -x, y, -z, x, y, -z,
    ];
    // v runs top-down: photos are uploaded unflipped (flipY = false), the same for <img> and ImageBitmap
    const uv = [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0];
    const idx = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  _plateMaterial(color) {
    return new THREE.ShaderMaterial({
      uniforms: { ...this.common, uHi: { value: 0 }, uDim: { value: 0 }, uMember: { value: 0 }, uTint: { value: color } },
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vW;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        ${GLSL_COMMON}
        uniform float uHi; uniform float uDim; uniform float uMember; uniform vec3 uTint;
        varying vec3 vN; varying vec3 vW;
        void main() {
          vec3 N = normalize(vN);
          vec3 V = normalize(cameraPosition - vW);
          float f = pow(1.0 - abs(dot(N, V)), 2.0);
          float spec = pow(max(dot(reflect(-V, N), normalize(vec3(0.3, 0.85, 0.45))), 0.0), 28.0);
          // story-coloured rim: strong from afar, quiet when you are right in front of it
          float far = smoothstep(1.5, 7.0, length(cameraPosition - vW));
          float glow = max(uHi, uMember * 0.55) * mix(0.25, 1.0, far);
          vec3 col = mix(vec3(0.78, 0.84, 0.95) * (0.32 + 0.6 * f) + spec, uTint * 1.25 + spec, glow * 0.75);
          float a = (0.42 + 0.45 * f + spec + glow * 0.4) * (1.0 - 0.8 * uDim);
          a *= 1.0 - fogAmount(length(vW - cameraPosition));
          gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
        }`,
    });
  }

  _buildCards() {
    this.cardGroup = new THREE.Group();
    this.scene.add(this.cardGroup);
    const plateHits = [];
    // cap crystal above each card + small bead below it
    const cg = new THREE.OctahedronGeometry(1, 0);
    cg.scale(1, 1.55, 1);
    const n = this.photos.length * 2;
    const capGeo = cg.clone();
    const aPhase = new Float32Array(n), aLen = new Float32Array(n), aColor = new Float32Array(n * 3), aTint = new Float32Array(n), aSpin = new Float32Array(n);
    this.photos.forEach((p, i) => {
      aPhase[i * 2] = p.phase; aPhase[i * 2 + 1] = p.phase + 1.3;
      aColor.set([...srgb(p.story.color), 0.92, 0.94, 1.0], i * 6);
      aTint[i * 2] = 0.85; aTint[i * 2 + 1] = 0.1;
      aSpin[i * 2] = 0.4; aSpin[i * 2 + 1] = -0.5;
    });
    capGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
    capGeo.setAttribute('aLen', new THREE.InstancedBufferAttribute(aLen, 1));
    capGeo.setAttribute('aColor', new THREE.InstancedBufferAttribute(aColor, 3));
    capGeo.setAttribute('aTint', new THREE.InstancedBufferAttribute(aTint, 1));
    capGeo.setAttribute('aSpin', new THREE.InstancedBufferAttribute(aSpin, 1));
    this.caps = new THREE.InstancedMesh(capGeo, this._crystalMaterial(), n);
    this.caps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.caps.frustumCulled = false;
    this.scene.add(this.caps);

    const loading = new THREE.Color(0x26252a);
    this.cards = this.photos.map((p, i) => {
      const g = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: loading.clone(), fog: false, map: this.blankMap });
      const photoMesh = new THREE.Mesh(this._cardGeometry(p.w, p.h), mat);
      const plate = new THREE.Mesh(new THREE.BoxGeometry(p.w + 0.05, p.h + 0.05, 0.026), this._plateMaterial(new THREE.Vector3(...srgb(p.story.color))));
      plate.userData.photo = p;
      plate.renderOrder = 2;
      g.add(photoMesh, plate);
      g.position.copy(p.rest);
      this.cardGroup.add(g);
      plateHits.push(plate);
      return { photo: p, group: g, mat, plate, hi: 0, dim: 0, yaw: Math.atan2(-p.rest.x, -p.rest.z) + Math.PI, loaded: false, index: i };
    });
    this.plateHits = plateHits;
    this.photoOccluders = new Set();
  }

  _buildPhotoThreads() {
    this.photoThreads = this._threadLines(this.photos.map((p) => (
      { x: p.rest.x, z: p.rest.z, top: p.anchorY, bottom: p.capY, phase: p.phase, color: srgb(p.story.color) }
    )), 0.3);
    this.scene.add(this.photoThreads.mesh);
  }

  // `image` is an ImageBitmap (or an <img> where createImageBitmap is missing).
  setPhotoTexture(photo, image) {
    const card = this.cards.find((c) => c.photo === photo);
    if (!card) return;
    const texture = new THREE.Texture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false; // see _cardGeometry
    texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    // upload now, in its own task, rather than all at once in a later frame
    this.renderer.initTexture(texture);
    if (image.close) image.close(); // the GPU has its copy; free the decoded bitmap
    if (card.mat.map !== this.blankMap) card.mat.map.dispose();
    card.mat.map = texture;
    card.mat.needsUpdate = true;
    card.loaded = true;
  }

  // After a lost context the closed bitmaps cannot be uploaded again: show blank
  // cards until main.js has loaded the photos anew.
  resetPhotoTextures() {
    for (const card of this.cards) {
      if (card.mat.map !== this.blankMap) card.mat.map.dispose();
      card.mat.map = this.blankMap;
      card.loaded = false;
    }
  }

  // -------------------------------------------------------------------------
  // Camera views
  // -------------------------------------------------------------------------
  _tanHalf() { return Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)); }

  _viewport() {
    const W = this.width, H = this.height;
    return { W, H, freeW: W - this.insetTarget.right, freeH: H - this.insetTarget.bottom, fullH: H + this.insetTarget.bottom, fullW: W + this.insetTarget.right };
  }

  // Binary-search the closest distance along `dir` from `target` at which all
  // points land inside the given NDC box of the free (non-panel) viewport.
  _fit(points, target, dir, box) {
    const { freeW, fullH } = this._viewport();
    const cam = new THREE.PerspectiveCamera(this.camera.fov, freeW / fullH, 0.1, 300);
    cam.updateProjectionMatrix();
    const v = new THREE.Vector3();
    const fits = (d) => {
      cam.position.copy(target).addScaledVector(dir, d);
      cam.lookAt(target);
      cam.updateMatrixWorld(true);
      for (const p of points) {
        v.copy(p).applyMatrix4(cam.matrixWorldInverse);
        if (v.z > -0.2) return false;
        v.applyMatrix4(cam.projectionMatrix);
        if (v.x < box.x0 || v.x > box.x1 || v.y < box.y0 || v.y > box.y1) return false;
      }
      return true;
    };
    let lo = 0.5, hi = 120;
    for (let i = 0; i < 26; i++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; }
    return hi;
  }

  _wholePoints() {
    if (this._wp) return this._wp;
    const pts = [];
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      const R = canopyRadius(t) + 0.5;
      pts.push(new THREE.Vector3(Math.cos(t) * R, 9.1, Math.sin(t) * R));
      pts.push(new THREE.Vector3(Math.cos(t) * R * 0.85, 10.3, Math.sin(t) * R * 0.85));
      const C = carpetRadius(t);
      pts.push(new THREE.Vector3(Math.cos(t) * C * CARPET_SX, 0.05, Math.sin(t) * C * CARPET_SZ));
    }
    pts.push(new THREE.Vector3(0, 11.1, 0));
    this._wp = pts;
    return pts;
  }

  wholeView(azimuth) {
    const { freeW, fullH } = this._viewport();
    const aspect = freeW / fullH;
    const phone = aspect < 0.8;
    const az = azimuth ?? Math.atan2(this.camera.position.x - this.controls.target.x, this.camera.position.z - this.controls.target.z);
    const target = new THREE.Vector3(0, 5.35, 0);
    const dir = new THREE.Vector3(Math.sin(az), -0.07, Math.cos(az)).normalize();
    const box = phone ? { x0: -1.75, x1: 1.75, y0: -0.6, y1: 0.66 } : { x0: -0.9, x1: 0.9, y0: -0.8, y1: 0.84 };
    const d = this._fit(this._wholePoints(), target, dir, box);
    return { pos: target.clone().addScaledVector(dir, d), target };
  }

  storyView(story) {
    const ps = story.photos;
    const c = new THREE.Vector3();
    ps.forEach((p) => c.add(p.rest));
    c.divideScalar(ps.length);
    const pts = [];
    ps.forEach((p) => {
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) pts.push(new THREE.Vector3(p.rest.x + sx * 0.55, p.rest.y + sy * (p.h / 2 + 0.05), p.rest.z));
      pts.push(new THREE.Vector3(p.rest.x, p.rest.y, p.rest.z).addScaledVector(new THREE.Vector3(p.rest.z, 0, -p.rest.x).normalize(), 0.55));
    });
    const th = story.sector.mid;
    const dir = new THREE.Vector3(Math.cos(th), -0.1, Math.sin(th)).normalize();
    const { freeW, fullH } = this._viewport();
    const phone = freeW / fullH < 0.8;
    const box = phone ? { x0: -1.3, x1: 1.3, y0: -0.3, y1: 0.7 } : { x0: -0.8, x1: 0.8, y0: -0.62, y1: 0.75 };
    const target = c.clone();
    const d = clamp(this._fit(pts, target, dir, box), 4, 26);
    return { pos: target.clone().addScaledVector(dir, d), target };
  }

  photoView(photo) {
    const P = photo.rest.clone();
    const { freeW, freeH, fullH } = this._viewport();
    const tanH = this._tanHalf();
    const fill = freeW / fullH < 0.8 ? 0.62 : 0.4;
    const distH = (photo.h * fullH) / (2 * tanH * fill * freeH);
    const distW = ((photo.w + 0.05) * 1.07 * fullH) / (2 * tanH * 0.88 * freeW);
    const dist = Math.max(distH, distW);
    // approach from the camera's side, biased outward so nearer photos don't block it
    const fromCam = new THREE.Vector3(this.camera.position.x - P.x, 0, this.camera.position.z - P.z);
    if (fromCam.lengthSq() < 1e-4) fromCam.set(P.x, 0, P.z);
    fromCam.normalize();
    const out = new THREE.Vector3(P.x, 0, P.z).normalize();
    const dir = fromCam.multiplyScalar(0.55).addScaledVector(out, 0.45).normalize();
    const pos = P.clone().addScaledVector(dir, dist); pos.y += 0.04;
    return { pos, target: P };
  }

  flyTo({ pos, target }, duration = 1.5) {
    if (this.reducedMotion) duration = 0.001;
    const off0 = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);
    const off1 = new THREE.Vector3().subVectors(pos, target);
    const s0 = new THREE.Spherical().setFromVector3(off0);
    const s1 = new THREE.Spherical().setFromVector3(off1);
    let dTheta = s1.theta - s0.theta;
    while (dTheta > Math.PI) dTheta -= Math.PI * 2;
    while (dTheta < -Math.PI) dTheta += Math.PI * 2;
    this.flight = {
      t0: this.controls.target.clone(), t1: target.clone(), s0, s1, dTheta,
      start: performance.now(), dur: duration * 1000,
    };
    this.controls.enabled = false;
    this.controls.autoRotate = false;
  }

  _updateFlight(now) {
    const f = this.flight;
    if (!f) return;
    const k = clamp((now - f.start) / f.dur, 0, 1);
    const e = easeInOut(k);
    const target = this._flightTarget.lerpVectors(f.t0, f.t1, e);
    const r = Math.exp(lerp(Math.log(f.s0.radius), Math.log(f.s1.radius), e));
    const sph = this._flightSph.set(r, lerp(f.s0.phi, f.s1.phi, e), f.s0.theta + f.dTheta * e);
    const off = this._flightOff.setFromSpherical(sph);
    this.camera.position.copy(target).add(off);
    this.controls.target.copy(target);
    this.camera.lookAt(target);
    if (k >= 1) {
      this.flight = null;
      this.controls.enabled = true;
      this.controls.update();
      this.emit('flightend');
    }
  }

  setInset(right, bottom) {
    this.insetTarget.right = right;
    this.insetTarget.bottom = bottom;
  }

  _applyInset(dt) {
    const k = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
    this.inset.right = lerp(this.inset.right, this.insetTarget.right, k);
    this.inset.bottom = lerp(this.inset.bottom, this.insetTarget.bottom, k);
    if (Math.abs(this.inset.right - this.insetTarget.right) < 0.5) this.inset.right = this.insetTarget.right;
    if (Math.abs(this.inset.bottom - this.insetTarget.bottom) < 0.5) this.inset.bottom = this.insetTarget.bottom;
    const { right, bottom } = this.inset;
    const W = this.width, H = this.height;
    if (right > 0 || bottom > 0) {
      this.camera.setViewOffset(W + right, H + bottom, right, bottom, W, H);
    } else if (this.camera.view && this.camera.view.enabled) {
      this.camera.clearViewOffset();
    }
  }

  // -------------------------------------------------------------------------
  // Picking & state
  // -------------------------------------------------------------------------
  pick(clientX, clientY) {
    if (!this.plateHits) return null;
    const rect = this.rect; // measured on resize: no layout read per pick
    this._tmp2.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this._tmp2, this.camera);
    const hits = this.raycaster.intersectObjects(this._pickables, false);
    for (const h of hits) {
      if (h.object.userData.photo && !h.object.parent.visible) continue;
      if (h.object.userData.photo) return { photo: h.object.userData.photo, kind: 'photo' };
      if ((h.object === this.anchors || h.object === this.pompoms) && h.instanceId != null) return { photo: this.photos[h.instanceId], kind: 'umbrella' };
    }
    return null;
  }

  setHovered(photo) { this.hovered = photo; }
  setSelected(photo) { this.selected = photo; this._updatePhotoOcclusion(); }

  _updatePhotoOcclusion() {
    // Only the canopy photo layout owns this temporary visibility state.
    if (!this.photoOccluders) return;
    for (const card of this.photoOccluders) card.group.visible = true;
    this.photoOccluders.clear();
    const selected = this.selected && this.cards.find(card => card.photo === this.selected);
    if (!selected) return;
    this.camera.updateMatrixWorld(true);
    const point = new THREE.Vector3();
    const bounds = card => {
      card.group.updateWorldMatrix(true, false);
      const rect = { left: Infinity, right: -Infinity, top: -Infinity, bottom: Infinity };
      for (const x of [-card.photo.w / 2, card.photo.w / 2]) for (const y of [-card.photo.h / 2, card.photo.h / 2]) {
        point.set(x, y, 0).applyMatrix4(card.group.matrixWorld).project(this.camera);
        rect.left = Math.min(rect.left, point.x); rect.right = Math.max(rect.right, point.x);
        rect.bottom = Math.min(rect.bottom, point.y); rect.top = Math.max(rect.top, point.y);
      }
      rect.depth = -point.setFromMatrixPosition(card.group.matrixWorld).applyMatrix4(this.camera.matrixWorldInverse).z;
      return rect;
    };
    const target = bounds(selected);
    for (const card of this.cards) {
      if (card === selected || !card.group.visible) continue;
      const rect = bounds(card);
      if (rect.depth > this.camera.near && rect.depth < target.depth && rect.left < target.right && rect.right > target.left && rect.bottom < target.top && rect.top > target.bottom) {
        card.group.visible = false; this.photoOccluders.add(card);
      }
    }
  }
  setFocusStory(story) { this.focusStory = story; }

  screenPosition(photo) {
    const card = this.cards.find((c) => c.photo === photo);
    if (!card) return null;
    const v = card.group.position.clone().project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    return { x: rect.left + (v.x * 0.5 + 0.5) * rect.width, y: rect.top + (-v.y * 0.5 + 0.5) * rect.height, visible: v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1 };
  }

  // -------------------------------------------------------------------------
  resize() {
    const W = window.innerWidth, H = window.innerHeight;
    this.width = W; this.height = H;
    this.camera.fov = W / H < 0.8 ? 54 : 42;
    this.camera.aspect = W / H;
    this.renderer.setSize(W, H, false);
    this.camera.updateProjectionMatrix();
    if (this.sparkles) {
      this.sparkles.material.uniforms.uScale.value = H * this.dpr / (2 * this._tanHalf()) * 0.06;
      this.sparkles.material.uniforms.uMaxSize.value = 70 * this.dpr;
    }
    this._applyInset(1);
    this.rect = this.canvas.getBoundingClientRect();
    this.redraw(); // resizing clears the canvas
  }

  // Redraw the still while paused (the running loop draws anyway).
  redraw() {
    if (this._drawn && !this.running && !this.contextLost) this.renderer.render(this.scene, this.camera);
  }

  // Compile every shader in parallel (KHR_parallel_shader_compile) instead of
  // stalling the first frame on them.
  compile() {
    return this.renderer.compileAsync(this.scene, this.camera).catch(() => {});
  }

  _adaptQuality(dt) {
    // Follow the frame rate in both directions, between 1 and maxDpr. Only frames
    // drawn while running count, minus the first ones after a (re)start or a change.
    if (this._warmup > 0) { this._warmup--; return; }
    this._frameSum += dt;
    if (++this._frameCount < 90) return;
    const fps = this._frameCount / this._frameSum;
    this._frameSum = 0;
    this._frameCount = 0;
    let dpr = this.dpr;
    if (fps < 42 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.25);
      this._upAfter = Math.min(this._upAfter * 2, 64); // back off if it keeps flip-flopping
      this._good = 0;
    } else if (fps > 55 && dpr < this.maxDpr) {
      if (++this._good >= this._upAfter) { dpr = Math.min(this.maxDpr, dpr + 0.25); this._good = 0; }
    } else {
      this._good = 0;
    }
    if (dpr === this.dpr) return;
    this.dpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.resize();
    this._warmup = 30;
  }

  // -------------------------------------------------------------------------
  // Run state: main.js runs the loop only while the work is on screen.
  // -------------------------------------------------------------------------
  setRunning(on) {
    this._wantRunning = on;
    on = on && this._drawn && !this.contextLost;
    if (on === this.running) return;
    this.running = on;
    const now = performance.now();
    if (on) {
      // carry on where it paused: no jump in time, flights resume, and the
      // paused time does not count as idle time for the auto-rotate
      const paused = now - this._pausedAt;
      if (this.flight) this.flight.start += paused;
      this.lastInteraction += paused;
      this._last = now;
      this._warmup = 20;
      this._frameSum = 0;
      this._frameCount = 0;
      this._raf = requestAnimationFrame(this._loop);
    } else {
      cancelAnimationFrame(this._raf);
      this._pausedAt = now;
    }
  }

  // Nothing is drawn behind the loader, but the opening view should look as if it
  // had been: run the frame updates (camera limits, cards turning toward the
  // viewer) for a moment without rendering.
  settle(seconds = 1.5) {
    const dt = 1 / 60;
    for (let i = 0; i < seconds * 60; i++) {
      this.time += this.reducedMotion ? 0 : dt;
      this._applyInset(dt);
      this.controls.update(dt);
      this._clampCamera();
      this._updateCards(dt);
    }
  }

  // Draw one complete frame now (also while paused), then wait for setRunning().
  renderFirst() {
    this._last = performance.now() - 1000 / 60;
    this.frame();
    this._drawn = true;
    this._pausedAt = performance.now();
  }

  // pagehide: give the GPU memory back right away (restored on pageshow from bfcache)
  releaseContext() {
    this.setRunning(false);
    if (!this.contextLost) this.renderer.forceContextLoss();
  }
  restoreContext() {
    if (this.contextLost) this.renderer.forceContextRestore();
  }

  frame() {
    const now = performance.now();
    const dt = Math.min((now - this._last) / 1000, 0.1);
    this._last = now;
    this.time += this.reducedMotion ? 0 : dt;
    this.common.uTime.value = this.time;
    this.garden.update(this.time);
    if (this.running) this._adaptQuality(dt);

    this._applyInset(dt);
    if (this.flight) this._updateFlight(now);
    else {
      this.controls.update(dt);
      this._clampCamera();
    }
    this._updateCards(dt);
    this.renderer.render(this.scene, this.camera);
    this.emit('frame', dt);
  }

  _clampCamera() {
    const t = this.controls.target;
    t.x = clamp(t.x, -16, 16); t.z = clamp(t.z, -16, 16); t.y = clamp(t.y, 0.4, 12);
    const c = this.camera.position;
    if (c.y < 0.3) c.y = 0.3;
    const rr = Math.hypot(c.x, c.z);
    if (rr > 28) { c.x *= 28 / rr; c.z *= 28 / rr; }
    if (c.y > 22) c.y = 22;
  }

  _updateCards(dt) {
    if (!this.cards.length) return;
    const t = this.time;
    const k = 1 - Math.exp(-dt * 6);
    const ky = 1 - Math.exp(-dt * 2.6);
    const amp = this.common.uSway.value;
    const cam = this.camera.position;
    const m = this._m, q = this._q, s = this._s, p = this._p, sw = this._sw;
    const hiArr = this.photoThreads.hi, dimArr = this.photoThreads.dim;
    const aHi = this.anchors.geometry.attributes.aHi, aDim = this.anchors.geometry.attributes.aDim;
    const pHi = this.pompoms.geometry.attributes.aHi, pDim = this.pompoms.geometry.attributes.aDim;
    let fadesChanged = false;
    for (const card of this.cards) {
      const ph = card.photo;
      const hiT = ph === this.hovered || ph === this.selected ? 1 : 0;
      const dimT = this.focusStory && ph.story !== this.focusStory ? 1 : this.selected && ph !== this.selected ? 0.45 : 0;
      const memT = this.focusStory && ph.story === this.focusStory ? 1 : 0;
      const hi = ease(card.hi, hiT, k), dim = ease(card.dim, dimT, k);
      if (hi !== card.hi || dim !== card.dim) fadesChanged = true;
      card.hi = hi;
      card.dim = dim;
      card.member = ease(card.member || 0, memT, k);

      const lenCap = ph.anchorY - ph.capY;
      swayAt(t, ph.phase, amp, sw);
      const dx = sw.x * lenCap, dz = sw.y * lenCap;
      const g = card.group;
      g.position.set(ph.rest.x + dx, ph.rest.y, ph.rest.z + dz);

      // turn lazily toward the viewer, with a slow natural twist on the thread
      const want = Math.atan2(cam.x - g.position.x, cam.z - g.position.z);
      const dist = Math.hypot(cam.x - g.position.x, cam.z - g.position.z);
      const settle = Math.max(card.hi, smooth(clamp((9 - dist) / 6, 0, 1)));
      const twist = this.reducedMotion ? 0 : Math.sin(t * 0.27 + ph.phase) * 0.42 * (1 - settle);
      let d = want + twist - card.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      card.yaw += d * ky;
      g.rotation.set(0, card.yaw, (sw.x - sw.y) * 0.6);
      const sc = 1 + 0.07 * card.hi;
      g.scale.setScalar(sc);

      const bright = card.loaded ? 1 - 0.8 * card.dim : 0.15;
      card.mat.color.setScalar(bright);
      card.plate.material.uniforms.uHi.value = card.hi;
      card.plate.material.uniforms.uDim.value = card.dim;
      card.plate.material.uniforms.uMember.value = card.member;

      // cap + bead crystals follow the card
      const i = card.index;
      p.set(ph.rest.x + dx, ph.capY + 0.02, ph.rest.z + dz);
      s.setScalar(0.06 + 0.02 * card.hi);
      m.compose(p, q, s);
      this.caps.setMatrixAt(i * 2, m);
      p.set(ph.rest.x + dx, ph.rest.y - (ph.h / 2) * sc - 0.1, ph.rest.z + dz);
      s.setScalar(0.042);
      m.compose(p, q, s);
      this.caps.setMatrixAt(i * 2 + 1, m);

      hiArr[i * 2] = hiArr[i * 2 + 1] = card.hi;
      dimArr[i * 2] = dimArr[i * 2 + 1] = card.dim;
      aHi.array[i] = card.hi;
      aDim.array[i] = card.dim;
      pHi.array[i] = card.hi;
      pDim.array[i] = card.dim;
    }
    const sel = this.selected && this.cards.find((c) => c.photo === this.selected);
    this._updatePhotoOcclusion();
    if (sel) this.common.uFocusPos.value.copy(sel.group.position);
    const fk = 1 - Math.exp(-dt * 4);
    this.common.uFocusOn.value += ((sel ? 1 : 0) - this.common.uFocusOn.value) * fk;
    // re-upload only what changed: the caps move with the sway, the fades only while easing
    if (amp > 0 || fadesChanged) this.caps.instanceMatrix.needsUpdate = true;
    if (fadesChanged) {
      this.photoThreads.geo.attributes.aHi.needsUpdate = true;
      this.photoThreads.geo.attributes.aDim.needsUpdate = true;
      aHi.needsUpdate = true;
      aDim.needsUpdate = true;
      pHi.needsUpdate = true;
      pDim.needsUpdate = true;
    }
  }

  stats() {
    const info = this.renderer.info;
    return {
      umbrellas: this.umbrellaCount, crystals: this.crystalCount, threads: this.threadCount,
      flowers: this.carpetItems?.length, photos: this.photos.length,
      drawCalls: info.render.calls, triangles: info.render.triangles, dpr: this.dpr,
    };
  }
}


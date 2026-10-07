import * as THREE from 'three';
import { addCrownBlossoms } from './crown-flowers.js';

// A tree-shaped photo canopy, not a recursive tree. Wood and foliage stay on
// the roof; only the single central trunk enters the hanging-photo space.
export const canopyHeight = radius => 24.65 + 5 * (1 - Math.min(radius / 16, 1) ** 2);
export const treeHeightScale = .8;

export function buildMemoryTree(photos) {
  const tree = new THREE.Group(); tree.name = 'travel-memory-tree';
  let seed = 23399;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const bark = document.createElement('canvas'); bark.width = 256; bark.height = 1024;
  const c = bark.getContext('2d'); c.fillStyle = '#b4895d'; c.fillRect(0, 0, 256, 1024);
  for (let n = 0; n < 150; n++) {
    c.beginPath(); c.strokeStyle = n % 3 ? '#593b2390' : '#ffe2ae90'; c.lineWidth = 1 + n % 3;
    for (let y = 0; y <= 1024; y += 8) {
      const x = n * 1.77 + Math.sin(y * .018 + n) * 3 + Math.sin(y * .057 + n * 2) * 1.2;
      y ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
  }
  const wood = new THREE.CanvasTexture(bark); wood.colorSpace = THREE.SRGBColorSpace;
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  const heightCanvas = document.createElement('canvas'); heightCanvas.width = bark.width; heightCanvas.height = bark.height;
  const heightContext = heightCanvas.getContext('2d'), heightPixels = c.getImageData(0, 0, bark.width, bark.height);
  for (let i = 0; i < heightPixels.data.length; i += 4) {
    const gray = heightPixels.data[i] * .2126 + heightPixels.data[i + 1] * .7152 + heightPixels.data[i + 2] * .0722;
    heightPixels.data[i] = heightPixels.data[i + 1] = heightPixels.data[i + 2] = gray;
  }
  heightContext.putImageData(heightPixels, 0, 0);
  const barkHeight = new THREE.CanvasTexture(heightCanvas); barkHeight.wrapS = barkHeight.wrapT = THREE.RepeatWrapping;
  const barkMaterial = new THREE.MeshStandardMaterial({ map: wood, bumpMap: barkHeight, bumpScale: .18, roughness: .96, metalness: 0, color: '#f0d4b0' });
  const leaf = document.createElement('canvas'); leaf.width = leaf.height = 128;
  const l = leaf.getContext('2d'), gradient = l.createLinearGradient(28, 0, 90, 128);
  gradient.addColorStop(0, '#e2d99c'); gradient.addColorStop(.4, '#a7b866'); gradient.addColorStop(1, '#66843e');
  l.fillStyle = gradient; l.beginPath(); l.moveTo(64, 8);
  l.bezierCurveTo(110, 38, 110, 83, 64, 121); l.bezierCurveTo(18, 83, 18, 38, 64, 8); l.fill();
  l.strokeStyle = '#d6df8c'; l.lineWidth = 1.5; l.beginPath(); l.moveTo(64, 14); l.lineTo(64, 119); l.stroke();
  l.strokeStyle = '#d6df8c80'; l.lineWidth = .8;
  for (let y = 30; y < 106; y += 13) { l.beginPath(); l.moveTo(64, y + 9); l.lineTo(39, y - 4); l.moveTo(64, y + 9); l.lineTo(89, y - 4); l.stroke(); }
  const leafMap = new THREE.CanvasTexture(leaf); leafMap.colorSpace = THREE.SRGBColorSpace;
  const v = (x, y, z) => new THREE.Vector3(x, y, z);
  const trunkCurve = new THREE.CatmullRomCurve3([v(0, 1.4, 0), v(-.15, 7.15, .1), v(.16, 15.9, 0), v(-.1, 24.65, -.1), v(0, 29.65, 0)]);
  const trunk = new THREE.TubeGeometry(trunkCurve, 64, 1, 20, false), position = trunk.attributes.position, trunkUV = trunk.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    const t = Math.floor(i / 21) / 64, center = trunkCurve.getPointAt(t), profile = 1.2 + .15 * (1 - t), radius = (.52 + .78 * (1 - t) ** 2) * profile;
    // Bury the bottom without resampling or thinning the visible upper trunk.
    const rootDepth = 1.65 * Math.max(0, 1 - t / .1) ** 2;
    position.setXYZ(i, center.x + (position.getX(i) - center.x) * radius, center.y + (position.getY(i) - center.y) * radius - rootDepth, center.z + (position.getZ(i) - center.z) * radius);
    trunkUV.setXY(i, trunkUV.getX(i) * 1.25, trunkUV.getY(i) * profile);
  }
  trunk.computeVertexNormals(); trunk.computeBoundingBox();
  const stem = new THREE.Mesh(trunk, barkMaterial); stem.name = 'tree-main-trunk'; tree.add(stem);
  const parts = [];
  const twig = (points, radius, flare = 0, textureRatio = 1) => {
    const curve = new THREE.CatmullRomCurve3(points), geometry = new THREE.TubeGeometry(curve, 20, radius, 10, false), p = geometry.attributes.position, uv = geometry.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const t = Math.floor(i / 11) / 20, center = curve.getPointAt(t), profile = 1 + flare * (1 - t) ** 8;
      p.setXYZ(i, center.x + (p.getX(i) - center.x) * profile, center.y + (p.getY(i) - center.y) * profile, center.z + (p.getZ(i) - center.z) * profile);
      uv.setY(i, uv.getY(i) * textureRatio * profile);
    }
    if (flare) geometry.computeVertexNormals(); parts.push(geometry);
  };
  const roofPoint = (a, r) => v(Math.cos(a) * r, canopyHeight(r), Math.sin(a) * r);
  const canopyPoint = (a, r) => { const point = roofPoint(a, r); point.x *= 1.15; point.z *= 1.15; return point; };
  for (let i = 0; i < 24; i++) {
    const a = i * Math.PI / 12;
    twig([canopyPoint(a, 0), canopyPoint(a + .04, 5), canopyPoint(a - .025, 11), canopyPoint(a, 16)], .1495, .3, 1.15);
    for (const side of [-1, 1]) twig([canopyPoint(a, 8), canopyPoint(a + side * .07, 11), canopyPoint(a + side * .12, 15.5)], .055);
  }
  // Photo attachments follow the same roof profile as the umbrella ribs.
  for (const p of photos) {
    const a = Math.atan2(p.rest.z, p.rest.x), r = Math.hypot(p.rest.x, p.rest.z);
    twig([roofPoint(a, 0), roofPoint(a, r * .6), v(p.rest.x, p.anchorY / treeHeightScale, p.rest.z)], .018);
  }
  const addWood = name => {
    const positions = [], normals = [], uvs = [], indices = [];
    for (const part of parts) {
      const offset = positions.length / 3;
      positions.push(...part.attributes.position.array); normals.push(...part.attributes.normal.array); uvs.push(...part.attributes.uv.array);
      for (const index of part.index.array) indices.push(index + offset);
      part.dispose();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeBoundingBox();
    const mesh = new THREE.Mesh(geometry, barkMaterial); mesh.name = name; tree.add(mesh); parts.length = 0;
  };
  addWood('tree-canopy-ribs');
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    twig([v(Math.cos(a) * 3.7, .75, Math.sin(a) * 3.7), v(Math.cos(a) * 1.6, 1.9, Math.sin(a) * 1.6), v(0, 4.4, 0)], (.24 + i % 3 * .04) * 1.25, 0, 1.25);
  }
  addWood('tree-base-roots');
  const originalCount = innerWidth <= 760 ? 6000 : 16000, count = originalCount * 2;
  const leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshLambertMaterial({ map: leafMap, side: THREE.DoubleSide, alphaTest: .35 }), count);
  leaves.name = 'tree-leaf-crown';
  const dummy = new THREE.Object3D(), color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    let r = Math.sqrt(rand()) * (16 + .55 * Math.sin(a * 5));
    if (i >= originalCount && i < originalCount * 1.5) r *= .72 + rand() * .16;
    dummy.position.copy(canopyPoint(a, r)); dummy.position.y += .6 + rand() ** 2 * (1.8 + Math.max(0, 1 - r / 16));
    dummy.rotation.set(-Math.PI / 2 + (rand() - .5) * 1.2, (rand() - .5) * .6, rand() * Math.PI * 2);
    dummy.scale.setScalar((.5 + rand() * .6) * 1.2); dummy.updateMatrix(); leaves.setMatrixAt(i, dummy.matrix);
    leaves.setColorAt(i, color.setHSL(.2 + rand() * .045, .3 + rand() * .18, .54 + rand() * .18));
  }
  leaves.computeBoundingBox(); leaves.computeBoundingSphere(); tree.add(leaves);
  addCrownBlossoms(tree, canopyPoint, rand);
  tree.scale.y = treeHeightScale;
  return tree;
}


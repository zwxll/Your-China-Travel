import * as THREE from 'three';
import { CanopyScene } from '../umbrella-canopy/js/scene.js';
import { buildTreeGarden } from './garden.js';
import { buildMemoryTree, canopyHeight, treeHeightScale } from './tree-model.js';

// Camera controls, flights, texture uploads and lifecycle are read-only reuse.
export class TravelRingTreeScene extends CanopyScene {
  buildRoom() {
    this._buildLights();
    this.garden = buildTreeGarden(this.scene, this.reducedMotion);
    const sun = new THREE.DirectionalLight('#ffe1aa', 1.3); sun.position.set(-12, 18, 7); this.scene.add(sun);
    this.common.uSway.value = 0;
    this.year = null;
  }

  setPhotos(photos, cities, years) {
    this.photos = photos; this.stories = cities;
    this._layoutBranches();
    this._buildTree();
    this._buildYearRings(years);
    this._buildKeepsakes();
    this.cardGroup = new THREE.Group();
    this.scene.add(this.cardGroup);
    this.cards = photos.map(photo => {
      const group = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ map: this.blankMap, color: 0xffffff, fog: false });
      const picture = new THREE.Mesh(this._cardGeometry(photo.w, photo.h), mat);
      // Keep both photo faces clear of the backing plate at distant camera views.
      const vertices = picture.geometry.attributes.position;
      for (let i = 0; i < vertices.count; i++) vertices.setZ(i, Math.sign(vertices.getZ(i)) * .05);
      vertices.needsUpdate = true;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(photo.w + .18, photo.h + .27, .035), new THREE.MeshLambertMaterial({ color: '#fff4df' }));
      plate.position.y = -.035;
      picture.userData.photo = plate.userData.photo = photo;
      const clip = new THREE.Mesh(new THREE.BoxGeometry(.085, .22, .07), new THREE.MeshLambertMaterial({ color: '#ad7642' }));
      clip.position.set(0, photo.h / 2 + .09, .06);
      group.add(plate, picture, clip); group.position.copy(photo.rest); this.cardGroup.add(group);
      return { photo, group, mat, plate, dim: 0, loaded: false, yaw: 0 };
    });
    this.plateHits = this.cards.flatMap(card => [...card.group.children]);
    this._pickables = this.plateHits;
    const threadPoints = photos.flatMap(p => [p.rest.x, p.anchorY, p.rest.z, p.rest.x, p.rest.y + p.h / 2, p.rest.z]);
    const threads = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(threadPoints, 3)), new THREE.LineBasicMaterial({ color: '#a49d82', transparent: true, opacity: .45 }));
    threads.name = 'travel-photo-threads'; this.scene.add(threads);
    this.clusterMode = false; this._clusterPoint = new THREE.Vector3();
    this.hiddenRings = new Set(); this.yearTransition = null;
    this.rotationActive = false; this.rotationDirection = 1; this.rotationSpeed = 1; this.hangingTime = 0; this.hangingAmplitude = 0;
    this.cityClusters = cities.map(city => {
      const group = new THREE.Group(); group.name = `city-cluster-${city.id}`; group.visible = false;
      const label = this._citySign(city);
      label.position.y = 3; group.add(label);
      const strings = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#a49d82', transparent: true, opacity: .45 }));
      const tails = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#a49d82', transparent: true, opacity: .7 }));
      group.add(strings, tails); this.cardGroup.add(group);
      const cluster = { city, group, label, strings, tails, ropes: [], cards: this.cards.filter(card => card.photo.story === city) };
      tails.userData.rope = cluster; return cluster;
    });
    this._positionLanterns();
    this.resize();
  }

  _citySign(city) {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true }));
    sign.userData.city = city; sign.scale.set(4, 1, 1);
    this._writeCitySign(sign, city.title);
    return sign;
  }

  _writeCitySign(sign, text) {
    const canvas = sign.material.map.image, c = canvas.getContext('2d'); c.clearRect(0, 0, 512, 128);
    c.fillStyle = '#eed4a7'; c.strokeStyle = '#b58d5d'; c.lineWidth = 4;
    c.beginPath(); c.roundRect(3, 3, 506, 122, 22); c.fill(); c.stroke();
    c.fillStyle = '#67421e'; c.font = 'bold 64px KaiTi, STKaiti, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 256, 64, 464);
    sign.material.map.needsUpdate = true;
  }

  clusterCities() { return this.stories.filter(city => city.photos.some(p => this.year === null || p.year === this.year)); }

  setClusterMode(active) {
    this.cancelYearFocus();
    this.endRopeDrag();
    if (this.yearTransition) this.setYear(this.yearTransition.year);
    this.clusterMode = active; this.hoveredCity = null;
    for (const cluster of this.cityClusters) for (const card of cluster.cards) {
      (active ? cluster.group : this.cardGroup).add(card.group);
      if (!active) { card.group.position.copy(card.photo.rest); card.group.rotation.z = 0; card.group.scale.setScalar(1); card.group.visible = true; card.layoutScale = 1; }
    }
    for (const name of ['travel-photo-threads', 'travel-city-wood-tags']) this.scene.getObjectByName(name).visible = !active;
    if (active) this._layoutCityClusters(); else { this.cityClusters.forEach(c => { c.group.visible = false; }); this._positionLanterns(); }
    this._updateCards(1); this.redraw();
  }

  _layoutCityClusters() {
    const year = card => Number.isInteger(card.photo.year) ? card.photo.year : -Infinity;
    const blocks = this.cityClusters.map(cluster => {
      const photos = cluster.cards.slice().sort((a, b) => year(b) - year(a));
      cluster.group.visible = photos.length > 0;
      cluster.cards.forEach(card => { card.group.visible = photos.includes(card); });
      return { cluster, photos, columns: Math.max(1, Math.ceil(photos.length / 7)), year: photos.length ? year(photos[0]) : -Infinity };
    }).filter(block => block.photos.length).sort((a, b) => b.year - a.year);
    const radii = [15.8, 11.6, 7.4];
    let density = 1, placements;
    // Keep each block whole; only scale down if all three rings cannot contain the catalog.
    for (;;) {
      placements = []; let ring = 0, angle = 0;
      for (const block of blocks) {
        let span = (block.columns * 2.5 + .8) * density / radii[ring];
        if (angle + span > Math.PI * 2) { ring++; angle = 0; }
        if (ring === radii.length) break;
        span = (block.columns * 2.5 + .8) * density / radii[ring];
        if (span > Math.PI * 2) break;
        placements.push({ ...block, radius: radii[ring], mid: Math.PI / 2 - .35 + angle + span / 2 });
        angle += span;
      }
      if (placements.length === blocks.length) break;
      density *= .9;
    }
    const lift = Math.max(0, Math.min(...placements.map(p => canopyHeight(p.radius) * treeHeightScale - 23.8 * treeHeightScale - .375 * density - .2))) / 2;
    for (const { cluster, photos, columns, radius, mid } of placements) {
      cluster.ringIndex = radii.indexOf(radius);
      cluster.group.position.set(Math.cos(mid) * radius, 23.8 * treeHeightScale + lift, Math.sin(mid) * radius);
      cluster.group.rotation.y = Math.PI / 2 - mid;
      cluster.label.position.y = 0; cluster.label.scale.set(Math.min(4.3, columns * 2.5) * density, .75 * density, 1);
      for (const [i, card] of photos.entries()) {
        const width = (i === 0 ? 2.15 : 1.85) * density, maxHeight = 1.35 * density;
        card.layoutScale = Math.min(width / (card.photo.w + .18), maxHeight / (card.photo.h + .27));
        card.group.scale.setScalar(card.layoutScale);
      }
      for (let i = 0; i < photos.length; i += columns) {
        const row = photos.slice(i, i + columns);
        const y = (-1.9 - Math.floor(i / columns) * 1.6) * density;
        row.forEach((card, col) => { card.group.position.set((col - (columns - 1) / 2) * 2.5 * density, y, 0); card.hangingRest = card.group.position.clone(); });
      }
      cluster.hangingTop = canopyHeight(radius) * treeHeightScale - cluster.group.position.y;
    }
    this._applyClusterVisibility();
    this.scene.updateMatrixWorld(true);
  }

  pick(x, y) {
    if (!this.clusterMode) return super.pick(x, y);
    const pickables = this.cityClusters.filter(c => c.group.visible).flatMap(c => [...(c.label.visible ? [c.label] : []), c.tails, ...c.cards.filter(card => card.group.visible).flatMap(card => card.group.children)]);
    this._tmp2.set(((x - this.rect.left) / this.rect.width) * 2 - 1, -((y - this.rect.top) / this.rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this._tmp2, this.camera);
    this.raycaster.params.Line.threshold = this.camera.position.distanceTo(this.controls.target) * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 16 / this.rect.height;
    const hit = this.raycaster.intersectObjects(pickables, false)[0];
    if (hit?.object.userData.rope) return { rope: hit.object.userData.rope.ropes[Math.floor(hit.index / 2)] };
    if (hit?.object.userData.city) return { city: hit.object.userData.city };
    return hit?.object.userData.photo ? { photo: hit.object.userData.photo, kind: 'photo' } : null;
  }

  photoView(photo) {
    if (!this.clusterMode) return super.photoView(photo);
    const card = this.cards.find(c => c.photo === photo);
    this.scene.updateMatrixWorld(true);
    return super.photoView({ ...photo, rest: card.group.getWorldPosition(new THREE.Vector3()), w: photo.w * card.group.scale.x, h: photo.h * card.group.scale.y });
  }

  storyView(city) {
    if (!this.clusterMode) return super.storyView(city);
    const cluster = this.cityClusters.find(c => c.city === city), bounds = new THREE.Box3();
    for (const card of cluster.cards) if (card.group.visible) bounds.expandByObject(card.group);
    bounds.expandByObject(cluster.label);
    const target = bounds.getCenter(new THREE.Vector3()), dir = new THREE.Vector3(cluster.group.position.x, .4, cluster.group.position.z).normalize();
    target.y = Math.min(target.y, 17);
    const points = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) points.push(new THREE.Vector3(x, y, z));
    const distance = Math.max(12, this._fit(points, target, dir, { x0: Math.max(-.6, 660 / this.width - 1), x1: .8, y0: -.68, y1: .72 }));
    return { pos: target.clone().addScaledVector(dir, distance), target };
  }

  _layoutBranches() {
    const total = this.photos.length;
    const gap = Math.min(.06, Math.PI / Math.max(1, this.stories.length));
    const usable = Math.PI * 2 - gap * this.stories.length;
    let angle = Math.PI / 2 - usable * this.stories[0].photos.length / total / 2;
    const width = total > 180 ? 1 : total > 80 ? 1.18 : 1.6;
    for (const [cityIndex, city] of this.stories.entries()) {
      const sector = usable * city.photos.length / total;
      city.sector = { a0: angle, a1: angle + sector, mid: angle + sector / 2 };
      city.photos.forEach((p, i) => {
        const t = angle + sector * ((i * .61803398875 + .35) % 1);
        const layer = (i + cityIndex) % 4;
        const r = 6 + 6.8 * ((i * .41421356237 + cityIndex * .17 + .25) % 1);
        p.w = width;
        // Extreme panoramas/portraits retain aspect ratio without crossing the garden.
        p.h = width * p.aspect;
        if (p.h > 3.2) { p.w *= 3.2 / p.h; p.h = 3.2; }
        const y = (4.7 + layer * 2.35 + ((i * .73 + cityIndex * .23) % 1) * 1.05) * treeHeightScale;
        p.rest = new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r);
        p.anchorY = canopyHeight(r) * treeHeightScale;
        p.phase = i;
      });
      angle += sector + gap;
    }
    // Shift the complete arrangement uniformly; retain half the shortest empty cord.
    this.photoLift = Math.max(0, Math.min(...this.photos.map(p => p.anchorY - p.rest.y - p.h / 2 - .2))) / 2;
    this.photos.forEach(p => { p.rest.y += this.photoLift; });
  }

  _buildTree() {
    this.tree = buildMemoryTree(this.photos);
    this.scene.add(this.tree);
    const view = this.wholeView();
    this.controls.maxDistance = Math.max(46, view.pos.distanceTo(view.target) * 1.5);
  }

  _buildYearRings(years) {
    this.yearRings = new Map();
    this.yearLabels = new Map();
    this.yearRoutes = new Map();
    const platform = new THREE.Group(); platform.name = 'travel-year-platform';
    for (let i = 0; i < 3; i++) {
      const radius = 7.25 - i * 1.55, height = .42;
      const tier = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + .12, height, 128), new THREE.MeshStandardMaterial({ color: ['#cbaa78', '#dec494', '#ecd9b2'][i], roughness: .9 }));
      tier.position.y = .28 + i * .42; platform.add(tier);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(radius - .04, .028, 6, 128), new THREE.MeshBasicMaterial({ color: '#fce1a6' }));
      rim.rotation.x = Math.PI / 2; rim.position.y = .5 + i * .42; platform.add(rim);
    }
    this.scene.add(platform);
    years.forEach((year, i) => {
      const r = 1.85 + (i + 1) / Math.max(1, years.length) * 5.1;
      const y = r < 4.15 ? 1.355 : r < 5.7 ? .935 : .515;
      const innerEdge = r < 4.15 ? 0 : r < 5.7 ? 4.15 : 5.7;
      const outerEdge = r < 4.15 ? 4.15 : r < 5.7 ? 5.7 : 7.25;
      const glowWidth = Math.min(.25, outerEdge - r - .015, r - innerEdge - .015);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .028, 6, 128), new THREE.MeshBasicMaterial({ color: '#9c753d' }));
      ring.rotation.x = Math.PI / 2; ring.position.y = y;
      // Feathered annular light stays on the base, without blooming over photos.
      const glow = new THREE.Mesh(new THREE.RingGeometry(r - glowWidth, r + glowWidth, 128), new THREE.ShaderMaterial({
        uniforms: { radius: { value: r }, width: { value: glowWidth }, tint: { value: new THREE.Color('#ffad3d') } },
        vertexShader: 'varying float radial; void main(){ radial=length(position.xy); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'uniform float radius; uniform float width; uniform vec3 tint; varying float radial; void main(){ float d=abs(radial-radius)/width; float alpha=.72*exp(-d*d*4.0)*(1.0-smoothstep(.7,1.0,d)); gl_FragColor=vec4(tint,alpha);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
      }));
      glow.name = 'year-ring-warm-glow'; glow.position.z = -.008; glow.visible = false; ring.add(glow);
      this.yearRings.set(year, ring); this.scene.add(ring);
      const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 80;
      const c = canvas.getContext('2d'); c.font = 'bold 72px Georgia'; c.textAlign = 'center';
      c.fillStyle = '#fff0cb'; c.fillText(String(year), 130, 69);
      c.fillStyle = '#392716'; c.shadowColor = '#38251080'; c.shadowBlur = 2; c.shadowOffsetY = -1; c.fillText(String(year), 128, 67);
      const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
      const labelRadius = Math.max(r - .34, innerEdge + .27);
      const stamp = new THREE.PlaneGeometry(1.45, .5).toNonIndexed();
      const positions = [], uvs = [], p = stamp.attributes.position, uv = stamp.attributes.uv;
      for (let j = 0; j < p.count; j++) {
        positions.push(p.getX(j), y + .035, labelRadius - p.getY(j));
        uvs.push(uv.getX(j), uv.getY(j));
      }
      stamp.dispose();
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      const label = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true }));
      this.yearLabels.set(year, label); this.scene.add(label);
      this._buildYearRoute(year, r, y, labelRadius);
    });
  }

  _buildYearRoute(year, radius, y, labelRadius) {
    const cities = this.stories.map(city => {
      const photos = city.photos.filter(p => p.year === year);
      const date = photos.map(p => String(p.date || '')).filter(d => /^\d{4}-\d{2}(?:-\d{2})?$/.test(d)).sort()[0] || '9999';
      return { city, photos, date };
    }).filter(c => c.photos.length).sort((a, b) => a.date.localeCompare(b.date)).map(c => c.city);
    const route = new THREE.Group(); route.name = `year-city-route-${year}`; route.visible = false;
    route.userData.cities = cities; this.yearRoutes.set(year, route); this.scene.add(route);
    if (!cities.length) return;
    const yearGap = Math.atan2(.95, labelRadius), step = (Math.PI * 2 - yearGap * 2) / cities.length;
    const cityRadius = labelRadius + .05;
    const points = [], positions = [], uvs = [];
    const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 80;
    const c = canvas.getContext('2d'), tile = canvas.width / cities.length;
    c.font = 'bold 64px KaiTi, STKaiti, serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.065, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe4a1' }), cities.length);
    const matrix = new THREE.Matrix4();
    cities.forEach((city, i) => {
      const angle = yearGap + step * (i + .5), sin = Math.sin(angle), cos = Math.cos(angle);
      c.strokeStyle = '#fff7df'; c.lineWidth = 2.4; c.strokeText(city.title, tile * (i + .5), 40, tile - 12);
      c.strokeStyle = '#35200f'; c.lineWidth = .7; c.strokeText(city.title, tile * (i + .5), 40, tile - 12);
      c.fillStyle = '#35200f'; c.fillText(city.title, tile * (i + .5), 40, tile - 12);
      const textWidth = Math.min(tile - 8, c.measureText(city.title).width + 8);
      const stamp = new THREE.PlaneGeometry(Math.min(textWidth * .6 / 80, cityRadius * step * .78), .6).toNonIndexed();
      const p = stamp.attributes.position, uv = stamp.attributes.uv;
      for (let j = 0; j < p.count; j++) {
        positions.push(sin * (cityRadius - p.getY(j)) + cos * p.getX(j), y + .035, cos * (cityRadius - p.getY(j)) - sin * p.getX(j));
        uvs.push((tile * i + (tile - textWidth) / 2 + uv.getX(j) * textWidth) / canvas.width, uv.getY(j));
      }
      stamp.dispose();
      dots.setMatrixAt(i, matrix.makeTranslation(sin * radius, y + .055, cos * radius));
      // Each arc and arrow leads from the year (angle zero) to the next city.
      const from = i === 0 ? Math.min(.3, .8 / radius) : angle - step;
      for (let j = 0; j < 24; j++) for (const a of [from + (angle - from) * j / 24, from + (angle - from) * (j + 1) / 24]) points.push(Math.sin(a) * radius, y + .055, Math.cos(a) * radius);
      const a = (from + angle) / 2, x = Math.sin(a) * radius, z = Math.cos(a) * radius;
      for (const side of [-1, 1]) points.push(x, y + .055, z, x - Math.cos(a) * .16 + Math.sin(a) * .08 * side, y + .055, z + Math.sin(a) * .16 + Math.cos(a) * .08 * side);
    });
    dots.instanceMatrix.needsUpdate = true;
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    const labels = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true }));
    labels.name = 'year-route-city-names';
    const path = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3)), new THREE.LineBasicMaterial({ color: '#ffd07a' }));
    route.add(path, dots, labels);
  }

  _buildKeepsakes() {
    const tags = new THREE.Group(); tags.name = 'travel-city-wood-tags';
    for (const [i, city] of this.stories.entries()) {
      const canvas = document.createElement('canvas'); canvas.width = 192; canvas.height = 480;
      const c = canvas.getContext('2d'); c.fillStyle = '#eac797'; c.fillRect(0, 0, 192, 480);
      c.strokeStyle = '#ab784757'; c.lineWidth = 3; c.strokeRect(10, 10, 172, 460);
      for (let n = 0; n < 15; n++) { c.fillStyle = '#ad784410'; c.fillRect(13 + n * 11, 0, 2, 480); }
      c.fillStyle = '#3f2d1d'; c.font = 'bold 48px KaiTi, STKaiti, serif'; c.textAlign = 'center';
      const text = [...city.title], gap = Math.min(65, 345 / text.length);
      text.forEach((char, n) => c.fillText(char, 96, 95 + n * gap));
      c.beginPath(); c.arc(96, 32, 6, 0, Math.PI * 2); c.fill();
      const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
      const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map, color: '#fff7e8' }));
      tag.userData.city = city;
      const a = city.sector.mid; tag.position.set(Math.cos(a) * 10.8, (6.9 + i % 3 * 2.5) * treeHeightScale + this.photoLift, Math.sin(a) * 10.8); tag.scale.set(.65, 1.63, 1);
      tags.add(tag);
    }
    this.scene.add(tags);
    const lanterns = new THREE.Group(); lanterns.name = 'travel-warm-lanterns'; this.lanternGroup = lanterns;
    const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 64;
    const c = glowCanvas.getContext('2d'), gradient = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, '#ffe8af'); gradient.addColorStop(.2, '#eebc6480'); gradient.addColorStop(1, '#ffbc5000');
    c.fillStyle = gradient; c.fillRect(0, 0, 64, 64);
    const glowMap = new THREE.CanvasTexture(glowCanvas);
    const brass = new THREE.MeshStandardMaterial({ color: '#997247', roughness: .8, metalness: .12 });
    const glass = new THREE.MeshStandardMaterial({ color: '#eacb92', roughness: .85, metalness: 0, emissive: '#eab86b', emissiveIntensity: .16 });
    const cordGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, -.085, 0)]);
    const cordMaterial = new THREE.LineBasicMaterial({ color: '#8d795e' });
    const bodyGeometry = new THREE.CylinderGeometry(.095, .11, .32, 10), capGeometry = new THREE.CylinderGeometry(.135, .135, .05, 10);
    const hookGeometry = new THREE.TorusGeometry(.07, .012, 5, 12);
    this.hangingLanterns = this.stories.filter((city, i) => i % 3 === 0).slice(0, 10).map(city => {
      const group = new THREE.Group(); group.name = 'travel-hanging-lantern';
      const cord = new THREE.Line(cordGeometry, cordMaterial); cord.name = 'lantern-short-cord'; group.add(cord);
      const hook = new THREE.Mesh(hookGeometry, brass); hook.name = 'lantern-hook'; hook.position.y = -.15; group.add(hook);
      const body = new THREE.Mesh(bodyGeometry, glass); body.position.y = -.42; group.add(body);
      for (const dy of [-.24, -.6]) { const cap = new THREE.Mesh(capGeometry, brass); cap.position.y = dy; group.add(cap); }
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, opacity: .38, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      glow.position.y = -.42; glow.scale.set(.65, .65, 1); group.add(glow); lanterns.add(group);
      return { city, group, glow, hangingRest: new THREE.Vector3(), card: null };
    });
    this.scene.add(lanterns);
    this.plaqueLanterns = this.stories.map(city => {
      const group = this.hangingLanterns[0].group.clone(); group.name = 'travel-city-plaque-lantern';
      group.children.filter(c => c.isMesh).forEach(c => { c.material = c.material.clone(); });
      const glow = group.children.find(c => c.isSprite); glow.material = glow.material.clone();
      const tag = tags.children.find(t => t.userData.city === city);
      return { city, group, glow, tag };
    });
  }

  _positionLanterns() {
    for (const lamp of this.plaqueLanterns) {
      const cluster = this.cityClusters.find(c => c.city === lamp.city);
      const parent = this.clusterMode ? cluster.group : this.lanternGroup;
      parent.add(lamp.group);
      const sign = this.clusterMode ? cluster.label : lamp.tag;
      lamp.group.position.copy(sign.position); lamp.group.position.y += sign.scale.y / 2 + .95;
      lamp.group.visible = !this.clusterMode || cluster.group.visible;
    }
    for (const lamp of this.hangingLanterns) {
      const cluster = this.cityClusters.find(c => c.city === lamp.city);
      const cards = cluster.cards.filter(c => this.year === null || c.photo.year === this.year);
      if (this.clusterMode) cards.sort((a, b) => b.hangingRest.y - a.hangingRest.y || a.hangingRest.x - b.hangingRest.x);
      lamp.card = cards[0]; lamp.group.visible = !!lamp.card && (!this.clusterMode || cluster.group.visible);
      const parent = this.clusterMode ? cluster.group : this.lanternGroup;
      if (lamp.group.parent !== parent) parent.add(lamp.group);
      if (!lamp.card) continue;
      const card = lamp.card, scale = this.clusterMode ? card.layoutScale : 1;
      lamp.hangingRest.copy(this.clusterMode ? card.hangingRest : card.photo.rest);
      lamp.hangingRest.y += (card.photo.h + .27) * scale / 2 + .95;
      if (this.clusterMode) lamp.hangingRest.z = -.06;
      lamp.group.position.copy(lamp.hangingRest); lamp.group.rotation.z = 0;
    }
  }

  setYear(year) {
    this.cancelYearFocus(false);
    this.endRopeDrag();
    this.yearTransition = null;
    this.year = year;
    for (const [key, ring] of this.yearRings) {
      const active = year === key;
      ring.material.color.set(active ? '#fff2b5' : '#9c753d');
      ring.children[0].visible = active;
      this.yearLabels.get(key).material.color.set(active ? '#ffd59a' : '#ffffff');
      this.yearRoutes.get(key).visible = active;
    }
    if (this.clusterMode) this._applyClusterVisibility(); else this._positionLanterns();
    this._updateCards(1); this.redraw();
  }
  setFocusStory(city) { super.setFocusStory(city); this.hoveredCity = null; this._updateCards(1); this.redraw(); }
  setSelected(photo) { super.setSelected(photo); this._updateCards(1); this.redraw(); }

  _applyClusterVisibility() {
    for (const cluster of this.cityClusters) {
      cluster.cards.forEach(card => { card.group.visible = true; });
      cluster.group.visible = !this.hiddenRings.has(cluster.ringIndex) && cluster.cards.some(card => card.group.visible);
      this._trimClusterStrings(cluster);
    }
    this._positionLanterns();
  }

  _trimClusterStrings(cluster) {
    const bottoms = new Map(), points = [], tails = [];
    for (const card of cluster.cards) {
      if (!card.group.visible) continue;
      const x = card.hangingRest.x;
      const bottom = card.hangingRest.y - ((card.photo.h + .27) / 2 + .035) * card.layoutScale;
      if (!bottoms.has(x) || bottom < bottoms.get(x).bottom) bottoms.set(x, { bottom, length: card.photo.h * card.layoutScale / 3 });
    }
    cluster.hangingBottom = bottoms.size ? Math.min(...[...bottoms.values()].map(b => b.bottom - b.length)) : 0;
    const previous = new Map(cluster.ropes.map(rope => [rope.x, rope]));
    const density = cluster.label.scale.y / .75;
    cluster.ropes = [...bottoms].map(([x, { bottom, length }]) => {
      const rope = previous.get(x) || { cluster, x, angle: 0, velocity: 0 };
      rope.top = cluster.hangingTop; rope.bottom = bottom - length;
      // Longer, tightly spaced columns stop sooner to avoid crossing neighbours.
      const travel = (bottoms.size > 1 ? 1.2 : 1.6) * density;
      rope.limit = Math.min(Math.PI / 12, Math.asin(Math.min(1, travel / (rope.top - rope.bottom))));
      return rope;
    });
    const ropesByX = new Map(cluster.ropes.map(rope => [rope.x, rope]));
    for (const card of cluster.cards) card.rope = ropesByX.get(card.hangingRest.x);
    for (const [x, { bottom, length }] of bottoms) {
      for (let segment = 0; segment < 12; segment++) points.push(x, cluster.hangingTop + (bottom - cluster.hangingTop) * segment / 12, -.06, x, cluster.hangingTop + (bottom - cluster.hangingTop) * (segment + 1) / 12, -.06);
      tails.push(x, bottom, -.06, x, bottom - length, -.06);
    }
    cluster.strings.geometry.dispose(); cluster.strings.geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    cluster.stringRest = cluster.strings.geometry.attributes.position.array.slice();
    cluster.tails.geometry.dispose(); cluster.tails.geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(tails, 3));
    cluster.tailRest = cluster.tails.geometry.attributes.position.array.slice();
  }

  beginRopeDrag(rope, x, y) {
    this.cancelYearFocus();
    this.endRopeDrag();
    if (this.yearTransition) this.setYear(this.yearTransition.year);
    if (this.flight) { this.flight = null; this.controls.enabled = true; }
    const cluster = rope.cluster;
    this.scene.updateMatrixWorld(true);
    const center = cluster.group.getWorldPosition(new THREE.Vector3());
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(new THREE.Vector3()), center);
    this.ropeDrag = { rope, cluster, plane, start: 0, angle: rope.angle, controlsEnabled: this.controls.enabled, updateControls: this.controls.update };
    this.ropeDrag.start = this._ropePointerX(x, y);
    this.controls.enabled = false; this.controls.autoRotate = false;
    // OrbitControls still integrates damping when disabled; freeze its update too.
    this.controls.update = () => false;
    rope.velocity = 0; this.setHovered(null);
  }

  _ropePointerX(x, y) {
    this._tmp2.set(((x - this.rect.left) / this.rect.width) * 2 - 1, -((y - this.rect.top) / this.rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this._tmp2, this.camera);
    const point = this.raycaster.ray.intersectPlane(this.ropeDrag.plane, new THREE.Vector3());
    return point ? this.ropeDrag.cluster.group.worldToLocal(point).x : this.ropeDrag.start;
  }

  moveRopeDrag(x, y) {
    if (!this.ropeDrag) return;
    const d = this.ropeDrag, limit = this.reducedMotion ? Math.min(d.rope.limit, Math.PI / 36) : d.rope.limit;
    const length = d.rope.top - d.rope.bottom;
    const displacement = length * Math.sin(d.angle) + this._ropePointerX(x, y) - d.start;
    d.rope.angle = THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(displacement / length, -1, 1)), -limit, limit);
    this.redraw();
  }

  endRopeDrag() {
    if (!this.ropeDrag) return;
    this.controls.enabled = this.ropeDrag.controlsEnabled;
    this.controls.update = this.ropeDrag.updateControls;
    this.ropeDrag = null; this.redraw();
  }

  setRingVisible(index, visible) {
    this.cancelYearFocus();
    if (visible) this.hiddenRings.delete(index); else this.hiddenRings.add(index);
    if (this.clusterMode) this._applyClusterVisibility();
    this._updateCards(1); this.redraw();
  }

  cancelYearFocus(applyYear = true) {
    if (!this.yearTransition) return;
    const year = this.yearTransition.year;
    this.yearTransition = null; this.flight = null; this.controls.enabled = true;
    if (applyYear && this.year !== year) this.setYear(year);
  }

  flyTo(view, duration = 1.5) { this.cancelYearFocus(); super.flyTo(view, duration); }

  _yearCityView(cards) {
    const bounds = new THREE.Box3();
    for (const card of cards) bounds.expandByObject(card.plate);
    const target = bounds.getCenter(new THREE.Vector3()); target.y = Math.min(target.y, 17);
    const dir = new THREE.Vector3(target.x, .4, target.z).normalize(), points = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) points.push(new THREE.Vector3(x, y, z));
    const distance = Math.max(12, this._fit(points, target, dir, { x0: Math.max(-.6, 660 / this.width - 1), x1: .8, y0: -.68, y1: .72 }));
    return { pos: target.clone().addScaledVector(dir, distance), target };
  }

  flyToYear(year) {
    this.setYear(null);
    this.scene.updateMatrixWorld(true);
    const cities = this.cityClusters.filter(c => !this.clusterMode || !this.hiddenRings.has(c.ringIndex)).map(c => {
      const cards = c.cards.filter(card => card.photo.year === year);
      return { cards };
    }).filter(c => c.cards.length);
    const view = cities.length ? this._yearCityView(cities[0].cards) : this.wholeView(.35);
    this.flyTo(view, 1);
    this.yearTransition = { year, flight: this.flight };
  }

  _updateFlight(now) {
    const transition = this.yearTransition;
    super._updateFlight(now);
    if (transition && transition.flight === this.yearTransition?.flight && !this.flight) this.setYear(transition.year);
  }

  setRotation(active, direction, speed) {
    this.cancelYearFocus();
    this.rotationActive = active; this.rotationDirection = direction; this.rotationSpeed = speed;
    this.controls.autoRotate = active; this.controls.autoRotateSpeed = .35 * direction * speed;
    this.redraw();
  }

  _updateHanging(dt) {
    const step = Math.min(dt, .1);
    this.controls.autoRotate = this.rotationActive && !this.flight && !this.ropeDrag;
    this.hangingTime += step;
    const wanted = this.rotationActive && !this.flight && !this.ropeDrag && !this.reducedMotion ? .16 * this.rotationSpeed : 0;
    const previous = this.hangingAmplitude;
    this.hangingAmplitude += (wanted - this.hangingAmplitude) * (1 - Math.exp(-step * 3));
    if (this.hangingAmplitude < .00001) this.hangingAmplitude = 0;
    if (!this.clusterMode) return;
    this.cityClusters.forEach((cluster, index) => {
      if (!cluster.group.visible) return;
      if (previous === 0 && this.hangingAmplitude === 0 && !cluster.ropes.some(rope => rope.angle || rope.velocity)) return;
      for (const rope of cluster.ropes) if (this.ropeDrag?.rope !== rope && (rope.angle || rope.velocity)) {
        rope.velocity += (-22 * rope.angle - (this.reducedMotion ? 10 : 5) * rope.velocity) * step;
        rope.angle += rope.velocity * step;
        if (Math.abs(rope.angle) + Math.abs(rope.velocity) < .000001) rope.angle = rope.velocity = 0;
      }
      const offset = y => {
        const depth = Math.max(0, (cluster.hangingTop - y) / (cluster.hangingTop - cluster.hangingBottom));
        return this.hangingAmplitude * depth * Math.sin(this.hangingTime * 1.3 + index * 1.7 + depth * 1.4) * this.rotationDirection;
      };
      const transform = (x, y, z, rope) => {
        const angle = rope?.angle || 0, length = cluster.hangingTop - y;
        return this._clusterPoint.set(x + length * Math.sin(angle) + offset(y), y + length * (1 - Math.cos(angle)), z);
      };
      cluster.label.position.x = offset(cluster.label.position.y);
      const plaqueLamp = this.plaqueLanterns.find(lamp => lamp.city === cluster.city);
      if (plaqueLamp) plaqueLamp.group.position.x = offset(plaqueLamp.group.position.y);
      for (const card of cluster.cards) if (card.group.visible) {
        const p = card.hangingRest; card.group.position.copy(transform(p.x, p.y, p.z, card.rope));
        card.group.rotation.z = (card.rope?.angle || 0) + offset(p.y) * .04;
      }
      for (const lamp of this.hangingLanterns) if (lamp.city === cluster.city && lamp.group.visible) {
        const p = lamp.hangingRest; lamp.group.position.copy(transform(p.x, p.y, p.z, lamp.card?.rope));
        lamp.group.rotation.z = (lamp.card?.rope?.angle || 0) + offset(p.y) * .04;
      }
      const position = cluster.strings.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        const p = transform(cluster.stringRest[i * 3], cluster.stringRest[i * 3 + 1], cluster.stringRest[i * 3 + 2], cluster.ropes[Math.floor(i / 24)]);
        position.setXYZ(i, p.x, p.y, p.z);
      }
      position.needsUpdate = true;
      const tailPosition = cluster.tails.geometry.attributes.position;
      for (let i = 0; i < tailPosition.count; i++) {
        const p = transform(cluster.tailRest[i * 3], cluster.tailRest[i * 3 + 1], cluster.tailRest[i * 3 + 2], cluster.ropes[Math.floor(i / 2)]);
        tailPosition.setXYZ(i, p.x, p.y, p.z);
      }
      tailPosition.needsUpdate = true;
      cluster.strings.geometry.computeBoundingSphere(); cluster.tails.geometry.computeBoundingSphere();
    });
  }

  _updateCards(dt) {
    this._updateHanging(dt);
    const k = this.reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
    for (const card of this.cards) {
      const p = card.photo;
      card.dim = (this.year !== null && p.year !== this.year) || (this.focusStory && p.story !== this.focusStory) ? 1 : 0;
      if (p === this.selected) card.dim = 0;
      const weak = this.clusterMode && this.year === null && !this.focusStory && this.hoveredCity && p.story !== this.hoveredCity;
      card.mat.color.setScalar(card.loaded ? (card.dim ? .26 : weak ? .65 : 1) : .45);
      const position = this.clusterMode ? card.group.getWorldPosition(this._clusterPoint) : p.rest;
      const want = Math.atan2(this.camera.position.x - position.x, this.camera.position.z - position.z) - (this.clusterMode ? card.group.parent.rotation.y : 0);
      card.yaw += Math.atan2(Math.sin(want - card.yaw), Math.cos(want - card.yaw)) * k;
      card.group.rotation.y = card.yaw;
      card.group.scale.setScalar((this.clusterMode ? card.layoutScale || 1 : 1) * (p === this.hovered || p === this.selected ? 1.04 : 1));
    }
    if (this.clusterMode) this._updateCityOcclusion();
    const selected = city => this.focusStory ? this.focusStory === city && (this.year === null || city.photos.some(p => p.year === this.year)) : this.year === null || city.photos.some(p => p.year === this.year);
    for (const lamp of this.plaqueLanterns) {
      const active = selected(lamp.city);
      lamp.tag.material.color.setScalar(active ? 1 : .3);
      this.cityClusters.find(c => c.city === lamp.city).label.material.color.setScalar(active ? 1 : .3);
      lamp.glow.material.opacity = active ? .48 : .12;
      lamp.group.children.filter(c => c.isMesh && c.material.emissive).forEach(c => { c.material.emissiveIntensity = active ? .5 : .08; });
    }
  }

  _updateCityOcclusion() {
    this.scene.updateMatrixWorld(true); this.camera.updateMatrixWorld();
    for (const cluster of this.cityClusters) {
      for (const card of cluster.cards) card.group.visible = true;
      cluster.label.visible = true;
      cluster.group.visible = !this.hiddenRings.has(cluster.ringIndex) && cluster.cards.some(card => card.group.visible);
    }
    if (!this.focusStory && this.year !== null) {
      // Snapshot photo bounds before hiding anything; only nearer, outer-ring photos yield.
      const photos = [];
      for (const cluster of this.cityClusters) if (cluster.group.visible) for (const card of cluster.cards) {
        const world = new THREE.Box3().setFromObject(card.plate), screen = new THREE.Box2();
        for (const x of [world.min.x, world.max.x]) for (const y of [world.min.y, world.max.y]) for (const z of [world.min.z, world.max.z]) {
          const point = new THREE.Vector3(x, y, z).project(this.camera);
          screen.expandByPoint(new THREE.Vector2(point.x, point.y));
        }
        const depth = -card.group.getWorldPosition(new THREE.Vector3()).applyMatrix4(this.camera.matrixWorldInverse).z;
        if (depth > 0) photos.push({ card, ring: cluster.ringIndex, screen, depth });
      }
      const targets = photos.filter(p => p.ring > 0 && p.card.photo.year === this.year);
      for (const photo of photos) if (targets.some(target => photo.ring < target.ring && photo.depth < target.depth - .05 && photo.screen.intersectsBox(target.screen))) photo.card.group.visible = false;
      return;
    }
    const selected = this.cityClusters.find(c => c.city === this.focusStory);
    if (!selected?.group.visible || selected.ringIndex === 0) return;
    // Compare the displayed photo/sign blocks, never the long empty hanging cords.
    const project = cluster => {
      const world = new THREE.Box3(), screen = new THREE.Box2();
      for (const card of cluster.cards) if (card.group.visible) world.expandByObject(card.plate);
      for (const x of [world.min.x, world.max.x]) for (const y of [world.min.y, world.max.y]) for (const z of [world.min.z, world.max.z]) {
        const point = new THREE.Vector3(x, y, z).project(this.camera);
        screen.expandByPoint(new THREE.Vector2(point.x, point.y));
      }
      const point = cluster.label.getWorldPosition(new THREE.Vector3());
      const depth = -point.clone().applyMatrix4(this.camera.matrixWorldInverse).z;
      const v = point.project(this.camera), h = cluster.label.scale.y / (2 * depth * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
      const w = h * cluster.label.scale.x / cluster.label.scale.y / this.camera.aspect;
      screen.expandByPoint(new THREE.Vector2(v.x - w, v.y - h)); screen.expandByPoint(new THREE.Vector2(v.x + w, v.y + h));
      return { screen, depth };
    };
    const target = project(selected);
    for (const cluster of this.cityClusters) {
      if (!cluster.group.visible || cluster.ringIndex >= selected.ringIndex) continue;
      const front = project(cluster);
      if (front.depth > 0 && front.depth < target.depth - .05 && front.screen.intersectsBox(target.screen)) cluster.group.visible = false;
    }
  }

  wholeView(azimuth = .35) {
    if (this.clusterMode) {
      const bounds = new THREE.Box3();
      for (const cluster of this.cityClusters) if (cluster.group.visible) {
        bounds.expandByObject(cluster.label);
        for (const card of cluster.cards) if (card.group.visible) bounds.expandByObject(card.group);
      }
      if (!bounds.isEmpty()) {
        const target = bounds.getCenter(new THREE.Vector3()), dir = new THREE.Vector3(Math.sin(azimuth), .06, Math.cos(azimuth));
        target.y = Math.min(target.y, 17);
        const points = [];
        for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) points.push(new THREE.Vector3(x, y, z));
        const distance = Math.max(16, this._fit(points, target, dir, { x0: Math.max(-.6, 660 / this.width - 1), x1: .85, y0: -.72, y1: .72 }));
        return { pos: target.clone().addScaledVector(dir, distance), target };
      }
    }
    const target = new THREE.Vector3(0, 17, 0);
    const dir = new THREE.Vector3(Math.sin(azimuth), .13, Math.cos(azimuth)).normalize();
    const phone = this.width / this.height < .8;
    const distance = this._fit(this._wholePoints(), target, dir, phone ? { x0: -1.55, x1: 1.55, y0: -.52, y1: .74 } : { x0: -.91, x1: .91, y0: -.82, y1: .87 });
    return { pos: target.clone().addScaledVector(dir, distance), target };
  }

  _clampCamera() {
    if (this.ropeDrag) return;
    const target = this.controls.target, camera = this.camera.position;
    target.x = THREE.MathUtils.clamp(target.x, -16, 16); target.z = THREE.MathUtils.clamp(target.z, -16, 16); target.y = THREE.MathUtils.clamp(target.y, .4, 17);
    camera.y = THREE.MathUtils.clamp(camera.y, .3, 35);
    const radius = Math.hypot(camera.x, camera.z);
    const maxRadius = this.controls.maxDistance;
    if (radius > maxRadius) { camera.x *= maxRadius / radius; camera.z *= maxRadius / radius; }
  }

  _wholePoints() {
    const points = [];
    const bounds = new THREE.Box3().setFromObject(this.tree);
    const gardenRadius = this.garden.meadow.surface.geometry.parameters.radius;
    const radius = Math.max(gardenRadius, Math.abs(bounds.min.x), Math.abs(bounds.max.x), Math.abs(bounds.min.z), Math.abs(bounds.max.z));
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12;
      points.push(new THREE.Vector3(Math.cos(a) * radius, bounds.max.y + .4, Math.sin(a) * radius));
      points.push(new THREE.Vector3(Math.cos(a) * gardenRadius, 0, Math.sin(a) * gardenRadius));
    }
    return points;
  }
}

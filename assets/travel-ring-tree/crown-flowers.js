import * as THREE from 'three';

// Stylised botanical accents. One shared curved mesh per flower type.
function flowerGeometry(kind) {
  const positions = [], colors = [], indices = [];
  const [baseHex, tipHex] = {
    sakura: ['#dc829e', '#ffe3ed'], magnolia: ['#e6c4ae', '#fff9e8'], camellia: ['#cd5b80', '#f4b4c7'],
    violet: ['#977cc9', '#e9defb'], daisy: ['#e8d9c2', '#fffdf1'], yellow: ['#d6b755', '#fff2ab']
  }[kind];
  const base = new THREE.Color(baseHex), tip = new THREE.Color(tipHex);
  const tone = new THREE.Color();
  const rings = {
    sakura: [[5, .83, .37, .24]], magnolia: [[6, .82, .34, .82], [3, .53, .25, .92]],
    camellia: [[9, .9, .36, .28], [7, .65, .32, .42], [5, .39, .22, .5]],
    violet: [[5, .65, .3, .32]], daisy: [[12, .7, .13, .25]], yellow: [[5, .65, .32, .36]]
  }[kind];
  rings.forEach(([petals, length, width, cup], layer) => {
    for (let petal = 0; petal < petals; petal++) {
      const angle = petal * Math.PI * 2 / petals + layer * .47, offset = positions.length / 3;
      for (let row = 0; row <= 6; row++) {
        const t = row / 6;
        for (let col = 0; col <= 4; col++) {
          const u = col / 2 - 1;
          const w = width * Math.sin(Math.PI * t * .86) ** .65;
          const notch = kind === 'sakura' ? .13 * Math.exp(-u * u * 22) * t ** 10 : 0;
          const radial = .07 + length * (t - .14 * u * u * t ** 8) - notch;
          const side = u * w;
          const y = layer * .09 + cup * t * t + .13 * u * u * Math.sin(Math.PI * t) + (kind === 'camellia' ? .035 * Math.cos(u * 8 + petal) * t : 0);
          positions.push(Math.cos(angle) * radial - Math.sin(angle) * side, y, Math.sin(angle) * radial + Math.cos(angle) * side);
          tone.copy(base).lerp(tip, Math.min(1, .25 + .75 * t + .04 * Math.cos(u * 12)));
          colors.push(tone.r, tone.g, tone.b);
          if (row < 6 && col < 4) {
            const a = offset + row * 5 + col;
            indices.push(a, a + 1, a + 5, a + 1, a + 6, a + 5);
          }
        }
      }
    }
  });
  // A small raised centre and pollen heads, baked into the same draw batch.
  const pollen = new THREE.Color('#edc469');
  const appendSphere = (x, y, z, radius) => {
    const sphere = new THREE.SphereGeometry(radius, 4, 3), p = sphere.attributes.position, offset = positions.length / 3;
    for (let i = 0; i < p.count; i++) { positions.push(p.getX(i) + x, p.getY(i) + y, p.getZ(i) + z); colors.push(pollen.r, pollen.g, pollen.b); }
    for (const index of sphere.index.array) indices.push(index + offset);
    sphere.dispose();
  };
  appendSphere(0, .12, 0, kind === 'daisy' ? .17 : .105);
  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI / 5, r = kind === 'magnolia' ? .09 : .17;
    appendSphere(Math.cos(a) * r, .2 + i % 3 * .027, Math.sin(a) * r, .032);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices); geometry.computeVertexNormals(); geometry.computeBoundingBox();
  return geometry;
}

export function addCrownBlossoms(tree, canopyPoint, rand) {
  const mobile = innerWidth <= 760;
  const clusters = Array.from({ length: mobile ? 5 : 12 }, (_, i) => {
    const a = i * 2.399963 + (rand() - .5) * .2;
    return { a, r: 16 * Math.sqrt((i + .5) / (mobile ? 5 : 12)) };
  });
  const dummy = new THREE.Object3D(), tint = new THREE.Color();
  // Index actual leaf centres once; flower roots sit on nearby upper leaves.
  const leafCells = new Map(), leafMatrices = tree.getObjectByName('tree-leaf-crown').instanceMatrix.array;
  for (let i = 0; i < leafMatrices.length; i += 16) {
    const leaf = new THREE.Vector3(leafMatrices[i + 12], leafMatrices[i + 13], leafMatrices[i + 14]);
    const key = Math.floor(leaf.x) + ',' + Math.floor(leaf.z);
    if (!leafCells.has(key)) leafCells.set(key, []);
    leafCells.get(key).push(leaf);
  }
  const attachToLeaf = position => {
    const x = Math.floor(position.x), z = Math.floor(position.z);
    let top = null, nearest = null, distance = Infinity;
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      for (const leaf of leafCells.get((x + dx) + ',' + (z + dz)) || []) {
        const d = (leaf.x - position.x) ** 2 + (leaf.z - position.z) ** 2;
        if (d < distance) { distance = d; nearest = leaf; }
        if (d < .65 ** 2 && (!top || leaf.y > top.y)) top = leaf;
      }
    }
    position.copy(top || nearest); position.y += .025;
  };
  const species = [['sakura', mobile ? 46 : 116, 1.05], ['magnolia', mobile ? 11 : 27, 1.35], ['camellia', mobile ? 20 : 51, 1.18], ['violet', mobile ? 37 : 91, .65], ['daisy', mobile ? 41 : 102, .8], ['yellow', mobile ? 25 : 63, .75]];
  for (const [kind, count, size] of species) {
    const mesh = new THREE.InstancedMesh(flowerGeometry(kind), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, emissive: '#fff1e4', emissiveIntensity: .12 }), count);
    mesh.name = 'tree-crown-' + kind;
    for (let i = 0; i < count; i++) {
      const a = i * 2.399963 + size * 2 + (rand() - .5) * .055;
      // Leave the summit airy; larger flowers sit on the surrounding slopes.
      const t = (i + .5) / count;
      const large = kind === 'magnolia' || kind === 'camellia';
      const radiusSquared = t >= .85 ? 144 + 112 * (t - .85) / .15
        : large ? 42.25 + 101.75 * t / .85
        : t < .05 ? 36 * t / .05 : 36 + 108 * (t - .05) / .8;
      const r = Math.min(16.3, Math.sqrt(radiusSquared) + (rand() - .5) * .3);
      dummy.position.copy(canopyPoint(a, r));
      attachToLeaf(dummy.position);
      dummy.rotation.set(0, -a, r > 12 ? -.65 - rand() * .3 : (rand() - .5) * .45);
      dummy.rotateY(rand() * Math.PI * 2);
      dummy.scale.setScalar(size * (.85 + rand() * .35)); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, tint.setRGB(1, .91 + rand() * .09, .94 + rand() * .06));
    }
    mesh.computeBoundingBox(); mesh.computeBoundingSphere(); tree.add(mesh);
  }
  const buds = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshLambertMaterial({ color: '#efc8cc' }), mobile ? 5 : 12);
  buds.name = 'tree-crown-buds';
  for (let i = 0; i < buds.count; i++) {
    const cluster = clusters[i % clusters.length];
    dummy.position.copy(canopyPoint(cluster.a, cluster.r)); attachToLeaf(dummy.position);
    dummy.rotation.set(0, cluster.a, .35); dummy.scale.set(.14, .27, .14); dummy.updateMatrix(); buds.setMatrixAt(i, dummy.matrix);
  }
  buds.computeBoundingBox(); buds.computeBoundingSphere(); tree.add(buds);
}

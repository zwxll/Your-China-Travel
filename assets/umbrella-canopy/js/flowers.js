import * as THREE from 'three';

// Extend the upstream three-tile mask without modifying its source or wind shader.
export function enrichFlowers(layer) {
  const mesh = layer.flowers, material = mesh.material;
  const previous = material.uniforms.uMask.value;
  const canvas = document.createElement('canvas');
  canvas.width = 960; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(previous.image, 0, 0);
  const stem = (x, y, endX, endY, width = 5) => {
    ctx.strokeStyle = '#00ff00'; ctx.lineWidth = width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 6, (y + endY) / 2, endX, endY); ctx.stroke();
  };
  const leaf = (x, y, angle) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.fillStyle = '#00ff00';
    ctx.beginPath(); ctx.ellipse(18, 0, 23, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };
  const petals = (x, y, count, radius, width) => {
    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < count; i++) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(i * Math.PI * 2 / count);
      ctx.beginPath(); ctx.ellipse(0, -radius * .55, width, radius * .62, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = '#0000ff'; ctx.beginPath(); ctx.arc(x, y, radius * .2, 0, Math.PI * 2); ctx.fill();
  };
  // Broad eight-petal cosmos, with fine branching leaves.
  stem(560, 249, 558, 85); leaf(558, 186, -.65); leaf(558, 155, 2.6);
  petals(558, 65, 8, 49, 16);
  // Curved stems with three hanging bell-shaped blooms.
  stem(721, 249, 713, 56); leaf(719, 187, -.6); leaf(719, 156, 2.6);
  for (const [x, y] of [[691, 96], [752, 126], [712, 52]]) {
    stem(718, y + 28, x, y);
    ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.moveTo(x - 7, y);
    ctx.bezierCurveTo(x - 9, y + 17, x - 22, y + 20, x - 22, y + 32);
    ctx.quadraticCurveTo(x, y + 45, x + 22, y + 32);
    ctx.bezierCurveTo(x + 22, y + 20, x + 9, y + 17, x + 7, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0000ff'; ctx.beginPath(); ctx.ellipse(x, y + 33, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Low, airy clusters of five-petal forget-me-not-like flowers.
  stem(881, 249, 879, 132); leaf(881, 196, -.55); leaf(881, 168, 2.6);
  for (const [x, y] of [[843, 112], [878, 83], [911, 108], [856, 145], [906, 151]]) {
    stem(881, 174, x, y); petals(x, y, 5, 20, 9);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace; texture.generateMipmaps = false;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  material.uniforms.uMask.value = texture; material.map = texture;
  mesh.customDepthMaterial.map = texture;
  const depthCompile = mesh.customDepthMaterial.onBeforeCompile;
  mesh.customDepthMaterial.onBeforeCompile = function(shader, renderer) {
    depthCompile.call(this, shader, renderer);
    shader.vertexShader = shader.vertexShader.replace('(uv.x + aVariant) / 3.0', '(uv.x + aVariant) / 6.0');
  };
  mesh.customDepthMaterial.customProgramCacheKey = () => 'garden-six-flowers-depth';
  material.vertexShader = material.vertexShader.replace('(uv.x + aVariant) / 3.0', '(uv.x + aVariant) / 6.0');
  material.needsUpdate = true;
  previous.dispose();

  const variants = mesh.geometry.attributes.aVariant;
  const petalColors = mesh.geometry.attributes.aPetalColor;
  const centres = mesh.geometry.attributes.aCentreColor;
  const palette = ['#fff4dc', '#bca5df', '#f0b9cf', '#ed9dbd', '#c4b4e8', '#c1d9ee'].map(hex => new THREE.Color(hex));
  const center = new THREE.Color('#efd07e');
  const matrix = new THREE.Matrix4(), position = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
  for (let i = 0; i < mesh.count; i++) {
    mesh.getMatrixAt(i, matrix); matrix.decompose(position, rotation, scale);
    // Nearby plants share a variety, creating small natural flower clusters.
    const patch = Math.floor(position.x / 1.8) * 7 + Math.floor(position.z / 1.8) * 11;
    const variant = ((patch % 6) + 6) % 6;
    const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const height = [ .52, .85, .62, .68, .75, .36 ][variant] + Math.abs(jitter) * .15;
    scale.set(height * (variant === 3 ? .85 : .65), height, 1);
    mesh.setMatrixAt(i, matrix.compose(position, rotation, scale));
    variants.setX(i, variant);
    const color = palette[variant]; petalColors.setXYZ(i, color.r, color.g, color.b);
    centres.setXYZ(i, center.r, center.g, center.b);
  }
  variants.needsUpdate = petalColors.needsUpdate = centres.needsUpdate = true;
  mesh.instanceMatrix.needsUpdate = true;
}

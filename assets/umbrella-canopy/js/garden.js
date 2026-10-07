import * as THREE from 'three';
import { Grass } from '../vendor/garden/meadow/src/grass/Grass.ts';
import { enrichFlowers } from './flowers.js';

// Compact garden placement; grass and flower rendering remain upstream code.
export function buildFlowerGarden(scene, reducedMotion) {
  const phone = innerWidth <= 760;
  const geometry = new THREE.CircleGeometry(13, 96).rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position, colors = [];
  const color = new THREE.Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), z = positions.getZ(i);
    color.set('#a7b68d');
    color.multiplyScalar(1 - .12 * Math.exp(-(x * x + z * z) / 65));
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true });
  // Fade only the garden's outer edge, without a large background ground plane.
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec2 vGardenXZ;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGardenXZ = transformed.xz;');
    shader.fragmentShader = 'varying vec2 vGardenXZ;\n' + shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= 1.0 - smoothstep(11.6, 13.0, length(vGardenXZ));');
  };
  const surface = new THREE.Mesh(geometry, material);
  surface.name = 'canopy-garden-ground';
  surface.renderOrder = -1;
  const plantedGround = ({ position: p }) => {
    const r = Math.hypot(p.x, p.z);
    return r > 3.4 && r < 12.5 ? 1 - THREE.MathUtils.smoothstep(r, 11.6, 12.5) : 0;
  };
  const meadow = new Grass({
    surface,
    coverage: { sample: plantedGround },
    grass: {
      density: phone ? 4 : 12, shadow: false, brightness: .9,
      blade: { minHeight: .12, maxHeight: .34, minWidth: .025, maxWidth: .06, segments: 2 },
      colors: { bottom: '#607653', top: '#a7b987', backlight: '#e1dcb0' },
      wind: { strength: reducedMotion ? 0 : .12, speed: .5, turbulence: .1 },
      lighting: { intensity: .9, color: '#fff4df', backlightStrength: .25 },
    },
    wildflowers: {
      density: 20, maxCount: phone ? 800 : 2400,
      coverage: { sample: point => plantedGround(point) * (.35 + .65 * (1 + Math.sin(point.position.x * 1.6)) * (1 + Math.cos(point.position.z * 1.45)) / 4) },
    },
  });
  enrichFlowers(meadow.wildflowers);
  meadow.name = 'canopy-flower-meadow';
  scene.add(meadow);

  const sky = new THREE.Mesh(new THREE.SphereGeometry(130, 24, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { topColor: { value: new THREE.Color('#e4e6d7') }, horizonColor: { value: new THREE.Color('#f1e9d6') } },
    vertexShader: 'varying float vHeight; void main(){vHeight=normalize(position).y; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'uniform vec3 topColor; uniform vec3 horizonColor; varying float vHeight; void main(){gl_FragColor=vec4(mix(horizonColor,topColor,smoothstep(0.0,.75,vHeight)),1.0);\n#include <colorspace_fragment>\n}',
  }));
  sky.name = 'warm-garden-sky';
  scene.add(sky);
  return { meadow, update(time) { meadow.update(time); } };
}

import * as THREE from 'three';
import { Grass } from '../umbrella-canopy/vendor/garden/meadow/src/grass/Grass.ts';
import { enrichFlowers } from '../umbrella-canopy/js/flowers.js';

// Same licensed meadow components, with a clear planting hole for the tree platform.
export function buildTreeGarden(scene, reducedMotion) {
  const phone = innerWidth <= 760;
  const surface = new THREE.Mesh(new THREE.CircleGeometry(16.8, 96).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#91a67c', transparent: true }));
  surface.material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying vec2 vGardenXZ;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvGardenXZ=transformed.xz;');
    shader.fragmentShader = 'varying vec2 vGardenXZ;\n' + shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a*=1.0-smoothstep(15.12,16.8,length(vGardenXZ));');
  };
  const planted = ({ position: p }) => { const r = Math.hypot(p.x, p.z); return r > 7.45 && r < 16.2 ? 1 - THREE.MathUtils.smoothstep(r, 15.12, 16.2) : 0; };
  const meadow = new Grass({ surface, coverage: { sample: planted },
    grass: { density: phone ? 4 : 12, shadow: false, brightness: .95,
      blade: { minHeight: .12, maxHeight: .34, minWidth: .025, maxWidth: .06, segments: 2 },
      colors: { bottom: '#536940', top: '#a6b882', backlight: '#fff0b5' },
      wind: { strength: reducedMotion ? 0 : .12, speed: .5, turbulence: .1 }, lighting: { intensity: .9, color: '#fff4df', backlightStrength: .25 } },
    wildflowers: { density: 25, maxCount: phone ? 800 : 4000, coverage: { sample: point => planted(point) * (.5 + .5 * Math.sin(point.position.x * 1.6) ** 2) } }
  });
  enrichFlowers(meadow.wildflowers); scene.add(meadow);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(130, 24, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false,
    uniforms: { topColor: { value: new THREE.Color('#aecada') }, horizonColor: { value: new THREE.Color('#fae6c7') } },
    vertexShader: 'varying float vHeight;void main(){vHeight=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'uniform vec3 topColor;uniform vec3 horizonColor;varying float vHeight;void main(){gl_FragColor=vec4(mix(horizonColor,topColor,smoothstep(-.05,.65,vHeight)),1.0);\n#include <colorspace_fragment>\n}'
  }));
  scene.add(sky);
  return { meadow, update(time) { meadow.update(time); } };
}

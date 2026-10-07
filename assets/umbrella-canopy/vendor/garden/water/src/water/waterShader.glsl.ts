/**
 * Stylized water surface shader.
 *
 * Forward-rendered approximation of a deferred water pipeline: a screen-space
 * reflection pass would normally provide the surface reflection term — here
 * we substitute a procedural sky gradient driven by `skyLowColor`,
 * `skyHighColor` and a Schlick Fresnel weight.
 *
 * Animated normals come from a 4-octave sample of a precomputed value-noise
 * LUT (`noiseLUT`), with each octave carrying its own random rotation +
 * flow direction. Ripples and foam are added on top via lightweight
 * procedural fields.
 */

const MAX_FOAM_SOURCES = 48;
const MAX_RIPPLES = 32;

export const WATER_FOAM_CAPACITY = MAX_FOAM_SOURCES;
export const WATER_RIPPLE_CAPACITY = MAX_RIPPLES;

/**
 * Vertex shader. Reads a single-channel terrain heightmap to keep the water
 * surface aligned with the underlying ground (so it dips into valleys).
 */
export const WATER_VERTEX = /* glsl */ `
  #include <common>
  #include <shadowmap_pars_vertex>

  uniform float maskWorldExtent;
  uniform sampler2D waterMask;
  uniform sampler2D uTerrainHeightmap;
  uniform float uTerrainWorldSize;
  uniform float waterSurfaceOffset;

  varying vec3 vWorldPos;
  varying vec2 vMaskUv;
  varying float vMaskValue;

  float sampleTerrainHeight(vec2 worldXZ) {
    vec2 uv = worldXZ / max(uTerrainWorldSize, 1e-5) + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
    return texture2D(uTerrainHeightmap, uv).r;
  }

  void main() {
    // shadowmap_vertex needs a transformedNormal in scope; the plane faces up.
    vec3 transformedNormal = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));

    // mesh.position.y sets the base water level (e.g. lake surface elevation).
    // The terrain heightmap acts as an *additive* delta so streams and rivers
    // can dip into valleys; for a pond, leave the heightmap flat (default).
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    worldPosition.y += sampleTerrainHeight(worldPosition.xz) + waterSurfaceOffset;

    vMaskUv    = (worldPosition.xz / maskWorldExtent) + 0.5;
    vMaskValue = texture2D(waterMask, vMaskUv).r;

    vWorldPos   = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    #include <shadowmap_vertex>
  }
`;

/**
 * Fragment shader. The four octave parameters at the top of `computeWaterNormal`
 * are the main knobs for retuning the surface look:
 *
 *   scales[]     = { 2, 4, 8, 12 }    // UV scales for each octave
 *   amplitudes[] = { 2, 2, 0.5, 0.2 } // gradient magnitudes
 */
export const WATER_FRAGMENT = /* glsl */ `
  #include <common>
  #include <packing>
  #include <lights_pars_begin>
  #include <shadowmap_pars_fragment>
  #include <shadowmask_pars_fragment>

  uniform float time;
  uniform sampler2D waterMask;
  uniform sampler2D noiseLUT;
  uniform vec3  deepColor;
  uniform vec3  shallowColor;
  uniform vec3  sunDirection;
  uniform vec3  skyLowColor;
  uniform vec3  skyHighColor;
  uniform float maskWorldExtent;
  uniform float rippleSources[${MAX_RIPPLES * 4}];
  uniform int   rippleCount;
  uniform float rippleBoost;
  uniform float flowSpeed;
  uniform float specularPower;
  uniform float specularIntensity;
  uniform float reflectionStrength;
  uniform float shoreGlow;
  uniform float waterOpacity;
  uniform float foamSources[${MAX_FOAM_SOURCES * 3}];
  uniform int   foamCount;

  varying vec3  vWorldPos;
  varying vec2  vMaskUv;
  varying float vMaskValue;

  // Per-octave deterministic flow direction.
  vec2 octaveFlowDir(int octave) {
    float seed  = float(octave) * 5.17 + 17.0;
    float angle = fract(sin(seed * 127.1 + 311.7) * 43758.5453) * 6.283185;
    return vec2(cos(angle), sin(angle));
  }

  float octaveRotAngle(int octave) {
    return float(octave) * 10.1664 + 7.0;
  }

  // 4-octave gradient sum from the noise LUT. Each octave samples the LUT
  // at a different scale + rotation + flow direction; the gradients are
  // accumulated and used as the perturbed surface normal.
  vec3 computeWaterNormal(vec2 worldXZ) {
    float scales[4];
    scales[0] = 2.0;  scales[1] = 4.0;  scales[2] = 8.0;  scales[3] = 12.0;

    float amps[4];
    amps[0] = 2.0;    amps[1] = 2.0;    amps[2] = 0.5;    amps[3] = 0.2;

    vec2 accumGrad = vec2(0.0);
    for (int i = 0; i < 4; i++) {
      float scale = scales[i];
      float amp   = amps[i];
      float angle = octaveRotAngle(i);
      float ca = cos(angle);
      float sa = sin(angle);
      mat2 rot = mat2(ca, sa, -sa, ca);
      vec2 flow = octaveFlowDir(i) * time * flowSpeed;
      vec2 uv   = rot * ((worldXZ * scale) + flow) * 0.012;

      vec3 s = texture2D(noiseLUT, uv).xyz;
      s      = s * vec3(1.0, 2.0, 2.0) + vec3(-0.5, -1.0, -1.0);

      float derivScale = amp * scale * 0.012;
      vec2  grad        = rot * (s.yz * derivScale);
      accumGrad        += grad;
    }

    return normalize(vec3(accumGrad.x * rippleBoost, 1.0, accumGrad.y * rippleBoost));
  }

  vec3 addRipples(vec3 normal, vec2 worldXZ) {
    vec3 rippleGrad = vec3(0.0);
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      if (i >= rippleCount) break;
      int base = i * 4;
      vec2 src = vec2(rippleSources[base], rippleSources[base + 2]);
      float startTime = rippleSources[base + 1];
      float strength  = rippleSources[base + 3];
      if (strength < 0.001) continue;

      float age = time - startTime;
      if (age < 0.0 || age > 1.8) continue;

      float dist      = distance(worldXZ, src);
      float waveRadius = age * 2.35;
      float waveFront = dist - waveRadius;
      float envelope  = exp(-abs(waveFront) * 9.0) * exp(-age * 1.35) * strength;
      float phase     = waveFront * 18.0 - age * 12.0;
      float ripple    = sin(phase) * envelope;
      vec2 dir        = normalize(worldXZ - src + vec2(0.001));
      rippleGrad.xz  += dir * ripple * 0.5;
    }
    return normalize(normal + rippleGrad);
  }

  // Schlick Fresnel with F0 = 0.04 (water IOR ~1.33).
  float fresnelSchlick(float NdotV) {
    float f  = 1.0 - NdotV;
    float f2 = f * f;
    return 0.04 + 0.96 * f2 * f2 * f;
  }

  // Procedural sky gradient used in place of a real reflection probe.
  //   mix(sky_low, sky_high, pow(clamp(1 - pow(1 - clamp(reflDir.y + 0.2, 0, 1), 14), 0, 1), 0.65))
  // The horizon stays in skyLowColor for a long time, then ramps quickly
  // toward skyHighColor for upward-facing reflections.
  vec3 computeSkyReflection(vec3 reflDir) {
    float ry = clamp(reflDir.y + 0.2, 0.0, 1.0);
    float t  = pow(clamp(1.0 - pow(1.0 - ry, 14.0), 0.0, 1.0), 0.65);
    return mix(skyLowColor, skyHighColor, t);
  }

  float hash2d(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash2d(i);
    float b = hash2d(i + vec2(1.0, 0.0));
    float c = hash2d(i + vec2(0.0, 1.0));
    float d = hash2d(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Procedural intersection foam — bright noise rings around foam sources
  // (typically placed where rocks or boats meet the water surface).
  float computeIntersectionFoam(vec2 worldXZ) {
    float foam = 0.0;
    for (int i = 0; i < ${MAX_FOAM_SOURCES}; i++) {
      if (i >= foamCount) break;
      int base = i * 3;
      vec2 pos = vec2(foamSources[base], foamSources[base + 1]);
      float radius = foamSources[base + 2];
      float dist = distance(worldXZ, pos);
      if (dist > radius) continue;

      float t = dist / radius;
      float foamMask = (1.0 - smoothstep(0.15, 1.0, t));
      float n1 = valueNoise(worldXZ * 11.0 + vec2(time * 0.7, time * -0.5));
      float n2 = valueNoise(worldXZ * 5.5  - vec2(time * 0.4, time * 0.3));
      float noiseVal = n1 * 0.65 + n2 * 0.35;
      float threshold = 0.22 + t * 0.35;
      float foamPattern = smoothstep(threshold, threshold + 0.18, noiseVal);
      foam = max(foam, foamMask * foamPattern);
    }
    return foam;
  }

  void main() {
    float edgeNoise = valueNoise(vWorldPos.xz * 3.2) * 0.1;
    float maskWithNoise = vMaskValue + edgeNoise - 0.04;
    if (maskWithNoise < 0.1) discard;

    float alpha       = smoothstep(0.1, 0.3, maskWithNoise);
    float depthFactor = smoothstep(0.1, 0.85, vMaskValue);

    vec3 normal = computeWaterNormal(vWorldPos.xz);
    normal      = addRipples(normal, vWorldPos.xz);

    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 lightDir = normalize(sunDirection);

    float NdotV   = max(dot(normal, viewDir), 0.0);
    float fresnel = fresnelSchlick(NdotV);

    vec3 reflDir = reflect(-viewDir, normal);
    if (reflDir.y < 0.0) reflDir.y = -reflDir.y;
    vec3 skyReflection = computeSkyReflection(reflDir);

    vec3 bodyColor = mix(shallowColor, deepColor, depthFactor);

    // Without true SSR we boost the reflection term to compensate for the
    // missing scene reflections.
    float reflAmount = max(fresnel, 0.15 + reflectionStrength * (1.0 - NdotV));
    vec3 color = mix(bodyColor, skyReflection, reflAmount);

    float NdotL = max(dot(normal, lightDir), 0.0);
    color *= 0.85 + 0.15 * NdotL;

    vec3 halfVec = normalize(viewDir + lightDir);
    float NdotH = max(dot(normal, halfVec), 0.0);
    float spec = pow(NdotH, specularPower) * NdotL;
    color += vec3(1.0, 0.97, 0.90) * spec * specularIntensity;

    float shoreGlowAmount = (1.0 - depthFactor) * shoreGlow;
    color += skyReflection * shoreGlowAmount;

    #if NUM_DIR_LIGHT_SHADOWS > 0
      DirectionalLightShadow wdls = directionalLightShadows[0];
      float waterShadow = getShadow(directionalShadowMap[0], wdls.shadowMapSize, wdls.shadowIntensity,
                                    wdls.shadowBias, wdls.shadowRadius, vDirectionalShadowCoord[0]);
      color *= mix(0.58, 1.0, waterShadow);
    #endif

    if (foamCount > 0) {
      float foam = computeIntersectionFoam(vWorldPos.xz);
      vec3 foamTint = mix(vec3(0.85, 0.92, 0.95), vec3(1.0, 0.99, 0.96), foam);
      color = mix(color, foamTint, foam * 0.7);
      alpha = mix(alpha, 1.0, foam * 0.5);
    }

    gl_FragColor = vec4(color, alpha * waterOpacity);
  }
`;

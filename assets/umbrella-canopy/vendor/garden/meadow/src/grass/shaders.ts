/** GLSL sources deliberately stay import-free so Vite needs no shader loader. */
export const grassWindVertexUniforms = /* glsl */ `
  uniform float uTime;
  uniform float uWindStrength;
  uniform float uWindSpeed;
  uniform float uWindFrequency;
  uniform float uWindTurbulence;
  uniform float uWindLean;
  uniform vec2 uWindDirection;
`

// This chunk is also injected into the custom depth material. Keeping both
// passes on the same deformation prevents a blade from casting from its rest pose.
export const grassWindVertexTransform = /* glsl */ `
  mat3 inverseTransposeMat3(mat3 matrix) {
    vec3 row0 = cross(matrix[1], matrix[2]);
    vec3 row1 = cross(matrix[2], matrix[0]);
    vec3 row2 = cross(matrix[0], matrix[1]);
    float determinant = dot(matrix[0], row0);
    return mat3(row0, row1, row2) / determinant;
  }

  vec3 deformGrassBlade(vec3 transformed) {
    mat4 instanceWorldMatrix = modelMatrix * instanceMatrix;
    vec3 baseWorldPosition = (instanceWorldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float bladeHeight = uv.y;
    float primaryWave = sin(dot(baseWorldPosition.xz, uWindDirection) * uWindFrequency + uTime * uWindSpeed);
    vec2 perpendicular = vec2(-uWindDirection.y, uWindDirection.x);
    float secondaryWave = sin(dot(baseWorldPosition.xz, perpendicular) * uWindFrequency * 1.7 + uTime * uWindSpeed * 0.73) * uWindTurbulence;
    float tipMask = bladeHeight * bladeHeight;
    vec3 worldWind = vec3(uWindDirection.x, 0.0, uWindDirection.y) * ((primaryWave + secondaryWave) * uWindStrength + uWindLean);

    // The instance matrix contains a random Y rotation and non-uniform scale.
    // Projecting onto its world axes converts the coherent world wind to blade-local space.
    vec3 axisX = vec3(instanceWorldMatrix[0]);
    vec3 axisY = vec3(instanceWorldMatrix[1]);
    vec3 axisZ = vec3(instanceWorldMatrix[2]);
    vec3 localWind = vec3(
      dot(worldWind, axisX) / max(dot(axisX, axisX), 0.00001),
      dot(worldWind, axisY) / max(dot(axisY, axisY), 0.00001),
      dot(worldWind, axisZ) / max(dot(axisZ, axisZ), 0.00001)
    );
    return transformed + localWind * tipMask;
  }
`

export const grassVertexShader = /* glsl */ `
  #include <common>
  #include <shadowmap_pars_vertex>
  ${grassWindVertexUniforms}

  varying float vBladeHeight;
  varying vec3 vBladeNormal;
  varying vec3 vWorldPosition;

  ${grassWindVertexTransform}

  void main() {
    vBladeHeight = uv.y;
    vec3 transformed = deformGrassBlade(position);
    mat4 instanceWorldMatrix = modelMatrix * instanceMatrix;
    vBladeNormal = normalize(inverseTransposeMat3(mat3(instanceWorldMatrix)) * normal);
    vWorldPosition = (instanceWorldMatrix * vec4(transformed, 1.0)).xyz;
    vec4 worldPosition = vec4(vWorldPosition, 1.0);
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
        vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * worldPosition;
      }
      #pragma unroll_loop_end
    #endif
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

export const grassFragmentShader = /* glsl */ `
  #include <common>
  #include <shadowmap_pars_fragment>
  uniform vec3 uGrassBottom;
  uniform vec3 uGrassTop;
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform float uLightIntensity;
  uniform vec3 uBacklightColor;
  uniform float uBacklightStrength;
  uniform float uBacklightPower;
  uniform float uBacklightTip;
  uniform float uBrightness;

  varying float vBladeHeight;
  varying vec3 vBladeNormal;
  varying vec3 vWorldPosition;

  void main() {
    float gradient = smoothstep(0.08, 1.0, vBladeHeight);
    vec3 grassColor = mix(uGrassBottom, uGrassTop, gradient);

    // Flattening diffuse lighting to the up vector avoids random per-ribbon shimmer.
    float diffuse = 0.35 + 0.65 * max(dot(vec3(0.0, 1.0, 0.0), normalize(uLightDirection)), 0.0);
    // Back-scattering is strongest when the camera looks through a thin blade
    // toward the sun. The terms mirror the stylized-components grass material.
    vec3 lightDirection = normalize(uLightDirection);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float viewToSun = pow(max(dot(viewDirection, -lightDirection), 0.0), uBacklightPower);
    float edgeOn = 1.0 - abs(dot(normalize(vBladeNormal), lightDirection));
    float thinTip = mix(1.0, vBladeHeight, uBacklightTip);
    float transmission = viewToSun * edgeOn * thinTip * uBacklightStrength;

    float shadow = 1.0;
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
      DirectionalLightShadow directionalShadow = directionalLightShadows[0];
      shadow = getShadow(
        directionalShadowMap[0],
        directionalShadow.shadowMapSize,
        directionalShadow.shadowIntensity,
        directionalShadow.shadowBias,
        directionalShadow.shadowRadius,
        vDirectionalShadowCoord[0]
      );
    #endif

    // Keep a stylized ambient floor while allowing blade and object shadows to read.
    float shadowLighting = mix(0.58, 1.0, shadow);
    vec3 lit = grassColor * (diffuse * uLightColor * uLightIntensity) * shadowLighting;
    lit += uBacklightColor * uLightColor * uLightIntensity * transmission * shadow;
    gl_FragColor = vec4(lit * uBrightness, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

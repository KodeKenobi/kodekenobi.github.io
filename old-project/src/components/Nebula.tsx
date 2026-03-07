import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Nebula shader adapted for a sphere background
const vertexShader = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
varying vec3 vWorldPosition;
uniform float uTime;

float hash(float n) { return fract(sin(n) * 43758.5453); }
float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f*f*(3.0-2.0*f);
  float n = p.x + p.y*57.0 + 113.0*p.z;
  return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
                 mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
             mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                 mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

void main() {
  // Project world position onto a unit sphere
  vec3 p = normalize(vWorldPosition);
  float t = uTime * 0.07;
  float nebula = 0.0;
  vec3 col = vec3(0.0);
  float d = 1.0 - p.y * 0.2; // fade more at poles
  for (float i = 1.0; i < 6.0; i++) {
    float fi = i * 1.5;
    float n = noise(p * fi + t * 0.2 + fi);
    nebula += n / i;
    // Use a dark blue/cyan/indigo palette, avoid pink
    col += vec3(0.05 + 0.18 * n, 0.13 + 0.22 * n, 0.22 + 0.38 * n) * (0.7 / i);
  }
  float edgeFade = smoothstep(0.95, 0.5, d); // fade at horizon
  nebula = smoothstep(0.2, 0.8, nebula - (1.0 - d) * 0.5) * edgeFade;
  col *= nebula;
  // Make it even darker overall
  col *= 0.7;
  float alpha = nebula * 0.7 * edgeFade;
  gl_FragColor = vec4(col, alpha);
}
`;

export default function Nebula() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  return (
    <mesh scale={100}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  );
}

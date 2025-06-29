import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;
const NEBULA_RADIUS = 40;

export default function NebulaParticles() {
  // Generate random positions and colors for each particle
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spherical nebula volume
      const r = Math.cbrt(Math.random()) * NEBULA_RADIUS;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions.push(x, y, z);
      // Nebula color: blue/cyan/purple range
      const hue = 0.55 + Math.random() * 0.15; // 0.55-0.7 (blue to purple)
      const sat = 0.5 + Math.random() * 0.5;
      const val = 0.5 + Math.random() * 0.5;
      const color = new THREE.Color().setHSL(hue, sat, val);
      colors.push(color.r, color.g, color.b);
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  // Animate particles for a drifting effect
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        // Gentle drifting using sin/cos
        positions.array[ix + 0] += Math.sin(t * 0.12 + i) * 0.002;
        positions.array[ix + 1] += Math.cos(t * 0.09 + i) * 0.002;
        positions.array[ix + 2] += Math.sin(t * 0.07 + i) * 0.002;
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.7}
        vertexColors
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

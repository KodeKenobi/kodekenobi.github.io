import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { AdditiveBlending } from "three";

function EnergyOrb({
  onExplode,
  resetKey,
}: {
  onExplode?: () => void;
  resetKey?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const energyLayer = useRef<THREE.Mesh>(null!);
  const heatLayer = useRef<THREE.Mesh>(null!);
  const [exploding, setExploding] = useState(false);
  const [baseScale, setBaseScale] = useState(1);
  const [hidden, setHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverScale = useRef(1);
  const growTimer = useRef<NodeJS.Timeout | null>(null);
  const geometryRef = useRef<THREE.SphereGeometry>(null!);
  const originalPositions = useRef<Float32Array | null>(null);
  const energyGeometryRef = useRef<THREE.SphereGeometry>(null!);
  const energyOriginalPositions = useRef<Float32Array | null>(null);
  const [flash, setFlash] = useState(false);
  const [showRedSparkles, setShowRedSparkles] = useState(false);
  const [showHeat, setShowHeat] = useState(true);
  const heatGeometryRef = useRef<THREE.SphereGeometry>(null!);
  const groupRef = useRef<THREE.Group>(null!); // For root group
  const shakeGroupRef = useRef<THREE.Group>(null!); // For shaking only orb/layers

  // Reset orb when resetKey changes
  useEffect(() => {
    setExploding(false);
    setBaseScale(1);
    setHidden(false);
    setIsHovered(false);
    hoverScale.current = 1;
    setFlash(false);
    setShowRedSparkles(false);
    setShowHeat(true);
    if (mesh.current) mesh.current.visible = true;
    if (energyLayer.current) energyLayer.current.visible = true;
    if (heatLayer.current) heatLayer.current.visible = true;
  }, [resetKey]);

  if (hidden) return null;

  // Animate pulsating orb, hover grow, and energy layer
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Always grow, faster on hover
    if (!exploding) {
      const growRate = isHovered ? 0.002 : 0.001;
      hoverScale.current += growRate;
      if (hoverScale.current >= 2.15 && !exploding) {
        explodeOrb();
      }
    }
    if (!exploding) {
      mesh.current.rotation.y += 0.01;
      mesh.current.rotation.x += 0.005;
      const scale = baseScale + Math.sin(t * 3) * 0.12;
      mesh.current.scale.set(
        scale * hoverScale.current,
        scale * hoverScale.current,
        scale * hoverScale.current
      );
      if (energyLayer.current) {
        const eScale = scale * 1.13 + Math.sin(t * 3 + 1.5) * 0.13;
        energyLayer.current.scale.set(
          eScale * hoverScale.current,
          eScale * hoverScale.current,
          eScale * hoverScale.current
        );
        const mat = energyLayer.current.material as THREE.MeshPhysicalMaterial;
        mat.opacity = 0.25 + 0.15 * Math.abs(Math.sin(t * 3 + 1.5));
      }
      // Make heat layer scale with hover
      if (heatLayer.current) {
        const hScale = scale * 1.31 + Math.sin(t * 3.2 + 2.2) * 0.14;
        heatLayer.current.scale.set(
          hScale * hoverScale.current,
          hScale * hoverScale.current,
          hScale * hoverScale.current
        );
      }
    }
    // Fluid/wobbly effect for orb
    if (geometryRef.current && !exploding) {
      const geo = geometryRef.current;
      if (!originalPositions.current) {
        // Store original positions as Float32Array
        originalPositions.current = Float32Array.from(
          geo.attributes.position.array as Float32Array
        );
      }
      const pos = geo.attributes.position;
      if (originalPositions.current) {
        for (let i = 0; i < pos.count; i++) {
          const ox = originalPositions.current[i * 3];
          const oy = originalPositions.current[i * 3 + 1];
          const oz = originalPositions.current[i * 3 + 2];
          // Calculate spherical coordinates
          const r = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const theta = Math.atan2(Math.sqrt(ox * ox + oy * oy), oz);
          const phi = Math.atan2(oy, ox);
          // Wobble: sine-based, time and position dependent
          const wobble =
            Math.sin(t * 3 + theta * 6 + phi * 4) * 0.08 +
            Math.sin(t * 2.2 + phi * 8) * 0.04;
          const newR = r + wobble;
          pos.setXYZ(
            i,
            newR * Math.sin(theta) * Math.cos(phi),
            newR * Math.sin(theta) * Math.sin(phi),
            newR * Math.cos(theta)
          );
        }
        pos.needsUpdate = true;
      }
    }
    // Fluid/wobbly effect for energy layer
    if (energyGeometryRef.current && !exploding) {
      const geo = energyGeometryRef.current;
      if (!energyOriginalPositions.current) {
        energyOriginalPositions.current = Float32Array.from(
          geo.attributes.position.array as Float32Array
        );
      }
      const pos = geo.attributes.position;
      if (energyOriginalPositions.current) {
        for (let i = 0; i < pos.count; i++) {
          const ox = energyOriginalPositions.current[i * 3];
          const oy = energyOriginalPositions.current[i * 3 + 1];
          const oz = energyOriginalPositions.current[i * 3 + 2];
          // Calculate spherical coordinates
          const r = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const theta = Math.atan2(Math.sqrt(ox * ox + oy * oy), oz);
          const phi = Math.atan2(oy, ox);
          // Wobble: use same formula, but with a slight phase/amplitude difference
          const wobble =
            Math.sin(t * 3.1 + theta * 6.2 + phi * 4.1) * 0.09 +
            Math.sin(t * 2.3 + phi * 8.2) * 0.05;
          const newR = r + wobble;
          pos.setXYZ(
            i,
            newR * Math.sin(theta) * Math.cos(phi),
            newR * Math.sin(theta) * Math.sin(phi),
            newR * Math.cos(theta)
          );
        }
        pos.needsUpdate = true;
      }
    }
    // Fluid/wobbly effect for heat layer
    if (heatGeometryRef.current && !exploding) {
      const geo = heatGeometryRef.current;
      if (!heatGeometryRef.current.userData.originalPositions) {
        // Store original positions as Float32Array
        heatGeometryRef.current.userData.originalPositions = Float32Array.from(
          geo.attributes.position.array as Float32Array
        );
      }
      const pos = geo.attributes.position;
      const original = heatGeometryRef.current.userData.originalPositions;
      for (let i = 0; i < pos.count; i++) {
        const ox = original[i * 3];
        const oy = original[i * 3 + 1];
        const oz = original[i * 3 + 2];
        const r = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const theta = Math.atan2(Math.sqrt(ox * ox + oy * oy), oz);
        const phi = Math.atan2(oy, ox);
        // Wobble: more turbulent for heat
        const wobble =
          Math.sin(t * 4.1 + theta * 7.2 + phi * 5.1) * 0.18 +
          Math.sin(t * 2.7 + phi * 9.2) * 0.09;
        const newR = r + wobble;
        pos.setXYZ(
          i,
          newR * Math.sin(theta) * Math.cos(phi),
          newR * Math.sin(theta) * Math.sin(phi),
          newR * Math.cos(theta)
        );
      }
      pos.needsUpdate = true;
    }
    // Animate heat layer (pulsate opacity/emissive)
    if (heatLayer.current && showHeat && !exploding) {
      const mat = heatLayer.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.18 + 0.13 * Math.abs(Math.sin(t * 3.5 + 2.1));
      mat.emissiveIntensity = 0.7 + 0.5 * Math.abs(Math.sin(t * 2.7 + 1.2));
    }
    // Hide heat layer during explosion
    if (exploding && heatLayer.current) {
      heatLayer.current.visible = false;
    }
    // Volcano shake effect on hover (only shake orb/layers)
    if (shakeGroupRef.current) {
      if (isHovered && !exploding) {
        // Smooth sine-based shake
        const shakeAmp = 0.045;
        shakeGroupRef.current.position.x = Math.sin(t * 38.0) * shakeAmp;
        shakeGroupRef.current.position.y = Math.sin(t * 51.0) * shakeAmp;
        shakeGroupRef.current.position.z = Math.sin(t * 44.0) * shakeAmp * 0.5;
      } else {
        shakeGroupRef.current.position.set(0, 0, 0);
      }
    }
  });

  const explodeOrb = () => {
    if (exploding) return;
    setExploding(true);
    setFlash(true);
    setShowHeat(false);
    const meshMat = mesh.current.material as THREE.MeshPhysicalMaterial;
    const energyMat = energyLayer.current
      .material as THREE.MeshPhysicalMaterial;
    const tl = gsap.timeline({
      onComplete: () => {
        meshMat.color.set("#a80000");
        meshMat.emissive.set("#ff2222");
        meshMat.emissiveIntensity = 1.5;
        meshMat.opacity = 1;
        meshMat.transparent = false;
        setShowRedSparkles(true);
        setTimeout(() => {
          setShowRedSparkles(false);
        }, 1000);
        setTimeout(() => {
          if (onExplode) onExplode();
          if (mesh.current) mesh.current.visible = false;
          if (energyLayer.current) energyLayer.current.visible = false;
          if (heatLayer.current) heatLayer.current.visible = false;
          setHidden(true);
        }, 600);
      },
    });
    // Orb: implosion (shrink rapidly)
    tl.to(
      mesh.current.scale,
      {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 0.5,
        ease: "power2.in",
      },
      0
    );
    // Heat layer: implosion (shrink rapidly)
    if (heatLayer.current) {
      tl.to(
        heatLayer.current.scale,
        {
          x: 0.01,
          y: 0.01,
          z: 0.01,
          duration: 0.5,
          ease: "power2.in",
        },
        0
      );
    }
    // Energy layer: burst outward, fade, color shift
    tl.to(
      energyLayer.current.scale,
      {
        x: 13,
        y: 13,
        z: 13,
        duration: 0.9,
        ease: "power2.out",
      },
      0.05
    )
      .to(
        energyMat,
        {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: () => {
            energyMat.needsUpdate = true;
          },
        },
        0.18
      )
      .to(
        energyMat.color,
        {
          r: 1,
          g: 1,
          b: 1,
          duration: 0.3,
          ease: "power1.inOut",
        },
        0.18
      );
    // Orb: fade in opacity (if needed)
    tl.to(
      meshMat,
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      },
      0.1
    );
    // Hide flash after short time
    setTimeout(() => setFlash(false), 180);
  };

  return (
    <group ref={groupRef}>
      {/* Flash overlay */}
      {flash && (
        <Html center style={{ pointerEvents: "none" }} zIndexRange={[100, 101]}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "radial-gradient(circle, #fff 0%, #fff0 80%)",
              opacity: 0.85,
              zIndex: 100,
              pointerEvents: "none",
            }}
          />
        </Html>
      )}
      {/* Red sparkles burst */}
      {showRedSparkles && (
        <Sparkles
          count={60}
          scale={2.5}
          size={2.2}
          color="#ff2222"
          speed={2.5}
          noise={1.5}
          position={[0, 0, 0]}
        />
      )}
      {/* Shaking group for orb and layers */}
      <group ref={shakeGroupRef}>
        {/* Main orb - INCREASED SIZE */}
        <mesh
          ref={mesh}
          onClick={explodeOrb}
          castShadow
          receiveShadow
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        >
          <sphereGeometry ref={geometryRef} args={[2.0, 64, 64]} />
          <meshPhysicalMaterial
            color="#00e0ff"
            emissive="#00fff7"
            emissiveIntensity={2.5}
            roughness={0.1}
            metalness={0.7}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.8}
            thickness={0.5}
          />
        </mesh>
        {/* Energy layer - INCREASED SIZE */}
        <mesh ref={energyLayer}>
          <sphereGeometry ref={energyGeometryRef} args={[2.3, 64, 64]} />
          <meshPhysicalMaterial
            color="#00fff7"
            transparent
            opacity={0.35}
            roughness={0.2}
            metalness={0.7}
            emissive="#00fff7"
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* Heat reddish layer - NEW */}
        {showHeat && (
          <mesh ref={heatLayer} renderOrder={2}>
            <sphereGeometry ref={heatGeometryRef} args={[3.2, 64, 64]} />
            <meshPhysicalMaterial
              color="#ff3c1a"
              transparent
              opacity={0.08}
              roughness={0.6}
              metalness={0.4}
              emissive="#ff3c1a"
              emissiveIntensity={1.5}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

function BigBangParticles({ trigger }: { trigger: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [exploded, setExploded] = useState(false);
  // Store random directions and offsets for each particle
  const particleData = React.useMemo(
    () =>
      Array.from({ length: 200 }).map(() => {
        // Outward direction
        const dir = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize();
        // Unique float/orbit offset
        const floatPhase = Math.random() * Math.PI * 2;
        const floatRadius = 0.5 + Math.random() * 1.2;
        const floatSpeed = 0.5 + Math.random() * 0.7;
        return { dir, floatPhase, floatRadius, floatSpeed };
      }),
    []
  );

  // Animate particles
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((obj, i) => {
      const { dir, floatPhase, floatRadius, floatSpeed } = particleData[i];
      // Swirl/floating base position
      const swirlX = Math.cos(t * floatSpeed + floatPhase) * floatRadius;
      const swirlY = Math.sin(t * floatSpeed + floatPhase) * floatRadius;
      const swirlZ =
        Math.sin(t * floatSpeed * 0.7 + floatPhase) * floatRadius * 0.7;
      // If exploded, add outward movement
      if (trigger) {
        // Animate outward, but keep swirling
        // We'll use t since explosion for outward progress
        // For simplicity, use t since trigger (not perfect, but works for visual)
        const explosionProgress = Math.min((t - 0.2) / 2, 1); // 2s duration, slight delay
        obj.position.set(
          swirlX + dir.x * explosionProgress * 20,
          swirlY + dir.y * explosionProgress * 20,
          swirlZ + dir.z * explosionProgress * 20
        );
      } else {
        // Just swirl around the origin
        obj.position.set(swirlX, swirlY, swirlZ);
      }
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: 200 }).map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[0.03 + Math.random() * 0.06, 10, 10]} />
          <meshBasicMaterial color="#00fff7" />
        </mesh>
      ))}
    </group>
  );
}

function NebulaDustParticles() {
  const group = useRef<THREE.Group>(null);
  // Nebula color palette
  const nebulaColors = [
    "#00fff7",
    "#ff00e0",
    "#fffb00",
    "#ff6b00",
    "#00ffb2",
    "#7a00ff",
    "#ff007a",
    "#00baff",
    "#fff",
    "#ffb347",
    "#baffc9",
    "#f7b7a3",
    "#b5ead7",
    "#c7ceea",
    "#f6abb6",
    "#f9d5e5",
  ];
  // Precompute particle data
  const dustData = React.useMemo(
    () =>
      Array.from({ length: 12000 }).map(() => {
        // Spherical shell far from the origin
        const r = 40 + Math.random() * 80; // much larger, thicker radius
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi) + (Math.random() - 0.5) * 2;
        // Some particles are larger for clumps
        const size =
          Math.random() < 0.93
            ? 0.02 + Math.random() * 0.04
            : 0.07 + Math.random() * 0.05; // 7% are larger (0.07–0.12)
        const color =
          nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        const opacity = 0.12 + Math.random() * 0.5;
        return { x, y, z, size, color, opacity };
      }),
    []
  );
  // Animate subtle drifting
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((obj, i) => {
      const base = dustData[i];
      // Gentle drifting
      obj.position.x = base.x + Math.sin(t * 0.12 + i) * 0.18;
      obj.position.y = base.y + Math.cos(t * 0.13 + i) * 0.18;
      obj.position.z = base.z + Math.sin(t * 0.09 + i) * 0.12;
    });
  });
  return (
    <group ref={group}>
      {dustData.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]}>
          <sphereGeometry args={[d.size, 8, 8]} />
          <meshBasicMaterial
            color={d.color}
            transparent
            opacity={d.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function BlackHole({ onReplay }: { onReplay: () => void }) {
  // Black sphere with glowing accretion disk, clickable to replay
  return (
    <group>
      <mesh
        onClick={onReplay}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="black"
          emissive="#220000" // subtle dark red
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Glowing accretion disk - wider and thinner */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.045, 48, 160]} />
        <meshBasicMaterial color="#00fff7" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function OrbitingPlanet({
  radius,
  speed,
  color,
  size = 0.2, // default fallback
  initialAngle = 0,
}: {
  radius: number;
  speed: number;
  color: string;
  size?: number;
  initialAngle?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  // Animate planet position
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + initialAngle;
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Thin ring around the planet */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[size * 1.6, 0.012, 16, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

const planetConfigs = [
  { name: "Mercury", radius: 4, speed: 0.55, color: "#b1b1b1", size: 0.13 },
  { name: "Venus", radius: 5, speed: 0.42, color: "#e6d8ad", size: 0.19 },
  { name: "Earth", radius: 6, speed: 0.34, color: "#3a7ca5", size: 0.21 },
  { name: "Mars", radius: 7, speed: 0.28, color: "#b5533c", size: 0.16 },
  { name: "Jupiter", radius: 8.5, speed: 0.2, color: "#d9b48f", size: 0.45 },
  { name: "Saturn", radius: 10, speed: 0.16, color: "#e5c97b", size: 0.38 },
  { name: "Uranus", radius: 11.5, speed: 0.12, color: "#7ad0d6", size: 0.28 },
  { name: "Neptune", radius: 13, speed: 0.1, color: "#355c7d", size: 0.27 },
];

interface EnergyOrbSceneProps {
  featuredRef: React.RefObject<HTMLDivElement>;
  footerRef: React.RefObject<HTMLDivElement>;
  onExplosion?: () => void;
  resetKey?: number;
  onClose?: () => void;
}

// Add a ref to bypass the exit modal
const bypassExitModalRef = { current: false };

// Expose a setter for the bypass flag
export function setBypassExitModal(val: boolean) {
  bypassExitModalRef.current = val;
}

const EnergyOrbScene: React.FC<EnergyOrbSceneProps> = ({
  featuredRef,
  footerRef,
  onExplosion,
  resetKey,
  onClose,
}) => {
  const [exploded, setExploded] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [orbResetKey, setOrbResetKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visiblePlanets, setVisiblePlanets] = useState(0);
  const [planetOpacities, setPlanetOpacities] = useState<number[]>(
    Array(planetConfigs.length).fill(0)
  );
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingExit, setPendingExit] = useState(false);

  // Intersection Observer to reset orb if out of view
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (bypassExitModalRef.current) {
            bypassExitModalRef.current = false;
            return;
          }
          setShowExitModal(true);
          setPendingExit(true);
        }
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle user choice in modal
  const handleStay = () => {
    setShowExitModal(false);
    setPendingExit(false);
    // Scroll back into view
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleLeave = () => {
    setShowExitModal(false);
    setPendingExit(false);
    // Actually reset everything
    setExploded(false);
    setReplayKey((k) => k + 1);
    setOrbResetKey((k) => k + 1);
    setVisiblePlanets(0);
    setPlanetOpacities(Array(planetConfigs.length).fill(0));
  };

  // Reset orb from parent
  useEffect(() => {
    if (typeof resetKey === "number") {
      setExploded(false);
      setReplayKey((k) => k + 1);
      setOrbResetKey((k) => k + 1);
      setVisiblePlanets(0);
      setPlanetOpacities(Array(planetConfigs.length).fill(0));
    }
  }, [resetKey]);

  // Scroll to next section (optional, can use featuredRef if needed)
  const handleScrollDown = () => {
    if (featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reset scene
  const handleReplay = () => {
    setExploded(false);
    setReplayKey((k) => k + 1);
    setOrbResetKey((k) => k + 1);
    setVisiblePlanets(0);
    setPlanetOpacities(Array(planetConfigs.length).fill(0));
  };

  // Navbar height (adjust as needed)
  const NAVBAR_HEIGHT = 54; // px

  useEffect(() => {
    if (exploded && onExplosion) {
      onExplosion();
    }
    // Stagger planet/orbit appearance after explosion
    if (exploded) {
      setVisiblePlanets(0);
      setPlanetOpacities(Array(planetConfigs.length).fill(0));
      planetConfigs.forEach((_, i) => {
        setTimeout(() => {
          setVisiblePlanets((prev) => Math.max(prev, i + 1));
          setPlanetOpacities((prev) => {
            const next = [...prev];
            next[i] = 1;
            return next;
          });
        }, 1200 + i * 1200);
      });
    }
  }, [exploded, onExplosion]);

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center bg-inherit relative min-h-screen"
      style={{ minHeight: "100vh", maxHeight: "90vh" }}
    >
      <Canvas
        key={replayKey}
        camera={{ position: [0, 0, 28], fov: 60 }}
        style={{ width: "100%", height: "100%", background: "none" }}
      >
        {/* Nebula dust cloud backdrop */}
        <NebulaDustParticles />
        {/* Sparkles background */}
        <Sparkles
          count={100}
          scale={10}
          size={1.5}
          color="#0ff"
          speed={1.2}
          noise={2}
        />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        {/* Orbit lines for each planet */}
        {exploded &&
          planetConfigs.slice(0, visiblePlanets).map((p, i) => (
            <mesh key={"orbit-" + i} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[p.radius, 0.012, 16, 128]} />
              <meshBasicMaterial
                color="#aaa"
                transparent
                opacity={0.18 * planetOpacities[i]}
              />
            </mesh>
          ))}

        <Suspense fallback={<Html center>Loading...</Html>}>
          {!exploded ? (
            <Float>
              <EnergyOrb
                onExplode={() => setExploded(true)}
                resetKey={orbResetKey}
              />
            </Float>
          ) : (
            <>
              <BlackHole onReplay={handleReplay} />
              <BigBangParticles trigger={true} />
              {planetConfigs.slice(0, visiblePlanets).map((p, i) => (
                <group key={i}>
                  <OrbitingPlanet
                    radius={p.radius}
                    speed={p.speed}
                    color={p.color}
                    size={p.size}
                    initialAngle={(i * Math.PI) / 4} // staggered start
                  />
                  {/* Fade-in for planet */}
                  <mesh position={[0, 0, 0]} visible={false}>
                    <sphereGeometry args={[0.01, 8, 8]} />
                    <meshBasicMaterial
                      opacity={planetOpacities[i]}
                      transparent
                    />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </Suspense>
        <OrbitControls enabled={exploded} />
      </Canvas>
      {/* Replay and Scroll Down UI */}
      {exploded && (
        <>
          {/* Horizontal bottom bar for replay button and tooltip */}
          <div className="absolute bottom-8 left-0 w-full flex flex-row items-center justify-center gap-4 z-20">
            <div className="group flex flex-col items-center gap-0 relative">
              <button
                onClick={onClose ? onClose : handleReplay}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-cyan-400 bg-black/60 hover:bg-cyan-900/80 transition-all shadow-lg cursor-pointer"
                aria-label="Big Bang"
                tabIndex={0}
              >
                {/* Thin arrow icon (SVG) */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="13"
                    stroke="#67e8f9"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <path
                    d="M19 14a5 5 0 1 0-2.5 4.33"
                    stroke="#67e8f9"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 14v5h-5"
                    stroke="#67e8f9"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span
                className="absolute left-1/2 -translate-x-1/2 mt-2 text-xs text-cyan-200 px-6 py-1 rounded font-thin tracking-wide select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center min-w-[120px]"
                style={{ fontFamily: "inherit", bottom: "-2.5rem" }}
              >
                Big Bang It Again
              </span>
            </div>
          </div>
        </>
      )}
      {/* Exit constellation modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gray-900 rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 border border-cyan-400 min-w-[320px] max-w-[90vw]">
            <div className="text-cyan-200 text-lg font-semibold mb-2 text-center">
              Leave the Constellation?
            </div>
            <div className="text-cyan-100 text-sm mb-4 text-center">
              Are you sure you want to exit this cosmic experience?
            </div>
            <div className="flex gap-4">
              <button
                className="px-5 py-2 rounded bg-cyan-700 hover:bg-cyan-500 text-white font-medium transition"
                onClick={handleLeave}
              >
                Yes, Leave
              </button>
              <button
                className="px-5 py-2 rounded bg-gray-700 hover:bg-cyan-800 text-cyan-200 font-medium transition"
                onClick={handleStay}
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyOrbScene;

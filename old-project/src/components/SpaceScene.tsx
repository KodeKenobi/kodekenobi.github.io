import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CameraAnimation = () => {
  const { camera } = useThree();

  useEffect(() => {
    gsap.to(camera.position, {
      z: -200,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, [camera]);

  return null;
};

const Planets = () => {
  const planetTexture = useTexture(
    "https://threejsfundamentals.org/threejs/resources/images/planets/earth_atmos_2048.jpg"
  );

  const positions = [
    [-20, 5, -50],
    [25, -10, -120],
    [-15, 8, -180],
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshStandardMaterial map={planetTexture} />
        </mesh>
      ))}
    </>
  );
};

const Comets = () => {
  const group = useRef<THREE.Group>(null!);

  useFrame(() => {
    group.current.children.forEach((comet) => {
      comet.position.x += 0.2;
      if (comet.position.x > 50) comet.position.x = -50;
    });
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 80 - 40,
            Math.random() * 40 - 20,
            Math.random() * -300 - 50,
          ]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="orange" />
        </mesh>
      ))}
    </group>
  );
};

const Wormhole = () => {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    mesh.current.rotation.z += 0.005;
  });

  return (
    <mesh ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[20, 5, 16, 100]} />
      <meshBasicMaterial color="#44ccff" wireframe opacity={0.2} transparent />
    </mesh>
  );
};

const SciFiCity = () => {
  const group = useRef<THREE.Group>(null!);

  useEffect(() => {
    group.current.visible = false;

    gsap.to(group.current.position, {
      z: -700,
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "80% center",
        end: "100% bottom",
        scrub: true,
        onUpdate: (self) => {
          group.current.visible = self.progress > 0.1;
        },
      },
    });
  }, []);

  return (
    <group ref={group} position={[0, -5, -900]}>
      {[...Array(100)].map((_, i) => (
        <mesh
          key={i}
          position={[(Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40]}
        >
          <boxGeometry args={[1, Math.random() * 10 + 2, 1]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
};

export default function SpaceScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <color attach="background" args={["#000"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[30, 30, 30]} intensity={1} />
      <Stars radius={300} depth={60} count={5000} factor={4} fade />
      <CameraAnimation />
      <Wormhole />
      <Planets />
      <Comets />
      <SciFiCity />
    </Canvas>
  );
}

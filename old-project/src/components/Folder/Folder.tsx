import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const FolderModel = () => {
  const topRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(() => {
    if (!topRef.current || !paperRef.current) return;

    // Animate top cover
    topRef.current.rotation.x = THREE.MathUtils.lerp(
      topRef.current.rotation.x,
      hovered || clicked ? -Math.PI / 2.5 : 0,
      0.1
    );

    // Animate paper rise
    paperRef.current.position.y = THREE.MathUtils.lerp(
      paperRef.current.position.y,
      hovered || clicked ? 0.3 : -0.1,
      0.05
    );
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      {/* Folder base */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[1.5, 0.02, 1]} />
        <meshStandardMaterial color="#e0b97f" />
      </mesh>

      {/* Folder top (hinged lid) */}
      <mesh ref={topRef} position={[0, -0.24, 0.5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.02, 0.5]} />
        <meshStandardMaterial color="#d9a65e" />
      </mesh>

      {/* Paper / CV / PDF */}
      <mesh ref={paperRef} position={[0, -0.1, 0]}>
        <boxGeometry args={[1.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const Folder = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Canvas camera={{ position: [2, 1.5, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<Html>Loading...</Html>}>
          <FolderModel />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default Folder;

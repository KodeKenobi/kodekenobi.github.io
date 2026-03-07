import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function Card({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      if (hovered) {
        mesh.current.scale.set(1.1, 1.1, 1.1);
      } else if (!clicked) {
        mesh.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh
      ref={mesh}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
    >
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial
        color={hovered ? "white" : color}
        emissive={color}
        emissiveIntensity={0.5}
      />
      <Html center>
        <div
          style={{
            color: "#fff",
            fontWeight: "bold",
            textShadow: "0 0 20px white",
            pointerEvents: "none",
            fontSize: "1rem",
          }}
        >
          {title}
        </div>
      </Html>
    </mesh>
  );
}

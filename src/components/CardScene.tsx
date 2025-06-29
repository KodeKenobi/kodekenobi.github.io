import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Html, Float } from "@react-three/drei";
import Card from "./Card3D";

const cards = [
  { title: "Frontend", color: "#22c55e" },
  { title: "Backend", color: "#3b82f6" },
  { title: "DevOps", color: "#ec4899" },
  { title: "AI", color: "#8b5cf6" },
  { title: "Design", color: "#f59e0b" },
  { title: "Security", color: "#ef4444" },
];

export default function CardScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} />

      {cards.map((card, i) => (
        <Float
          key={card.title}
          position={[((i % 3) - 1) * 3, -Math.floor(i / 3) * 4, 0]}
          speed={3}
          rotationIntensity={2}
          floatIntensity={2}
        >
          <Card title={card.title} color={card.color} />
        </Float>
      ))}
    </Canvas>
  );
}

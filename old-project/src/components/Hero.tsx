import { Canvas } from "@react-three/fiber";
import {
  Fisheye,
  CameraControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Level, Sudo, Camera, Cactus, Box } from "./Scene/Scene";
import { useEffect } from "react";
import { Suspense } from "react";

export default function Hero({ onLoaded }: { onLoaded?: () => void }) {
  // LoaderCallback ensures onLoaded is called after Suspense resolves
  function LoaderCallback() {
    useEffect(() => {
      if (onLoaded) onLoaded();
    }, []);
    return null;
  }
  return (
    <div className="w-full h-screen">
      <Canvas flat>
        <Suspense fallback={null}>
          <Fisheye zoom={0}>
            <CameraControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.6} />
            <ambientLight intensity={Math.PI / 2} />
            <group scale={20} position={[5, -11, -5]}>
              <Level />
              <Sudo />
              <Camera />
              <Cactus />
              <Box position={[-0.8, 1.4, 0.4]} scale={0.15} />
            </group>
            <Environment preset="city" background blur={1} />
            <PerspectiveCamera makeDefault position={[0, 0, 18.5]} />
            <LoaderCallback />
          </Fisheye>
        </Suspense>
      </Canvas>
    </div>
  );
}

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

export default function Hero({
  onLoaded,
  onScrollDown,
}: {
  onLoaded?: () => void;
  onScrollDown?: () => void;
}) {
  function LoaderCallback() {
    useEffect(() => {
      if (onLoaded) onLoaded();
    }, []);
    return null;
  }

  return (
    <div className="relative w-full h-screen">
      {/* 3D Scene */}
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

      {/* Scroll Down Button */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer pointer-events-auto flex flex-col items-center"
        onClick={onScrollDown}
      >
        <div className="w-8 h-14 rounded-full border-2 border-white/60 flex items-start justify-center relative hover:border-white/80 transition-colors duration-300">
          <div className="w-2 h-2 bg-white/60 rounded-full mt-2 animate-bounce hover:bg-white/80 transition-colors duration-300"></div>
        </div>
        <span className="block text-white/60 text-xs mt-2 text-center font-light tracking-wide hover:text-white/80 transition-colors duration-300">
          Scroll Down
        </span>
      </div>
    </div>
  );
}

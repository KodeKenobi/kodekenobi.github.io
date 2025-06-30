import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
} from "framer-motion";
import type { PanInfo, ResolvedValues } from "framer-motion";

// Programming language images (public URLs)
const LANG_IMGS: string[] = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
];

// Accent background color mapping for each logo
const LOGO_BG: Record<string, string> = {
  javascript: "bg-yellow-100",
  typescript: "bg-blue-100",
  python: "bg-blue-50",
  java: "bg-orange-100",
  cplusplus: "bg-indigo-100",
  react: "bg-cyan-100",
  nodejs: "bg-green-100",
  docker: "bg-sky-100",
  mongodb: "bg-green-50",
  git: "bg-orange-50",
};

// Accent border color mapping for each logo
const LOGO_BORDER: Record<string, string> = {
  javascript: "border-yellow-400",
  typescript: "border-blue-400",
  python: "border-blue-300",
  java: "border-orange-400",
  cplusplus: "border-indigo-400",
  react: "border-cyan-400",
  nodejs: "border-green-400",
  docker: "border-sky-400",
  mongodb: "border-green-300",
  git: "border-orange-300",
};

function getLogoBg(url: string) {
  if (url.includes("javascript")) return LOGO_BG.javascript;
  if (url.includes("typescript")) return LOGO_BG.typescript;
  if (url.includes("python")) return LOGO_BG.python;
  if (url.includes("java")) return LOGO_BG.java;
  if (url.includes("cplusplus")) return LOGO_BG.cplusplus;
  if (url.includes("react")) return LOGO_BG.react;
  if (url.includes("nodejs")) return LOGO_BG.nodejs;
  if (url.includes("docker")) return LOGO_BG.docker;
  if (url.includes("mongodb")) return LOGO_BG.mongodb;
  if (url.includes("git")) return LOGO_BG.git;
  return "bg-gray-100";
}

function getLogoBorder(url: string) {
  if (url.includes("javascript")) return LOGO_BORDER.javascript;
  if (url.includes("typescript")) return LOGO_BORDER.typescript;
  if (url.includes("python")) return LOGO_BORDER.python;
  if (url.includes("java")) return LOGO_BORDER.java;
  if (url.includes("cplusplus")) return LOGO_BORDER.cplusplus;
  if (url.includes("react")) return LOGO_BORDER.react;
  if (url.includes("nodejs")) return LOGO_BORDER.nodejs;
  if (url.includes("docker")) return LOGO_BORDER.docker;
  if (url.includes("mongodb")) return LOGO_BORDER.mongodb;
  if (url.includes("git")) return LOGO_BORDER.git;
  return "border-gray-700";
}

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  images?: string[];
}

const RollingGallery: React.FC<RollingGalleryProps> = ({
  autoplay = false,
  pauseOnHover = false,
  images = [],
}) => {
  const galleryImages = images.length > 0 ? images : LANG_IMGS;

  const isScreenSizeSm = window.innerWidth <= 640;
  const cylinderWidth: number = isScreenSizeSm ? 1280 : 1800;
  const faceCount: number = galleryImages.length;
  const faceWidth: number = isScreenSizeSm
    ? 120
    : (cylinderWidth / faceCount) * 1.5;
  const radius: number = isScreenSizeSm ? 200 : cylinderWidth / (2 * Math.PI);

  const dragFactor: number = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const transform = useTransform(
    rotation,
    (val: number) => `rotate3d(0,1,0,${val}deg)`
  );

  const startInfiniteSpin = (startAngle: number) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const handleUpdate = (latest: ResolvedValues) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);
    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = (): void => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };

  const handleMouseLeave = (): void => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="relative mt-2 md:mt-16 w-full max-w-[360px] md:max-w-none mx-auto overflow-x-visible overflow-y-visible h-[110px] md:h-auto">
      <div
        className="absolute top-0 left-0 h-full w-[48px] z-10"
        // style={{
        //   background:
        //     "linear-gradient(to left, rgba(0,0,0,0) 0%, #060010 100%)",
        // }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[48px] z-10"
        // style={{
        //   background:
        //     "linear-gradient(to right, rgba(0,0,0,0) 0%, #060010 100%)",
        // }}
      />
      <div className="flex h-full items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
        <motion.div
          drag="x"
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={controls}
          onUpdate={handleUpdate}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
        >
          {galleryImages.map((url, i) => (
            <div
              key={i}
              className={`group absolute flex h-fit items-center justify-center p-0 [backface-visibility:hidden] md:p-0`}
              style={{
                width: isScreenSizeSm ? "80px" : `${faceWidth}px`,
                transform: `rotateY(${
                  (360 / faceCount) * i
                }deg) translateZ(${radius}px)`,
              }}
            >
              <div
                className={`flex items-center justify-center h-[80px] w-[80px] md:h-[120px] md:w-[180px] rounded-2xl border-[3px] ${getLogoBorder(
                  url
                )} shadow-md ${getLogoBg(url)}`}
              >
                <img
                  src={url}
                  alt="gallery"
                  className="pointer-events-none max-h-[50px] max-w-[60px] md:max-h-[70px] md:max-w-[120px] object-contain p-1 md:p-2 transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;

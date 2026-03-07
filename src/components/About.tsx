import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Slide1 from "./about/Slide1";
import Slide2 from "./about/Slide2";
import Slide3 from "./about/Slide3";
import Slide4 from "./about/Slide4";
import Slide5 from "./about/Slide5";
import { DynamicPagination } from "./about/Shared";

// ─── SLIDE MAP ───
const slides = [Slide1, Slide2, Slide3, Slide4, Slide5];

// ─── HORIZONTAL SLIDE VARIANTS ───
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "50%" : "-50%",
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-50%" : "50%",
    opacity: 0,
    filter: "blur(10px)",
  }),
};

// ─── ABOUT COMPONENT ───
const slideLabels = ["The Architect", "Philosophy", "The Journey", "The Method", "The Next Step"];

interface AboutProps {
  slideIndex: number;
  direction: number;
  isActive: boolean;
  onSlideChange?: (index: number, direction: number) => void;
  onSlide5Action?: (triggered: boolean) => void;
}

export const About: React.FC<AboutProps> = ({ slideIndex, direction, isActive, onSlideChange, onSlide5Action }) => {
  const ActiveSlide = slides[slideIndex];
  const [flashPreview, setFlashPreview] = useState(false);
  const [hasFlashed, setHasFlashed] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (isActive && !hasFlashed) {
      const t1 = setTimeout(() => {
        setFlashPreview(true);
        setTimeout(() => {
          setFlashPreview(false);
          setHasFlashed(true);
        }, 350); // very quick flash
      }, 1000);
      return () => clearTimeout(t1);
    }
  }, [isActive, hasFlashed]);

  return (
    <div className="relative w-full h-full bg-[#050505] font-sans overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]" />

      {/* Horizontal Slides */}
      <AnimatePresence initial={true} custom={direction}>
        {isActive && (
          <motion.div
            key={slideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <ActiveSlide onActionTriggered={slideIndex === 4 ? onSlide5Action : undefined} />
          </motion.div>
        )}
      </AnimatePresence>

      <DynamicPagination
        activeIndex={slideIndex}
        totalSlides={slides.length}
        labels={slideLabels}
        onSlideChange={onSlideChange!}
        isActive={isActive}
        slides={slides}
      />

      {/* Cinematic Grain */}
      <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.015] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseAboutNew">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseAboutNew)" />
        </svg>
      </div>
    </div>
  );
};

export default About;

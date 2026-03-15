import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CINEMATIC_EASE = [0.77, 0, 0.175, 1] as const;
import DecryptText from "./Animations/DecryptText";

export const AnimatedHero: React.FC = () => {
  const [scene, setScene] = useState(1);

  // Scene Orchestration Timeline
  useEffect(() => {
    // const hasPlayed = sessionStorage.getItem("heroAnimationPlayed");
    // if (hasPlayed) {
    //   setScene(9);
    //   return;
    // }

    // S1: 0.5s pause
    const s2Timer = setTimeout(() => setScene(2), 500);
    // S2: starts 0.5s, duration 1.2s -> ends 1.7s
    const s3Timer = setTimeout(() => setScene(3), 1800);
    // S3: starts 1.8s, duration 0.8s -> ends 2.6s
    const s4Timer = setTimeout(() => setScene(4), 3000);
    // S4: starts 3.0s, duration 0.9s -> ends 3.9s
    const s5Timer = setTimeout(() => setScene(5), 4100);

    // EXTENDED SEQUENCE (Scenes 6-9)
    const s6Timer = setTimeout(() => setScene(6), 5500);   // The Cleansing (Exit Stage)
    const s7Timer = setTimeout(() => setScene(7), 5800);   // The Cinematic Shutter (Re-frame)
    const s8Timer = setTimeout(() => setScene(8), 6500);   // The Signature (New Identity)
    // const s9Timer = setTimeout(() => {
    //   setScene(9);
    //   sessionStorage.setItem("heroAnimationPlayed", "true");
    // }, 7500);  // Final Resolution (The MIK Layout) - Extended delay

    return () => {
      [s2Timer, s3Timer, s4Timer, s5Timer, s6Timer, s7Timer, s8Timer].forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white font-sans">

      {/* 
        CINEMATIC WORLD (The Revealed Image)
        Clipped to a circle in S1, expands in S2 
      */}
      <motion.div
        initial={{ clipPath: "circle(40px at 50% 50%)" }}
        animate={scene >= 2 ? {
          clipPath: "circle(150% at 50% 50%)"
        } : {
          clipPath: "circle(40px at 50% 50%)"
        }}
        transition={{ duration: 1.2, ease: CINEMATIC_EASE }}
        className="absolute inset-0 z-10 bg-[#050505] overflow-hidden flex items-center justify-center"
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0">
          <motion.img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
            alt="Cinematic Architecture"
            initial={{ scale: 1, filter: "none" }}
            animate={{
              scale: scene >= 7 ? 1.08 : 1,
              filter: scene >= 8 ? "grayscale(1) brightness(0.7) contrast(1.2)" : "none",
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for Contrast */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Title Layer - Preserves S1-S5, Extends for S6 Exit */}
        <motion.div
          animate={
            scene >= 6 ? { x: "-100vw", opacity: 0 } : // S6: EXIT LEFT
              scene >= 4 ? { x: "-20vw" } :              // S4-S5: PRESERVED
                { x: 0 }
          }
          transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
          className="relative z-20"
        >
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={scene >= 3 ? { y: 0 } : { y: "110%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-6xl md:text-[8rem] font-bold leading-[0.85] tracking-tighter"
            >
              <motion.span
                animate={scene >= 3 ? { letterSpacing: "-0.05em" } : { letterSpacing: "0.05em" }}
                transition={{ duration: 1.5, delay: 0.2 }}
              >
                BEYOND
                <br />
                COMPLEXITY
              </motion.span>
            </motion.h1>
          </div>
        </motion.div>
      </motion.div>

      {/* 
        WHITE SLATE (Scene 4 & 5)
        Preserves S1-S5, Extends for S6 Exit
      */}
      <AnimatePresence>
        {scene >= 4 && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{
              x: scene >= 6 ? "100%" : "60%" // S6: EXIT RIGHT / S4-S5: PRESERVED
            }}
            transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
            className="absolute inset-y-0 right-0 w-full bg-white z-[60] flex flex-col justify-center px-12 md:px-24"
          >
            {/* Scene 5: Secondary Text Revelation */}
            <div className="max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={scene >= 5 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-black text-3xl md:text-5xl font-light leading-tight">
                  Technical precision meets...<br />
                  Digital Alchemy
                </h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={scene >= 5 ? { width: 40 } : {}}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="h-px bg-black/20 mt-10"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        SCENE 7: CINEMATIC SHUTTERS (Letterbox)
        Visible S7-S8 only. Retracts at S9.
      */}
      <motion.div
        initial={{ height: "0vh" }}
        animate={scene >= 9 ? { height: "0vh" } : scene >= 7 ? { height: "12vh" } : { height: "0vh" }}
        transition={{ duration: 1.2, ease: CINEMATIC_EASE }}
        className="absolute top-0 left-0 right-0 bg-[#050505] z-[80] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      />
      <motion.div
        initial={{ height: "0vh" }}
        animate={scene >= 9 ? { height: "0vh" } : scene >= 7 ? { height: "12vh" } : { height: "0vh" }}
        transition={{ duration: 1.2, ease: CINEMATIC_EASE }}
        className="absolute bottom-0 left-0 right-0 bg-[#050505] z-[80] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
      />

      {/* 
        SCENE 8: THE SIGNATURE (New Identity)
        Becomes "Brand Anchor" in S9 (Slides Left)
      */}
      <AnimatePresence>
        {scene >= 8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              scene >= 9 ? { x: "-25vw", y: 0, scale: 0.8, opacity: 1 } : // S9: SLIDE LEFT & ANCHOR
                { x: 0, y: 0, scale: 1, opacity: 1 }                        // S8: CENTER STAGE
            }
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center relative">
              {/* Decorative vertical line - Fades out in S9 */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: scene >= 9 ? 0 : 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute left-1/2 -top-32 -translate-x-1/2 w-px accent-line-gold"
              />

              <div className="flex flex-col items-center leading-none">
                <h3 className="text-white text-5xl md:text-8xl font-black tracking-[0.2em] font-sans drop-shadow-2xl">
                  <DecryptText text="KODE" trigger={scene === 8} />
                </h3>
                <h3 className="text-white text-5xl md:text-8xl font-black tracking-[0.2em] font-sans drop-shadow-2xl">
                  <DecryptText text="KENOBI" trigger={scene === 8} />
                </h3>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="h-px w-12 accent-line-gold" />
                <p className="text-zinc-400 font-mono text-xs tracking-[0.4em] uppercase">
                  Creative Engineering
                </p>
                <div className="h-px w-12 accent-line-gold" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        SCENE 9: RIGHT HERO CONTENT (The Insight)
        Appears on Right Side
      */}
      <AnimatePresence>
        {scene >= 9 && (
          <motion.div
            initial={{ opacity: 0, x: "10vw" }} // Reduced movement distance for smoothness
            animate={{ opacity: 1, x: "15vw" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 1.5 }} // Smoother ease, synced start
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="relative p-12 md:p-16 border-none">
              {/* PRECISION CORNERS (SVG) - NEUTRALIZED - SEQUENCED */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top Left */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 2.5, ease: "easeInOut" }} // Starts after container is visible
                  className="absolute top-0 left-0 w-16 h-16 text-white/40 drop-shadow-none"
                  viewBox="0 0 64 64" fill="none"
                >
                  <path d="M1 63V1H63" stroke="currentColor" strokeWidth="1.5" />
                </motion.svg>

                {/* Top Right */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 2.5, ease: "easeInOut" }}
                  className="absolute top-0 right-0 w-16 h-16 text-white/40 drop-shadow-none"
                  viewBox="0 0 64 64" fill="none"
                >
                  <path d="M1 1H63V63" stroke="currentColor" strokeWidth="1.5" />
                </motion.svg>

                {/* Bottom Left */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 2.5, ease: "easeInOut" }}
                  className="absolute bottom-0 left-0 w-16 h-16 text-white/40 drop-shadow-none"
                  viewBox="0 0 64 64" fill="none"
                >
                  <path d="M1 1V63H63" stroke="currentColor" strokeWidth="1.5" />
                </motion.svg>

                {/* Bottom Right */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 2.5, ease: "easeInOut" }}
                  className="absolute bottom-0 right-0 w-16 h-16 text-white/40 drop-shadow-none"
                  viewBox="0 0 64 64" fill="none"
                >
                  <path d="M63 1V63H1" stroke="currentColor" strokeWidth="1.5" />
                </motion.svg>
              </div>

              {/* UNIFIED TYPOGRAPHY (Sans Serif / Monochrome) */}
              <h2 className="text-2xl md:text-4xl font-sans font-bold leading-none tracking-tighter relative z-10">
                <span className="text-white">COMPLEX PROBLEMS.</span>
                <br />
                <span className="text-white block pt-2">SIMPLE SOLUTIONS.</span>
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Scroll Down Mouse Indicator - appears after animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scene >= 8 ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 pointer-events-none"
      >
        {/* Mouse outline */}
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
          {/* Animated scroll dot */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-white/70"
          />
        </div>
        <motion.span
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white font-mono text-[9px] uppercase tracking-[0.3em]"
        >
          Scroll
        </motion.span>
      </motion.div>

      {/* Subtle Cinematic Grain Overlay */}
      <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedHero;

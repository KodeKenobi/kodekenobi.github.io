import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "./Shared";
import { useSound } from "../../hooks/useSound";

const Slide1: React.FC = () => {
  const { playBounce } = useSound();

  useEffect(() => {
    // Timing matches Slide1.tsx animation: duration 2.2s, delay 1.0s
    // Hits floor at [0.18, 0.45, 0.7, 1.0] times
    const hit1 = setTimeout(() => playBounce(1.0), 1000 + 396);
    const hit2 = setTimeout(() => playBounce(0.6), 1000 + 990);
    const hit3 = setTimeout(() => playBounce(0.35), 1000 + 1540);
    const hit4 = setTimeout(() => playBounce(0.2), 1000 + 2200);

    return () => {
      [hit1, hit2, hit3, hit4].forEach(clearTimeout);
    };
  }, [playBounce]);

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col items-start justify-center h-full">
      <h1 className="text-white text-[15vw] md:text-[10rem] font-black leading-[0.9] tracking-tighter">
        <SplitText text="THE" startDelay={0.3} charDelay={0.05} />
      </h1>
      <h1 className="text-white/20 text-[15vw] md:text-[10rem] font-black leading-[0.9] tracking-tighter">
        <SplitText text="ARCHITECT" startDelay={0.5} charDelay={0.04} />
        <motion.span
          initial={{ y: -150, opacity: 0 }}
          animate={{
            y: [null, 0, -50, 0, -20, 0, -6, 0],
            opacity: 1,
          }}
          transition={{
            y: {
              duration: 2.2,
              times: [0, 0.18, 0.32, 0.45, 0.58, 0.7, 0.82, 1],
              ease: [
                "easeIn",
                "easeOut",
                "easeIn",
                "easeOut",
                "easeIn",
                "easeOut",
                "easeIn",
              ],
              delay: 1.0,
            },
            opacity: { duration: 0.1, delay: 1.0 },
          }}
          style={{ display: "inline-block" }}
        >
          .
        </motion.span>
      </h1>

      <div className="mt-4 md:mt-8 flex items-center gap-4">
        <ClipReveal delay={1.4} duration={0.8}>
          <span className="text-zinc-500 font-mono text-xs tracking-[0.5em] uppercase">
            Creative Engineering
          </span>
        </ClipReveal>
        <motion.div
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: CINEMATIC_EASE, delay: 1.8 }}
          className="h-px w-48 accent-line-gold"
        />
      </div>
    </div>
  );
};

export default Slide1;

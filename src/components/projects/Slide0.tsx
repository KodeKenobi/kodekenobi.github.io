import React from "react";
import { motion } from "framer-motion";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "../about/Shared";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export const Slide0: React.FC<{ isMobile: boolean; direction: number }> = ({
  isMobile,
  direction,
}) => {
  return (
    <motion.div
      key="projects-slide-0"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
      className="absolute inset-0 w-full flex items-center max-w-7xl mx-auto px-8 pointer-events-none z-20 h-full"
    >
      <div className="relative z-10 w-full flex flex-col items-start md:items-end justify-center h-full">
        <div className="flex flex-col items-start leading-[0.85]">
          <h1 className="text-white text-[15vw] md:text-[10rem] font-black leading-[0.9] tracking-tighter">
            <SplitText text="MY" startDelay={0.1} charDelay={0.03} />
          </h1>
          <h1 className="text-white/40 text-[15vw] md:text-[10rem] font-black leading-[0.9] tracking-tighter">
            <SplitText text="PROJECTS" startDelay={0.2} charDelay={0.02} />
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
                  delay: 0.8,
                },
                opacity: { duration: 0.1, delay: 0.8 },
              }}
              style={{ display: "inline-block" }}
              className="text-white"
            >
              .
            </motion.span>
          </h1>

          <div className="mt-8 flex items-center gap-4">
            <motion.div
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: CINEMATIC_EASE, delay: 0.4 }}
              className="h-px w-32 md:w-48 bg-[#c9a84c]/50"
            />
            <ClipReveal delay={0.3} duration={0.5}>
              <span className="text-white/50 font-mono text-[10px] md:text-xs tracking-[0.5em] uppercase pl-4">
                Selected Works
              </span>
            </ClipReveal>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Slide0;

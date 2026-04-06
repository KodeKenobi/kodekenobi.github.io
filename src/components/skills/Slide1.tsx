import React from "react";
import { motion, useMotionValue } from "framer-motion";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "../about/Shared";
import { mobileSlideVariants } from "./Shared";

const desktopVariants = {
    // ... existing variants
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

export const Slide1: React.FC<{ isMobile: boolean; direction: number }> = ({ isMobile, direction }) => {


    if (isMobile) {
        // ... existing mobile JSX
        return (
            <motion.div
                key="mb-skills-0"
                custom={direction}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
                className="absolute inset-0 z-10 w-full px-8 flex flex-col items-start justify-center h-full"
            >
                <h1 className="text-white text-[18vw] font-inter font-black leading-[0.9] tracking-tighter">
                    <SplitText text="THE" startDelay={0.3} charDelay={0.05} />
                </h1>
                <h1 className="text-white/20 text-[18vw] font-inter font-black leading-[0.9] tracking-tighter">
                    <SplitText text="TOOLKIT" startDelay={0.5} charDelay={0.04} />
                    <motion.span
                        initial={{ y: -100, opacity: 0 }}
                        animate={{
                            y: [null, 0, -30, 0, -10, 0, -3, 0],
                            opacity: 1,
                        }}
                        transition={{
                            y: { duration: 2.2, times: [0, 0.18, 0.32, 0.45, 0.58, 0.70, 0.82, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"], delay: 1.0 },
                            opacity: { duration: 0.1, delay: 1.0 },
                        }}
                        style={{ display: "inline-block" }}
                        className="text-white"
                    >
                        .
                    </motion.span>
                </h1>

                <div className="mt-8 flex items-center gap-4">
                    <ClipReveal delay={1.4} duration={0.8}>
                        <span className="text-zinc-500 font-montserrat font-semibold text-[9px] tracking-[0.5em] uppercase w-[120px] block">
                            Skills & Expertise
                        </span>
                    </ClipReveal>
                    <motion.div
                        initial={{ scaleX: 0, transformOrigin: "left" }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.2, ease: CINEMATIC_EASE, delay: 1.8 }}
                        className="h-px w-32 accent-line-gold"
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="skills-slide-0"
            custom={direction}
            variants={desktopVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
            className="absolute inset-0 w-full flex items-center max-w-7xl mx-auto px-8 pointer-events-none h-full"
        >
            <motion.div
                key="skills-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
                className="relative z-10 w-full flex flex-col items-end justify-center h-full"
            >
                <div className="flex flex-col items-start leading-[0.85]">
                    <h1 className="text-white text-6xl md:text-[10rem] font-inter font-black leading-[0.9] tracking-tighter">
                        <SplitText text="THE" startDelay={0.1} charDelay={0.03} />
                    </h1>
                    <h1 className="text-white/40 text-6xl md:text-[10rem] font-inter font-black leading-[0.9] tracking-tighter">
                        <SplitText text="TOOLKIT" startDelay={0.2} charDelay={0.02} />
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
                            className="h-px w-48 bg-[#c9a84c]/50"
                        />
                        <ClipReveal delay={0.3} duration={0.5}>
                            <span className="text-white/50 font-montserrat font-semibold text-xs tracking-[0.5em] uppercase pl-4">
                                Skills & Expertise
                            </span>
                        </ClipReveal>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

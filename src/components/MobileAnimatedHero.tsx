import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DecryptText from "./Animations/DecryptText";
import { soundEngine } from "../lib/SoundEngine";

const CINEMATIC_EASE = [0.77, 0, 0.175, 1] as const;

export const MobileAnimatedHero: React.FC = () => {
    const [scene, setScene] = useState(1);
    const [isTapped, setIsTapped] = useState(false);

    // Scene Orchestration Timeline
    useEffect(() => {
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

        return () => {
            [s2Timer, s3Timer, s4Timer, s5Timer, s6Timer, s7Timer, s8Timer].forEach(clearTimeout);
        };
    }, []);

    // Reset tap state so it reappears when user returns home
    useEffect(() => {
        if (isTapped) {
            const timer = setTimeout(() => setIsTapped(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isTapped]);

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-white font-roboto">
            {/* 
        CINEMATIC WORLD (The Revealed Image)
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
                    <div className="absolute inset-0 bg-black/70" />
                </div>

                {/* Title Layer */}
                <motion.div
                    animate={
                        scene >= 6 ? { y: "-100vh", opacity: 0 } : // S6: EXIT UP on mobile instead of left
                            scene >= 4 ? { y: "-15vh" } :              // S4-S5: PRESERVED (moves up to make room for bottom sheet)
                                { y: 0 }
                    }
                    transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
                    className="relative z-20 px-6 w-full"
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "110%" }}
                            animate={scene >= 3 ? { y: 0 } : { y: "110%" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-white text-[11vw] font-inter font-black leading-[1] tracking-tighter"
                        >
                            <motion.span
                                animate={scene >= 3 ? { letterSpacing: "-0.05em" } : { letterSpacing: "0.05em" }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                                className="block"
                            >
                                NAVIGATING
                                <br />
                                COMPLEXITY
                            </motion.span>
                        </motion.h1>
                    </div>
                </motion.div>
            </motion.div>

            {/* 
        WHITE SLATE (Scene 4 & 5) - REDESIGNED AS BOTTOM SHEET
      */}
            <AnimatePresence>
                {scene >= 4 && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{
                            y: scene >= 6 ? "100%" : "55%" // slides up to cover bottom 45%
                        }}
                        transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
                        className="absolute inset-0 top-0 w-full bg-white z-[60] flex flex-col pt-8 px-8 rounded-t-3xl"
                    >
                        <div className="max-w-xs relative">
                            {/* Grab handle indicator wrapper */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/10 rounded-full" />

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={scene >= 5 ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-zinc-400 font-montserrat font-semibold text-[9px] uppercase tracking-[0.4em] mb-4 block">
                                    Core Architecture
                                </span>
                                <h2 className="text-black text-[7vw] font-montserrat font-light leading-tight">
                                    Built on Data.<br />
                                    Driven by Discipline.
                                </h2>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={scene >= 5 ? { width: 40 } : {}}
                                    transition={{ duration: 1.2, delay: 0.5 }}
                                    className="h-px bg-black/20 mt-8"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
        SCENE 7: CINEMATIC SHUTTERS
      */}
            <motion.div
                initial={{ height: "0vh" }}
                animate={scene >= 9 ? { height: "0vh" } : scene >= 7 ? { height: "9vh" } : { height: "0vh" }}
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
        SCENE 8: THE SIGNATURE 
        Centered first, then moves up for mobile stacking
      */}
            <AnimatePresence>
                {scene >= 8 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={
                            scene >= 9 ? { x: 0, y: "-15vh", scale: 0.9, opacity: 1 } : // S9: SLIDE UP slightly
                                { x: 0, y: 0, scale: 1, opacity: 1 }                        // S8: CENTER STAGE
                        }
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-4"
                    >
                        <div className="text-center relative w-full">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: scene >= 9 ? 0 : 60 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="absolute left-1/2 -top-20 -translate-x-1/2 w-px accent-line-gold"
                            />

                            <div className="flex flex-col items-center leading-none">
                                <h3 className="text-white text-[13vw] font-inter font-black tracking-[0.2em] drop-shadow-2xl">
                                    <DecryptText text="KODE" trigger={scene === 8} />
                                </h3>
                                <h3 className="text-white text-[13vw] font-inter font-black tracking-[0.2em] drop-shadow-2xl">
                                    <DecryptText text="KENOBI" trigger={scene === 8} />
                                </h3>
                            </div>

                            <div className="flex items-center justify-center gap-3 mt-6">
                                <div className="h-px w-6 accent-line-gold" />
                                <p className="text-zinc-400 font-montserrat font-medium text-[8px] sm:text-[9px] tracking-[0.3em] uppercase">
                                    Creative Engineering
                                </p>
                                <div className="h-px w-6 accent-line-gold" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
        SCENE 9: LOWER HERO CONTENT (The Insight)
        Appears below on Mobile in a stacked layout
      */}
            <AnimatePresence>
                {scene >= 9 && (
                    <motion.div
                        initial={{ opacity: 0, y: "15vh" }}
                        animate={{ opacity: 1, y: "20vh" }}
                        transition={{ duration: 1.2, ease: "easeInOut", delay: 1.5 }}
                        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-6"
                    >
                        <div className="relative p-6 w-full max-w-sm mt-4 border border-white/10 bg-black/40 backdrop-blur-sm rounded-lg">
                            <h2 className="text-lg sm:text-xl font-roboto font-bold leading-tight tracking-tighter relative z-10 text-center">
                                <span className="text-white">COMPLEX PROBLEMS.</span>
                                <br />
                                <span className="text-white/70 block mt-1">SIMPLE SOLUTIONS.</span>
                            </h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tap Down Mouse Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: scene >= 8 ? (isTapped ? 0 : 1) : 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[90] flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => {
                    if (isTapped) return;
                    setIsTapped(true);
                    if (navigator.vibrate) navigator.vibrate(50);
                    soundEngine.init();
                    soundEngine.playIgnition();
                    setTimeout(() => {
                        const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true });
                        document.dispatchEvent(event);
                    }, 400);
                }}
            >
                {isTapped && (
                    <motion.div
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full border border-white/50 pointer-events-none"
                    />
                )}
                
                <motion.div 
                    whileTap={{ scale: 0.85, y: 5 }}
                    className="relative flex flex-col items-center z-10"
                >
                    {/* The pointing hand is removed */}

                    <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center pt-1.5 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-1 rounded-full bg-white/70"
                        />
                    </div>
                </motion.div>
                
                <motion.span
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white font-montserrat font-medium text-[8px] uppercase tracking-[0.2em]"
                >
                    Tap
                </motion.span>
            </motion.div>

            {/* Grain */}
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

export default MobileAnimatedHero;

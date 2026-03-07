import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect } from "react";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "./about/Shared";
import { experienceData, mobileSlideVariants } from "./skills/Shared";

const desktopVariants = {
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

export const Experience: React.FC<{ isMobile: boolean; slideIndex: number; direction: number; progress: number }> = ({
    isMobile,
    slideIndex = 0,
    direction = 1,
    progress = 0 // 0 to 100
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const progressMotion = useMotionValue(progress);
    useEffect(() => {
        progressMotion.set(progress);
    }, [progress, progressMotion]);

    // Cards are ~700px tall each (dense bullet points in a 45%-width column).
    // Card 5 sits at ~3664px into the track. At P=100, yOffset = -(4250-600) = -3650,
    // placing card 5's top at ~190px from viewport — fully visible.
    const totalHeight = experienceData.length * 850;
    const yOffset = useSpring(useTransform(progressMotion, [0, 100], [0, -totalHeight + 600]), {
        stiffness: 100,
        damping: 30
    });
    const goldLineHeight = useTransform(progressMotion, [0, 100], [0, totalHeight]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const stopProp = (e: TouchEvent) => e.stopPropagation();
        el.addEventListener('touchstart', stopProp, { passive: true });
        el.addEventListener('touchmove', stopProp, { passive: true });
        el.addEventListener('touchend', stopProp, { passive: true });

        return () => {
            el.removeEventListener('touchstart', stopProp);
            el.removeEventListener('touchmove', stopProp);
            el.removeEventListener('touchend', stopProp);
        };
    }, []);

    if (isMobile) {
        return (
            <motion.div
                ref={scrollRef}
                key="mb-experience"
                custom={direction}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 bg-black flex flex-col pt-24 px-8 overflow-y-auto"
            >
                <div className="space-y-12 pb-12">
                    {experienceData.map((exp, i) => (
                        <div key={i} className="relative pl-8 border-l border-[#c9a84c]/30">
                            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#c9a84c]" />
                            <span className="text-[#c9a84c] font-mono text-[10px] block mb-2">{exp.period}</span>
                            <h3 className="text-white font-black text-xl mb-1">{exp.company}</h3>
                            <p className="text-[#c9a84c] font-bold text-sm mb-4">{exp.role}</p>
                            <p className="text-white/60 text-xs leading-relaxed whitespace-pre-line">{exp.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }


    return (
        <div className="absolute inset-0 w-full h-full bg-[#030303] overflow-hidden flex flex-col items-center">

            <AnimatePresence initial={false} custom={direction}>
                {slideIndex === 0 && (
                    <motion.div
                        key="experience-slide-0"
                        custom={direction}
                        variants={desktopVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
                        className="absolute inset-0 w-full flex items-center max-w-7xl mx-auto px-8 pointer-events-none z-20"
                    >
                        <motion.div
                            key="experience-header"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
                            className="relative z-10 w-full flex flex-col items-start justify-center h-full"
                        >
                            <div className="flex flex-col items-start">
                                <h1 className="text-white text-6xl md:text-[10rem] font-black leading-[0.9] tracking-tighter">
                                    <SplitText text="THE" startDelay={0.1} charDelay={0.03} />
                                </h1>
                                <h1 className="text-white/40 text-6xl md:text-[10rem] font-black leading-[0.9] tracking-tighter">
                                    <SplitText text="JOURNEY" startDelay={0.2} charDelay={0.02} />
                                    <motion.span
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                        style={{ display: "inline-block" }}
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
                                        <span className="text-white/50 font-mono text-xs tracking-[0.5em] uppercase pl-4">
                                            Professional Experience
                                        </span>
                                    </ClipReveal>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {slideIndex === 1 && (
                    <motion.div
                        key="experience-slide-1"
                        variants={desktopVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 1, ease: CINEMATIC_EASE }}
                        className="absolute inset-0 w-full h-full bg-[#030303] overflow-hidden flex flex-col items-center pt-32 z-10"
                        ref={containerRef}
                    >
                        {/* BACKGROUND TEXT DECORATION */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none z-0">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-white whitespace-nowrap">
                                JOURNEY
                            </div>
                        </div>

                        <div className="relative w-full max-w-4xl h-full z-10 flex flex-col pt-12">
                            {/* Heading section removed */}

                            {/* TIMELINE CONTAINER */}
                            <div className="relative w-full flex-grow">
                                {/* CONTINUITY LINE */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-white/5 -translate-x-1/2" />

                                {/* SCROLLABLE TRACK — gold line lives here so it shares the same coordinate space as the dots */}
                                <motion.div
                                    style={{ y: yOffset }}
                                    className="space-y-48 py-24 pb-[700px] relative"
                                >
                                    {/* PROGRESSIVE GOLDEN LINE */}
                                    <motion.div
                                        className="absolute left-1/2 top-0 w-[1.5px] bg-[#c9a84c] -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(201,168,76,0.5)]"
                                        style={{ height: goldLineHeight }}
                                    />
                                    {experienceData.map((exp, i) => (
                                        <TimelineCard key={i} exp={exp} index={i} progress={progress} totalCards={experienceData.length} />
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TimelineCard = ({ exp, index, progress, totalCards }: { exp: any, index: number, progress: number, totalCards: number }) => {
    const isEven = index % 2 === 0;
    // Line reaches this dot when progress >= this card's threshold
    const activationThreshold = (index / totalCards) * 100;
    const isLineHere = progress >= activationThreshold;

    return (
        <div className="flex items-center w-full">
            {/* LEFT COLUMN — 45% */}
            <div className="w-[45%]">
                {isEven && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                        className="flex flex-col items-start text-left pr-12 group"
                    >
                        <span className="text-[#c9a84c] font-mono text-[10px] tracking-[0.3em] mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{exp.period}</span>
                        <h3 className="text-white text-3xl font-black tracking-tighter mb-1 group-hover:text-[#c9a84c] transition-colors">{exp.company}</h3>
                        <div className="text-white/40 font-mono text-[11px] mb-6 tracking-widest uppercase">{exp.role}</div>
                        <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm group-hover:border-[#c9a84c]/20 transition-colors">
                            <p className="text-white/60 text-xs leading-relaxed font-light whitespace-pre-line">{exp.desc}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* CENTER COLUMN — 10% — dot lives here, naturally centered */}
            <div className="w-[10%] flex items-center justify-center">
                <motion.div
                    animate={isLineHere
                        ? { scale: 1.5, backgroundColor: "#fff", boxShadow: "0 0 25px rgba(201,168,76,1), 0 0 50px rgba(201,168,76,0.4)" }
                        : { scale: 1, backgroundColor: "#c9a84c", boxShadow: "0 0 8px rgba(201,168,76,0.4)" }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-4 h-4 rounded-full bg-[#c9a84c] border-[4px] border-black z-20"
                />
            </div>

            {/* RIGHT COLUMN — 45% */}
            <div className="w-[45%]">
                {!isEven && (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                        className="flex flex-col items-start text-left pl-12 group"
                    >
                        <span className="text-[#c9a84c] font-mono text-[10px] tracking-[0.3em] mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{exp.period}</span>
                        <h3 className="text-white text-3xl font-black tracking-tighter mb-1 group-hover:text-[#c9a84c] transition-colors">{exp.company}</h3>
                        <div className="text-white/40 font-mono text-[11px] mb-6 tracking-widest uppercase">{exp.role}</div>
                        <div className="p-6 border border-white/5 bg-white/[0.01] rounded-sm group-hover:border-[#c9a84c]/20 transition-colors">
                            <p className="text-white/60 text-xs leading-relaxed font-light whitespace-pre-line">{exp.desc}</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Experience;

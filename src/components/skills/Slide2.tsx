import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect } from "react";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "../about/Shared";
import { skillCategories, mobileSlideVariants } from "./Shared";

const desktopVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

export const Slide2: React.FC<{
    isMobile: boolean;
    direction: number;
    activeCategory: number | null;
    handleRowClick: (index: number) => void;
}> = ({ isMobile, direction, activeCategory, handleRowClick }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !isMobile) return;

        const handleTouch = (e: TouchEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const deltaY = e.type === 'touchmove' ? 0 : 0; // Simplified

            // If we are scrolling inside, stop propagation to prevent App.tsx from switching slides
            // Only allow propagation if we are at the top and swiping down, or at bottom and swiping up
            // To keep it simple and robust, we stop it if we're not at a boundary or if we just want native feel
            e.stopPropagation();
        };

        el.addEventListener('touchstart', handleTouch, { passive: true });
        el.addEventListener('touchmove', handleTouch, { passive: true });
        el.addEventListener('touchend', handleTouch, { passive: true });

        return () => {
            el.removeEventListener('touchstart', handleTouch);
            el.removeEventListener('touchmove', handleTouch);
            el.removeEventListener('touchend', handleTouch);
        };
    }, [isMobile]);

    if (isMobile) {
        return (
            <motion.div
                ref={scrollRef}
                key="mb-skills-1"
                custom={direction}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
                className="absolute inset-0 w-full h-full overflow-y-auto"
            >
                <div className="px-5 pt-20 pb-12 space-y-4">
                    {skillCategories.map((category, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            key={category.title}
                            className="border border-white/5 p-5 bg-white/[0.02] flex flex-col"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                                <h3 className="text-white text-xl font-black tracking-widest uppercase">{category.title}</h3>
                                <span className="text-white/30 font-mono text-xs tracking-widest">{category.index}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-white/5 text-white/80 font-mono text-xs uppercase tracking-widest rounded border border-white/10">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="skills-slide-1"
            custom={direction}
            variants={desktopVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
            className="absolute inset-0 w-full max-w-[1400px] mx-auto px-12 flex flex-col justify-center overflow-hidden"
        >
            <div className="space-y-0 relative">
                {skillCategories.map((category, i) => (
                    <div className="group relative cursor-pointer" key={category.title} onClick={(e) => { e.stopPropagation(); handleRowClick(i); }}>
                        <div className="grid grid-cols-12 items-center py-7 gap-4 relative overflow-hidden">
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                whileHover={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                                className="absolute top-1/2 left-0 right-0 h-px bg-[#c9a84c]/20 origin-left"
                            />
                            <div className="col-span-2 md:col-span-1">
                                <ClipReveal delay={0.1 + i * 0.05} duration={0.6}>
                                    <span className="text-white/30 font-mono text-xs tracking-widest group-hover:text-[#c9a84c] transition-colors duration-500">
                                        {category.index}
                                    </span>
                                </ClipReveal>
                            </div>
                            <div className="col-span-10 md:col-span-4 flex items-center gap-6">
                                <h3 className="text-white text-3xl md:text-4xl font-black tracking-[0.1em] group-hover:tracking-[0.15em] transition-all duration-700 uppercase whitespace-nowrap">
                                    <SplitText text={category.title} startDelay={0.1 + i * 0.05} charDelay={0.008} />
                                </h3>
                                <div className="h-[2px] bg-[#c9a84c] w-0 opacity-0 group-hover:w-24 group-hover:opacity-100 transition-all duration-700 hidden md:block" />
                            </div>
                            <div className="hidden md:col-span-1" />
                            <div className="col-span-12 md:col-span-6 flex items-center pl-8 md:pl-0 mt-2 md:mt-0 relative group/skills">
                                <div className="flex flex-wrap items-center gap-x-2">
                                    {category.skills.map((skill, j) => (
                                        <React.Fragment key={skill}>
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.3 + i * 0.05 + j * 0.02, ease: CINEMATIC_EASE }}
                                                className="text-white/30 font-mono text-xs md:text-base group-hover:text-white/80 transition-all duration-500 py-1 hover:text-[#c9a84c]"
                                            >
                                                {skill}
                                            </motion.span>
                                            {j < category.skills.length - 1 && <span className="text-white/5 font-mono text-[10px] mx-1">/</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: i * 0.1 }} className="h-px w-full bg-white/5 origin-left" />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

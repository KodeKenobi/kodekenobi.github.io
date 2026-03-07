import React from "react";
import { motion } from "framer-motion";
import { CINEMATIC_EASE } from "../about/Shared";
import { mobileSlideVariants } from "./Shared";

const desktopVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

export const Slide5: React.FC<{ isMobile: boolean; direction: number }> = ({ isMobile, direction }) => {
    if (isMobile) {
        return (
            <motion.div
                key="mb-skills-4"
                custom={direction}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
                className="absolute inset-0 px-6 flex flex-col justify-center items-center h-full w-full"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="border border-white/5 p-6 bg-white/[0.02] w-full max-w-sm flex flex-col items-center text-center"
                >
                    <h4 className="text-white text-2xl font-black tracking-tighter mb-6">AUTOMATED_ENV</h4>

                    <div className="flex justify-center gap-2 mb-6 w-full">
                        <div className="px-3 py-1.5 bg-white/10 text-[8px] font-mono text-white/80 rounded border border-white/10">STAGING</div>
                        <div className="px-3 py-1.5 bg-[#c9a84c]/20 text-[8px] font-mono text-[#c9a84c] rounded border border-[#c9a84c]/30">PROD</div>
                    </div>

                    <div className="border border-white/10 p-4 bg-black/50 w-full flex flex-col items-center">
                        <span className="text-white/40 font-mono text-[8px] tracking-widest block mb-1">QA_COVERAGE</span>
                        <div className="flex justify-center items-end gap-2 mt-2">
                            <span className="text-white text-lg font-black">ROBUST_SUITES</span>
                            <span className="text-emerald-500/80 font-mono text-base tracking-tighter">98.4%</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="skills-slide-4"
            custom={direction}
            variants={desktopVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
            className="absolute inset-0 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center h-full overflow-hidden"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-1/2">
                <div className="relative border border-white/5 p-10 flex flex-col justify-between group overflow-hidden bg-white/[0.01]">
                    <div className="z-10">
                        <h4 className="text-white text-5xl font-black tracking-tighter mb-4">AUTOMATED_ENV</h4>
                        <p className="text-white/60 font-mono text-[11px] uppercase tracking-widest leading-relaxed max-w-sm">
                            Containerized development environments with automated orchestration for seamless deployment pipelines.
                        </p>
                    </div>
                    <div className="flex gap-4 z-10">
                        <div className="px-3 py-1 bg-white/10 text-[10px] font-mono text-white/80 rounded border border-white/10">STAGING</div>
                        <div className="px-3 py-1 bg-[#c9a84c]/20 text-[10px] font-mono text-[#c9a84c] rounded border border-[#c9a84c]/30">PRODUCTION</div>
                    </div>
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                        className="absolute -right-20 -bottom-20 w-64 h-64 bg-radial-gradient from-white/10 to-transparent blur-3xl rounded-full"
                    />
                </div>

                <div className="grid grid-rows-2 gap-8">
                    <div className="border border-white/5 p-8 flex flex-col justify-center bg-[#0a0a0a]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                            <span className="text-white/70 font-mono text-xl tracking-widest">ZERO_DOWNTIME</span>
                        </div>
                    </div>

                    <div className="border border-white/5 p-8 flex flex-col justify-center relative overflow-hidden group hover:bg-white/[0.02] transition-colors duration-500">
                        <div className="flex items-end gap-3 relative z-10">
                            <span className="text-white text-4xl font-black tracking-tighter">ROBUST_SUITES</span>
                            <span className="text-emerald-500/80 font-mono text-2xl tracking-tighter mb-1">98.4%</span>
                        </div>
                        <motion.div
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.6, ease: CINEMATIC_EASE }}
                            className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#c9a84c]/50 to-emerald-500/50"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

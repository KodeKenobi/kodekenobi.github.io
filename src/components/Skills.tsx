import React, { useState } from "react";
import { DynamicPagination } from "./about/Shared";
import { AnimatePresence } from "framer-motion";
import { Slide1 } from "./skills/Slide1";
import { Slide2 } from "./skills/Slide2";
import { skillCategories } from "./skills/Shared";

// ─── SKILLS PREVIEW COMPONENTS ───
const ToolkitPreview: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center p-12 overflow-hidden">
        <div className="text-left">
            <h1 className="text-white text-[120px] font-inter font-black leading-[0.85] tracking-tighter opacity-90">THE</h1>
            <h1 className="text-white/40 text-[120px] font-inter font-black leading-[0.85] tracking-tighter opacity-90">TOOLKIT</h1>
        </div>
    </div>
);

const ExpertisePreview: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col justify-center p-12 gap-8 overflow-hidden">
        {skillCategories.slice(0, 4).map((cat) => (
            <div key={cat.title} className="flex items-center gap-8 border-b border-white/5 pb-4">
                <span className="text-white/30 font-montserrat text-2xl tracking-widest">{cat.index}</span>
                <span className="text-white/60 font-montserrat text-3xl font-black tracking-widest uppercase">{cat.title}</span>
            </div>
        ))}
    </div>
);

const ProcessPreview: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden">
        <div className="grid grid-cols-2 gap-4 w-full">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="border border-white/5 p-4 flex flex-col gap-2">
                    <div className="w-8 h-1 bg-[#c9a84c]/30" />
                    <div className="h-2 w-12 bg-white/10" />
                </div>
            ))}
        </div>
    </div>
);

const PhilosophyPreview: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden">
        <div className="flex flex-col gap-3 w-full">
            <div className="h-6 w-3/4 bg-white/5" />
            <div className="h-6 w-full bg-[#c9a84c]/10" />
            <div className="h-6 w-1/2 bg-white/5" />
        </div>
    </div>
);

const ImpactPreview: React.FC = () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden">
        <div className="grid grid-cols-3 gap-2 w-full">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full border border-[#c9a84c]/20" />
                    <div className="h-2 w-full bg-white/10" />
                </div>
            ))}
        </div>
    </div>
);

const skillPreviews = [ToolkitPreview];

import { motion } from "framer-motion";

const CodePreview: React.FC<{
    code: string;
    active: boolean;
    isMobile?: boolean;
    onClose: () => void;
    onInteractionChange: (interacting: boolean) => void;
}> = ({ code, active, isMobile, onClose, onInteractionChange }) => {
    const [copied, setCopied] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {active && (
                <>
                    {/* Independent Backdrop Layer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100000] backdrop-blur-md bg-black/60 pointer-events-auto cursor-pointer"
                    />

                    {/* Content Layer - Centered over backdrop */}
                    <div
                        className="fixed inset-0 z-[100001] flex items-center justify-center p-4 md:p-12 pointer-events-auto cursor-pointer"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                            animate={{
                                opacity: 1,
                                scale: isMaximized ? 1.05 : 1,
                                y: 0,
                                filter: "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                                filter: "blur(10px)",
                                transition: { duration: 0.15 }
                            }}
                            transition={{
                                duration: 0.4,
                                ease: [0.23, 1, 0.32, 1],
                                opacity: { duration: 0.2 }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative pointer-events-auto w-full max-w-[800px] shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
                            style={{
                                width: isMobile ? "90vw" : (isMaximized ? "800px" : "650px"),
                                height: 'auto',
                                maxWidth: '90vw'
                            }}
                        >
                            <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
                                {/* Terminal Header */}
                                <div className="bg-white/5 px-5 py-3 flex items-center justify-between border-b border-white/5 select-none">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                                            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-all flex items-center justify-center group/btn relative cursor-pointer shadow-[0_0_10px_rgba(255,95,86,0.5)] animate-pulse"
                                        >
                                            <svg className="w-2 h-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-montserrat font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">CLOSE</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                                            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-all flex items-center justify-center group/btn relative cursor-pointer shadow-[0_0_10px_rgba(255,189,46,0.5)]"
                                        >
                                            <svg className="w-2 h-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                                                <path d="M20 12H4" />
                                            </svg>
                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-montserrat font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">MINIMIZE</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                                            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-all flex items-center justify-center group/btn relative cursor-pointer shadow-[0_0_10px_rgba(39,201,63,0.5)]"
                                        >
                                            <svg className="w-2 h-2 opacity-0 group-hover/btn:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                                                <path d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 font-montserrat font-medium opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">MAXIMIZE</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-montserrat font-semibold text-white/60 tracking-[0.3em] uppercase">Architecture_Preview</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); isMobile ? onClose() : copyToClipboard(); }}
                                            className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1 rounded-md text-[10px] font-montserrat font-medium transition-all border border-white/5 flex items-center gap-2 group/copy cursor-pointer"
                                        >
                                            {isMobile ? (
                                                "X"
                                            ) : copied ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    COPIED
                                                </>
                                            ) : (
                                                "COPY"
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Code Body */}
                                <motion.div
                                    initial={false}
                                    animate={{ height: isMinimized ? 0 : "auto", opacity: isMinimized ? 0 : 1 }}
                                    className="overflow-hidden bg-[#050505]/50"
                                >
                                    <div className={`${isMobile ? "p-4" : "p-8"} font-roboto ${isMobile ? "text-[10px]" : "text-[12px]"} leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar`}>
                                        <pre className="text-white/80">
                                            <code>
                                                {code.split('\n').map((line, i) => (
                                                    <div key={i} className={`flex ${isMobile ? "gap-3" : "gap-6"} group/line hover:bg-white/5 transition-colors -mx-4 px-4 py-0.5`}>
                                                        <span className="text-white/30 w-4 inline-block text-right select-none">{i + 1}</span>
                                                        <span className="text-white/70 whitespace-pre">
                                                            {line.split(/([ \t,.<>{}[\]()=;:"'])/).map((part, k) => {
                                                                if (['const', 'return', 'await', 'async', 'import', 'export', 'FROM', 'WORKDIR', 'RUN', 'COPY', 'EXPOSE', 'CMD', 'git', 'private', 'readonly', 'constructor', 'public', 'class'].includes(part.trim())) {
                                                                    return <span key={k} className="text-[#c9a84c] font-bold">{part}</span>;
                                                                }
                                                                if (['db', 'router', 'res', 'req', 'next', 'event', 'console', 'APIGatewayProxyHandler'].includes(part.trim())) {
                                                                    return <span key={k} className="text-[#8b5cf6]">{part}</span>;
                                                                }
                                                                if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
                                                                    return <span key={k} className="text-emerald-400 opacity-90">{part}</span>;
                                                                }
                                                                if (!isNaN(parseInt(part.trim())) && part.trim() !== '') {
                                                                    return <span key={k} className="text-amber-500 opacity-90">{part}</span>;
                                                                }
                                                                if (part.trim().startsWith('//') || part.trim().startsWith('#')) {
                                                                    return <span key={k} className="text-white/40 italic">{part}</span>;
                                                                }
                                                                return part;
                                                            })}
                                                        </span >
                                                    </div >
                                                ))}
                                            </code >
                                        </pre >
                                    </div >
                                </motion.div >
                            </div >

                            {/* Subtle Glow Effect */}
                            < div className={`absolute inset-0 -z-10 bg-[#c9a84c]/5 blur-[80px] rounded-full scale-150 transition-opacity duration-500 ${isMinimized ? "opacity-0" : "opacity-100"}`} />
                        </motion.div >
                    </div >
                </>
            )}
        </AnimatePresence >
    );
};

export const Skills: React.FC<{
    slideIndex?: number;
    direction?: number;
    onSlideChange?: (index: number, direction: number) => void;
    onInteractionChange?: (interacting: boolean) => void;
    isActive?: boolean;
    isMobile?: boolean;
}> = ({ slideIndex = 0, direction = 1, onSlideChange, onInteractionChange, isActive = true, isMobile = false }) => {

    // Manage state for CodePreview terminal interaction on Slide 2
    const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

    const handleRowClick = (index: number) => {
        if (activeCategory === index) {
            setActiveCategory(null);
            if (onInteractionChange) onInteractionChange(false);
        } else {
            setActiveCategory(index);
            if (onInteractionChange) onInteractionChange(true);
        }
    };

    const handleInteraction = (interacting: boolean) => {
        if (onInteractionChange) onInteractionChange(interacting);
    };

    const slideLabels = ["Toolkit", "Expertise"];
    return (
        <div
            className="relative w-full h-full font-roboto overflow-hidden"
            onClick={() => {
                setActiveCategory(null);
                if (onInteractionChange) onInteractionChange(false);
            }}
        >
            <AnimatePresence initial={false} custom={direction}>
                {isActive && slideIndex === 0 && <Slide1 key="slide0" isMobile={isMobile} direction={direction} />}
                {isActive && slideIndex === 1 && <Slide2 key="slide1" isMobile={isMobile} direction={direction} handleRowClick={handleRowClick} />}
            </AnimatePresence>

            {/* Desktop interaction only: */}
            <CodePreview
                code={activeCategory !== null ? skillCategories[activeCategory].code || "" : ""}
                active={activeCategory !== null}
                isMobile={isMobile}
                onClose={() => {
                    setActiveCategory(null);
                    if (onInteractionChange) onInteractionChange(false);
                }}
                onInteractionChange={handleInteraction}
            />

            {/* Bottom Dynamic Navigation */}
            <DynamicPagination
                activeIndex={slideIndex}
                totalSlides={2}
                labels={slideLabels}
                onSlideChange={onSlideChange!}
                isActive={isActive}
                slides={skillPreviews.slice(0, 2)}
            />

            {/* Cinematic Grain */}
            <div className="absolute inset-0 z-[100] pointer-events-none opacity-[0.015] mix-blend-overlay">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseSkillsNew">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseSkillsNew)" />
                </svg>
            </div>
        </div >
    );
};

export default Skills;

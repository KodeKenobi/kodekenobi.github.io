import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── DYNAMIC PAGINATION (WITH THE DOG) ───
interface DynamicPaginationProps {
    activeIndex: number;
    totalSlides: number;
    labels: string[];
    onSlideChange: (index: number, direction: number) => void;
    isActive: boolean;
    slides?: React.ComponentType[]; // Pass the slide components for previews
}

export const DynamicPagination: React.FC<DynamicPaginationProps> = ({
    activeIndex,
    totalSlides,
    labels,
    onSlideChange,
    isActive,
    slides
}) => {
    const [userInteracted, setUserInteracted] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [flashIndex, setFlashIndex] = React.useState<number | null>(null);

    // Flash preview on slide change
    React.useEffect(() => {
        setFlashIndex(activeIndex);
        const timer = setTimeout(() => setFlashIndex(null), 800);
        return () => clearTimeout(timer);
    }, [activeIndex]);

    // Dynamic scale for the dog's trot range
    const dogRange = totalSlides * 20;

    return (
        <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4"
            onMouseEnter={() => setUserInteracted(true)}
            onClick={() => setUserInteracted(true)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onSlideChange(i, i > activeIndex ? 1 : -1)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    className="group relative flex flex-col items-center cursor-pointer py-2 outline-none"
                >
                    {/* Visual Thumbnail Preview */}
                    {slides && slides[i] && (
                        <div
                            className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-[180px] h-[100px] rounded-md overflow-hidden transition-all duration-500 pointer-events-none shadow-2xl shadow-black ${hoveredIndex === i || flashIndex === i ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
                        >
                            {/* Inner Overlay (Subtle Darkening) */}
                            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-500 ${hoveredIndex === i || flashIndex === i ? 'opacity-100' : 'opacity-0'}`} />
                            <div
                                className="w-[1080px] h-[600px] origin-top-left"
                                style={{ transform: "scale(0.1667)" }}
                            >
                                {React.createElement(slides[i])}
                            </div>
                        </div>
                    )}

                    {/* Label */}
                    <span
                        className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono tracking-[0.3em] uppercase transition-all duration-300 pointer-events-none ${activeIndex === i ? 'text-white/0' : 'text-white/0 group-hover:text-white/40'}`}
                    >
                        {labels[i] || `Step ${i + 1}`}
                    </span>
                    {/* Bar */}
                    <div
                        className={`h-[3px] rounded-full transition-all duration-500 ${i === activeIndex
                            ? "w-10 bg-[#c9a84c]"
                            : "w-5 bg-white/15 group-hover:w-8 group-hover:bg-white/40"
                            }`}
                    />
                </button>
            ))}

            {/* Floating Puppy Hint (Line-art, very small, sniffing underneath) */}
            <AnimatePresence>
                {isActive && !userInteracted && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute -bottom-3 left-1/2 z-30 pointer-events-none"
                    >
                        <motion.div
                            animate={{
                                x: [-dogRange, -dogRange, -0.6 * dogRange, -0.6 * dogRange, 0.2 * dogRange, 0.2 * dogRange, dogRange, dogRange, dogRange, 0.6 * dogRange, 0.6 * dogRange, -0.2 * dogRange, -0.2 * dogRange, -dogRange, -dogRange, -dogRange],
                                y: [2, 2, -1, -1, 1, 1, 2, 2, 2, -1, -1, 1, 1, 2, 2, 2],
                                rotateY: [0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180, 180, 180, 180, 0, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                times: [0, 0.05, 0.12, 0.17, 0.30, 0.35, 0.47, 0.50, 0.53, 0.60, 0.65, 0.78, 0.83, 0.95, 0.98, 1.0],
                                ease: "easeInOut"
                            }}
                            className="opacity-70"
                            style={{ transformOrigin: "center" }}
                        >
                            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Wagging Tail */}
                                <motion.path
                                    d="M4 8 Q2 5 1 3"
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    animate={{ rotate: [-20, 20, -20] }}
                                    transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                                    style={{ originX: "4px", originY: "8px" }}
                                />
                                {/* Trot Back Leg */}
                                <motion.line
                                    x1="6" y1="10" x2="6" y2="15"
                                    stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                                />
                                {/* Trot Front Leg */}
                                <motion.line
                                    x1="12" y1="10" x2="12" y2="15"
                                    stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: 0.25, ease: "easeInOut" }}
                                />
                                {/* Puppy Body */}
                                <rect x="4" y="6" width="10" height="5" rx="2.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />

                                {/* Sniffing Head */}
                                <motion.g
                                    animate={{ rotate: [0, 25, 0, 15, 0], y: [0, 3, 0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    style={{ originX: "14px", originY: "8px" }}
                                >
                                    {/* Head Base */}
                                    <rect x="12" y="3" width="7" height="6" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
                                    {/* Snout */}
                                    <rect x="17" y="5" width="4" height="3" rx="1.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
                                    {/* Nose (Gold) */}
                                    <circle cx="21" cy="6.5" r="0.75" fill="#c9a84c" />
                                    {/* Floppy Ear */}
                                    <path d="M13 3.5 Q12 7 14 8 Q15 6 15 3.5 Z" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
                                </motion.g>
                            </svg>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

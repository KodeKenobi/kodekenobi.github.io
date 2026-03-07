import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CINEMATIC_EASE = [0.16, 1, 0.3, 1] as const;

// Per-character animation with blur resolve
export const SplitText: React.FC<{
    text: string;
    className?: string;
    charDelay?: number;
    startDelay?: number;
}> = ({ text, className = "", charDelay = 0.03, startDelay = 0 }) => {
    return (
        <span className={className} aria-label={text}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 30, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.9,
                        ease: CINEMATIC_EASE,
                        delay: startDelay + i * charDelay,
                    }}
                    style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
};

// Clip-path reveal
export const ClipReveal: React.FC<{
    children: React.ReactNode;
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 1.2 }) => {
    return (
        <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration, ease: CINEMATIC_EASE, delay }}
        >
            {children}
        </motion.div>
    );
};

export const StationaryText: React.FC<{
    text: string;
    className?: string;
    wordDelay?: number;
    startDelay?: number;
}> = ({ text, className = "", wordDelay = 0.05, startDelay = 0 }) => {
    return (
        <span className={className} aria-label={text}>
            {text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1.2,
                        ease: CINEMATIC_EASE,
                        delay: startDelay + i * wordDelay,
                    }}
                    style={{ display: "inline-block", marginRight: "0.25em", willChange: "opacity, transform" }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
};

export * from "./PaginationDog";

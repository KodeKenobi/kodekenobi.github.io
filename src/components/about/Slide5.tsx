import React from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring, AnimatePresence } from "framer-motion";
import { CINEMATIC_EASE } from "./Shared";

const CODE_SNIPPET = `import { createSystem } from "@core/engine";
import { establishConnection } from "@core/net";

async function initializeSequence() {
    const engine = createSystem({
        mode: "production",
        encryption: "aes-256-gcm",
        threads: navigator.hardwareConcurrency || 4
    });

    await engine.boot();

    engine.on("ready", async () => {
        console.log("[SYSTEM] Core engine online.");

        const uplink = await establishConnection({
            protocols: ["wss", "webrtc"],
            secure: true
        });

        if (uplink.status === "CONNECTED") {
            console.log("[SYSTEM] Uplink established. Awaiting commands...");
            engine.bypassSecurity();
        }
    });
}

initializeSequence().catch(console.error);`;

const HighlightedCode: React.FC<{ code: string }> = ({ code }) => {
    return (
        <code className="block">
            {code.split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre">
                    {line.split(/([ \t,.<>{}[\]()=;:"'])/).map((part, k) => {
                        const trimmed = part.trim();
                        // Keywords
                        if (['const', 'return', 'await', 'async', 'import', 'from', 'class', 'interface', 'function', 'if', 'else'].includes(trimmed)) {
                            return <span key={k} className="text-[#569cd6]">{part}</span>;
                        }
                        // Types / Classes
                        if (['React', 'FC', 'Props', 'NodeJS', 'Timeout', 'MotionValue'].includes(trimmed)) {
                            return <span key={k} className="text-[#4ec9b0]">{part}</span>;
                        }
                        // Strings
                        if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
                            return <span key={k} className="text-[#ce9178]">{part}</span>;
                        }
                        // Comments
                        if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
                            return <span key={k} className="text-[#6a9955] opacity-80">{part}</span>;
                        }
                        // Functions
                        if (trimmed.endsWith('(') || (k > 0 && line.split(/([ \t,.<>{}[\]()=;:"'])/)[k - 2]?.trim() === 'ƒ')) {
                            return <span key={k} className="text-[#dcdcaa]">{part}</span>;
                        }
                        return <span key={k}>{part}</span>;
                    })}
                </div>
            ))}
        </code>
    );
};

const Slide5: React.FC<{ onActionTriggered?: (triggered: boolean) => void }> = ({ onActionTriggered }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const opacity = useMotionValue(0);
    const isOverSocial = React.useRef(false);

    // Web-focused high-stiffness springs
    const maskRadiusX = useSpring(130, { stiffness: 50, damping: 25 });
    const maskRadiusY = useSpring(130, { stiffness: 50, damping: 25 });
    const codeLayerOpacity = useSpring(0, { stiffness: 30, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isOverSocial.current) return;
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
        opacity.set(1);
    };

    const handleMouseLeave = () => {
        opacity.set(0);
    };

    const [isActionTriggered, setIsActionTriggered] = React.useState(false);
    const hoverTimer = React.useRef<NodeJS.Timeout | null>(null);

    const handleInitiateHoverEnter = () => {
        if (window.innerWidth < 768) return; // Ignore hover on mobile
        hoverTimer.current = setTimeout(() => {
            triggerReveal();
        }, 1500); // Faster reveal on hover
    };

    const handleInitiateHoverLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        // Only reset if we HAVEN'T successfully triggered the full reveal yet
        if (!isActionTriggered) {
            setIsActionTriggered(false);
            onActionTriggered?.(false);
            maskRadiusX.set(130);
            maskRadiusY.set(130);
            codeLayerOpacity.set(0);
        }
    };

    const handleSocialEnter = () => {
        isOverSocial.current = true;
        opacity.set(0);
    };

    const handleSocialLeave = () => {
        isOverSocial.current = false;
    };
    const resetReveal = () => {
        setIsActionTriggered(false);
        onActionTriggered?.(false);
        maskRadiusX.set(130);
        maskRadiusY.set(130);
        codeLayerOpacity.set(0);
        opacity.set(0); // Ensure the flashlight is hidden too
    };

    const triggerReveal = () => {
        if (isActionTriggered) return;
        setIsActionTriggered(true);
        onActionTriggered?.(true);
        maskRadiusX.set(1000);
        maskRadiusY.set(600);
        codeLayerOpacity.set(0.9);
        
        // Add a brief Haptic/Tactile feel if supported
        if ('vibrate' in navigator) navigator.vibrate(50);
    };

    React.useEffect(() => {
        return () => {
            onActionTriggered?.(false);
        };
    }, [onActionTriggered]);

    // Sharper mask edge (95% to 100%) for a technical "cut" feel
    const maskImage = useMotionTemplate`radial-gradient(${maskRadiusX}px ${maskRadiusY}px at ${mouseX}px ${mouseY}px, black 95%, transparent 100%)`;
    return (
        <div
            className="relative z-10 w-full h-full flex flex-col justify-center items-center overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* 0. TAP-TO-CLOSE OVERLAY (Top Level) */}
            <AnimatePresence>
                {isActionTriggered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetReveal}
                        className="absolute inset-0 z-[100] cursor-pointer pointer-events-auto"
                    />
                )}
            </AnimatePresence>

            {/* 1. LAYER ONE: Flashlight Code Reveal (Background) */}
            <motion.div
                className={`absolute inset-0 z-0 flex overflow-hidden bg-[#050505] pointer-events-none`}
                style={{ maskImage, WebkitMaskImage: maskImage, opacity }}
            >
                <div className="flex w-full h-full text-zinc-500/40 font-roboto text-[8px] md:text-xs pt-24 md:pt-16 uppercase">
                    <div className="w-48 md:w-64 border-r border-white/5 p-6 pt-4 hidden sm:block bg-black/40">
                        <div className="uppercase tracking-widest mb-6 text-zinc-400/40 text-[10px] font-montserrat font-semibold">Explorer</div>
                        <div className="flex flex-col gap-3 lowercase">
                            <div className="flex items-center gap-2"><span className="text-[8px] uppercase">▼</span> KODEKENOBI-OS</div>
                            <div className="pl-4 flex flex-col gap-3">
                                <div className="flex items-center gap-1"><span className="text-[8px] uppercase">▼</span> src</div>
                                <div className="pl-4 flex flex-col gap-3">
                                    <div className="flex items-center gap-1"><span className="text-[8px] uppercase">▼</span> core</div>
                                    <div className="pl-4 text-zinc-500/50 hover:text-white transition-colors">engine.ts</div>
                                    <div className="pl-4 text-zinc-500/50 hover:text-white transition-colors">net.ts</div>
                                    <div className="flex items-center gap-1"><span className="text-[8px] uppercase">▼</span> views</div>
                                    <div className="pl-4 text-blue-400 bg-blue-400/10 py-1 -mx-2 px-2 rounded">Slide5.tsx</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 md:p-10 md:pt-14 overflow-hidden relative">
                        <div className="flex gap-4 md:gap-6 mb-4 md:mb-6 text-zinc-500/30 border-b border-white/5 pb-2 md:pb-3 text-[9px] md:text-xs w-full max-w-4xl relative z-10">
                            <span className="text-blue-400 border-b border-blue-400 pb-2 md:pb-3 -mb-[9px] md:-mb-[13px]">Slide5.tsx</span>
                            <span>engine.ts</span>
                            <span>net.ts</span>
                        </div>
                        <div className="flex gap-2 md:gap-4 relative z-10 lowercase">
                            <div className="flex flex-col text-right text-zinc-500/20 select-none pb-20 mt-1">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <span key={i} className="leading-relaxed">{i + 1}</span>
                                ))}
                            </div>
                            <pre className="leading-relaxed tracking-wider whitespace-pre-wrap select-none text-zinc-200/50 font-roboto normal-case text-[8px] md:text-sm">
                                <HighlightedCode code={CODE_SNIPPET} />
                            </pre>
                        </div>
                    </div>

                    <div className="w-48 md:w-64 border-l border-white/5 p-6 pt-4 hidden lg:block bg-black/40">
                        <div className="uppercase tracking-widest mb-6 text-zinc-400/40 text-[10px]">Outline</div>
                        <div className="flex flex-col gap-3 text-[10px] lowercase">
                            <div className="flex items-center gap-2 text-blue-400/60"><span className="text-[8px] uppercase">▼</span> Slide5.tsx</div>
                            <div className="pl-4 text-zinc-500/40">[] CODE_SNIPPET</div>
                            <div className="pl-4 text-zinc-500/40">{ } Slide5</div>
                            <div className="pl-8 flex flex-col gap-2 mt-1">
                                <div className="text-zinc-500/30">ƒ handleMouseMove</div>
                                <div className="text-zinc-500/30">ƒ handleMouseLeave</div>
                                <div className="text-zinc-500/30">ƒ handleInitiateHoverEnter</div>
                                <div className="text-zinc-500/30">ƒ handleInitiateHoverLeave</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 2. LAYER TWO: Interactive UI (Foreground) */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
                }}
                className="flex flex-col items-center justify-center relative w-full h-full z-20"
            >
                {/* Main Action Call */}
                <motion.div
                    onMouseEnter={handleInitiateHoverEnter}
                    onMouseLeave={handleInitiateHoverLeave}
                    onClick={triggerReveal}
                    variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: CINEMATIC_EASE, delay: 0.5 } }
                    }}
                    className="group relative z-30 flex flex-col items-center justify-center cursor-pointer p-10 md:p-20"
                >
                    <motion.div
                        animate={isActionTriggered ? { opacity: 0, scale: 2, filter: "blur(20px)" } : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
                        className="relative z-40 flex flex-col items-center overflow-hidden"
                    >
                        <span className="text-white/90 text-xl md:text-4xl font-montserrat font-black tracking-[0.8em] md:tracking-[1.5em] uppercase pl-4 md:pl-10 relative">
                            {isActionTriggered ? "INIT..." : "REVEAL"}
                            {/* Glitch Overlay */}
                            <AnimatePresence>
                                {isActionTriggered && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: [0, 1, 0], x: [0, 15, -15, 0] }}
                                        className="absolute inset-0 text-cyan-400 font-montserrat font-black tracking-[0.8em] md:tracking-[1.5em] pl-4 md:pl-10"
                                    >
                                        REVEAL
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                        <div className="h-[1px] md:h-[2px] bg-[#c9a84c]/80 mt-6 md:mt-10 w-16 md:w-24" />
                    </motion.div>
                    
                </motion.div>

                {/* Meta Links */}
                <motion.div
                    onMouseEnter={handleSocialEnter}
                    onMouseLeave={handleSocialLeave}
                    initial="hidden"
                    animate={isActionTriggered ? { opacity: 0.05, scale: 0.75, y: 0 } : "visible"}
                    variants={{
                        hidden: { opacity: 0, y: 30, scale: 1 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.5, ease: CINEMATIC_EASE } }
                    }}
                    className="absolute bottom-16 md:bottom-32 z-20 text-center flex flex-col items-center bg-transparent backdrop-blur-sm px-6 md:px-12 py-4 rounded-full"
                >
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-zinc-500 font-montserrat font-semibold text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] uppercase">
                        <a href="https://www.linkedin.com/in/ignatius-mutizwa-7662b5229/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group">
                            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">LinkedIn</span>
                            <span className="absolute inset-0 text-[#c9a84c] transition-transform duration-500 translate-y-full group-hover:translate-y-0">LinkedIn</span>
                        </a>
                        <a href="https://github.com/KodeKenobi" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group">
                            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">GitHub</span>
                            <span className="absolute inset-0 text-[#c9a84c] transition-transform duration-500 translate-y-full group-hover:translate-y-0">GitHub</span>
                        </a>
                        <a href="https://www.trevnoctilla.com/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group">
                            <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">TREVNOCTIILA</span>
                            <span className="absolute inset-0 text-[#c9a84c] transition-transform duration-500 translate-y-full group-hover:translate-y-0">TREVNOCTIILA</span>
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Slide5;

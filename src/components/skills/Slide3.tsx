import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence, useDragControls } from "framer-motion";
import { CINEMATIC_EASE } from "../about/Shared";
import { mobileSlideVariants } from "./Shared";

import { soundEngine } from "../../lib/SoundEngine";

// ─── MOBILE TOUCH CARD (full finger-driven tilt + glare) ───
const MobileTouchCard: React.FC<{
    tech: { area: string; title: string; metrics: string[]; code: string };
    i: number;
    isRight: boolean;
}> = ({ tech, i, isRight }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    // 3D tilt motion values
    const rawX = useMotionValue(0.5);
    const rawY = useMotionValue(0.5);
    const springCfg = { damping: 18, stiffness: 180, mass: 0.6 };
    const springX = useSpring(rawX, springCfg);
    const springY = useSpring(rawY, springCfg);

    const rotateX = useTransform(springY, [0, 1], ["14deg", "-14deg"]);
    const rotateY = useTransform(springX, [0, 1], ["-14deg", "14deg"]);
    const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
    const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);
    const glare = useMotionTemplate`radial-gradient(380px circle at ${glareX} ${glareY}, rgba(201,168,76,0.18), transparent 75%)`;

    // Press-and-hold state
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const soundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [held, setHeld] = useState(false);
    const [tapped, setTapped] = useState(false);
    const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTouching = useRef(false);

    const resetTilt = () => {
        rawX.set(0.5);
        rawY.set(0.5);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        // DO NOT stop propagation here for natural scroll access
        isTouching.current = true;

        if (holdTimer.current) clearTimeout(holdTimer.current);
        if (soundTimer.current) clearTimeout(soundTimer.current);

        holdTimer.current = setTimeout(() => {
            if (isTouching.current) {
                setHeld(true);
                soundEngine.playFocus();
                // Add a small vibration feedback if supported
                if ('vibrate' in navigator) navigator.vibrate(40);
            }
        }, 500);

        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const t = e.touches[0];
            rawX.set((t.clientX - rect.left) / rect.width);
            rawY.set((t.clientY - rect.top) / rect.height);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        // If we ARE held, lock scroll and start drag
        if (held) {
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
        }

        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const t = e.touches[0];
        const nx = Math.max(0, Math.min(1, (t.clientX - rect.left) / rect.width));
        const ny = Math.max(0, Math.min(1, (t.clientY - rect.top) / rect.height));
        rawX.set(nx);
        rawY.set(ny);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        isTouching.current = false;

        if (holdTimer.current) clearTimeout(holdTimer.current);
        if (soundTimer.current) clearTimeout(soundTimer.current);

        if (held) {
            soundEngine.stopFocus();
            setHeld(false);
        }

        resetTilt();
        setTapped(true);
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
        tapTimeout.current = setTimeout(() => setTapped(false), 700);
    };

    const isActive = held || tapped;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: isRight ? 50 : -50, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: CINEMATIC_EASE }}
            drag={held}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.12}
            dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
            whileTap={{ scale: 0.97 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative overflow-hidden rounded-2xl cursor-pointer select-none min-h-[380px] ${held ? 'touch-none' : 'touch-pan-y'}`}
            style={{
                perspective: "1200px",
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                background: 'linear-gradient(145deg, #0d0d0d 0%, #050505 100%)',
                boxShadow: held
                    ? '0 0 40px rgba(201,168,76,0.35), 0 0 80px rgba(201,168,76,0.12), inset 0 0 30px rgba(201,168,76,0.06)'
                    : isActive
                        ? '0 0 25px rgba(201,168,76,0.2), 0 8px 32px rgba(0,0,0,0.7)'
                        : '0 6px 28px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)',
                transition: 'box-shadow 0.35s ease',
                border: '1px solid transparent',
                backgroundClip: 'padding-box',
                flex: '0 0 auto',
            }}
        >
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    padding: '1px',
                    background: held
                        ? 'linear-gradient(135deg, #c9a84c, #8b5cf6, #c9a84c)'
                        : isActive
                            ? 'linear-gradient(135deg, rgba(201,168,76,0.6), rgba(201,168,76,0.1))'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02), rgba(201,168,76,0.1))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    transition: 'background 0.4s ease',
                }}
            />

            <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{ background: glare, opacity: isTouching.current ? 1 : 0, transition: 'opacity 0.3s' }}
            />




            <AnimatePresence>
                {tapped && (
                    <motion.div
                        initial={{ opacity: 0.35 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(201,168,76,0.22), transparent 70%)' }}
                    />
                )}
            </AnimatePresence>

            <div
                className={`relative p-5 flex flex-col gap-3 h-full ${isRight ? 'items-end text-right' : 'items-start text-left'}`}
                style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1" style={{ flexDirection: isRight ? 'row-reverse' : 'row' }}>
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4], boxShadow: ['0 0 4px rgba(201,168,76,0.4)', '0 0 10px rgba(201,168,76,1)', '0 0 4px rgba(201,168,76,0.4)'] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                            className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0"
                        />
                        <span className="text-[#c9a84c] font-montserrat font-semibold text-[10px] tracking-[0.35em] uppercase">{tech.area}</span>
                    </div>
                    <h3
                        className="text-white text-xl font-montserrat font-black tracking-tighter"
                        style={{
                            textShadow: held ? '0 0 25px rgba(201,168,76,0.6), 2px 0 10px rgba(0,255,255,0.15)' : isActive ? '0 0 15px rgba(201,168,76,0.35)' : 'none',
                            transition: 'text-shadow 0.35s ease',
                            transform: 'translateZ(20px)',
                        }}
                    >
                        {tech.title}
                    </h3>
                </div>

                <ul className="space-y-1.5 w-full flex-1">
                    {tech.metrics.map((m, mi) => (
                        <motion.li
                            key={m}
                            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.12 + mi * 0.05 + 0.25 }}
                            className={`flex items-center gap-3 font-roboto text-[11px] tracking-wider ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
                            style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', transition: 'color 0.35s ease' }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    boxShadow: ['0 0 0px rgba(201,168,76,0)', '0 0 9px rgba(201,168,76,0.9)', '0 0 0px rgba(201,168,76,0)'],
                                }}
                                transition={{ duration: 1.6, repeat: Infinity, delay: mi * 0.22 + i * 0.55 }}
                                className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/60 flex-shrink-0"
                            />
                            {m}
                        </motion.li>
                    ))}
                </ul>

                <div
                    className={`w-full rounded-xl p-3 font-roboto text-[10px] ${isRight ? 'text-right' : 'text-left'}`}
                    style={{
                        background: 'rgba(0,0,0,0.75)',
                        border: isActive ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.05)',
                        color: isActive ? 'rgba(201,168,76,1)' : 'rgba(201,168,76,0.55)',
                        transition: 'border 0.35s ease, color 0.35s ease',
                        backdropFilter: 'blur(10px)',
                        transform: 'translateZ(15px)',
                    }}
                >
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? '#ff5f56' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', boxShadow: isActive ? '0 0 6px #ff5f5680' : 'none' }} />
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? '#ffbd2e' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', boxShadow: isActive ? '0 0 6px #ffbd2e80' : 'none' }} />
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? '#27c93f' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', boxShadow: isActive ? '0 0 6px #27c93f80' : 'none' }} />
                    </div>
                    {tech.code}
                </div>

            </div>
        </motion.div>
    );
};

const desktopVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

let audioCtx: AudioContext | null = null;
const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

const MagneticTiltCard = ({ tech, i, isAudioEnabled, toggleAudio }: { tech: any; i: number; isAudioEnabled: boolean; toggleAudio: () => void }) => {
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const isHovered = useRef(false);
    const canPlay = useRef(false);

    const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [0, 1], ["15deg", "-15deg"]);
    const rotateY = useTransform(springX, [0, 1], ["-15deg", "15deg"]);

    const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
    const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);
    const shimmerX = useTransform(springX, [0, 1], ["-50%", "150%"]);

    const background = useMotionTemplate`radial-gradient(400px circle at ${glareX} ${glareY}, rgba(201, 168, 76, 0.15), transparent 80%)`;
    const shimmer = useMotionTemplate`linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)`;

    const osc1Ref = useRef<OscillatorNode | null>(null);
    const osc2Ref = useRef<OscillatorNode | null>(null);
    const modGainRef = useRef<GainNode | null>(null);
    const envGainRef = useRef<GainNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    const baseFreq = 180 + (i * 30);

    useEffect(() => {
        const timer = setTimeout(() => {
            canPlay.current = true;
            if (isHovered.current) startTone();
        }, 800);

        return () => {
            clearTimeout(timer);
            if (osc1Ref.current) { try { osc1Ref.current.stop() } catch (e) { } }
            if (osc2Ref.current) { try { osc2Ref.current.stop() } catch (e) { } }
            if (modGainRef.current) modGainRef.current.disconnect();
            if (envGainRef.current) envGainRef.current.disconnect();
            if (filterRef.current) filterRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isHovered.current && canPlay.current) {
            if (isAudioEnabled) {
                startTone();
            } else {
                stopToneSilently();
            }
        }
    }, [isAudioEnabled]);

    const startTone = () => {
        if (!isAudioEnabled || !canPlay.current) return;
        const ctx = initAudio();
        if (ctx.state === 'suspended') return;
        if (!envGainRef.current) {
            envGainRef.current = ctx.createGain();
            modGainRef.current = ctx.createGain();
            filterRef.current = ctx.createBiquadFilter();
            envGainRef.current.gain.setValueAtTime(0.0001, ctx.currentTime);
            modGainRef.current.gain.setValueAtTime(0.1, ctx.currentTime);
            filterRef.current.type = 'lowpass';
            filterRef.current.Q.setValueAtTime(0.7, ctx.currentTime);
            filterRef.current.frequency.setValueAtTime(200, ctx.currentTime);
            filterRef.current.connect(modGainRef.current);
            modGainRef.current.connect(envGainRef.current);
            envGainRef.current.connect(ctx.destination);
            osc1Ref.current = ctx.createOscillator();
            osc2Ref.current = ctx.createOscillator();
            osc1Ref.current.type = 'sine';
            osc2Ref.current.type = 'sine';
            osc1Ref.current.frequency.setValueAtTime(baseFreq, ctx.currentTime);
            osc2Ref.current.frequency.setValueAtTime(baseFreq * 1.008, ctx.currentTime);
            osc1Ref.current.connect(filterRef.current);
            osc2Ref.current.connect(filterRef.current);
            osc1Ref.current.start();
            osc2Ref.current.start();
        }
        if (envGainRef.current) {
            envGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
            envGainRef.current.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.8);
        }
    };

    const stopTone = () => {
        isHovered.current = false;
        mouseX.set(0.5);
        mouseY.set(0.5);
        if (audioCtx && envGainRef.current) {
            envGainRef.current.gain.cancelScheduledValues(audioCtx.currentTime);
            envGainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        }
    };

    const stopToneSilently = () => {
        if (audioCtx && envGainRef.current) {
            envGainRef.current.gain.cancelScheduledValues(audioCtx.currentTime);
            envGainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        mouseX.set(nx);
        mouseY.set(ny);

        if (isAudioEnabled && canPlay.current && audioCtx && modGainRef.current && filterRef.current && osc1Ref.current && osc2Ref.current) {
            const freqOffset = (nx - 0.5) * 6;
            osc1Ref.current.frequency.setTargetAtTime(baseFreq + freqOffset, audioCtx.currentTime, 0.15);
            osc2Ref.current.frequency.setTargetAtTime((baseFreq + freqOffset) * 1.008, audioCtx.currentTime, 0.15);
            const filterFreq = 300 + (Math.max(0, 1 - ny) * 800);
            filterRef.current.frequency.setTargetAtTime(filterFreq, audioCtx.currentTime, 0.2);
            const distFromCenter = Math.abs(nx - 0.5) + Math.abs(ny - 0.5);
            const distFromIcon = Math.sqrt(Math.pow(1 - nx, 2) + Math.pow(ny, 2));
            const iconAttenuation = Math.max(0.2, Math.min(1, distFromIcon * 2));
            const targetGain = (0.08 + (distFromCenter * 0.12)) * iconAttenuation;
            modGainRef.current.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: i * 0.15 + 0.3, ease: CINEMATIC_EASE }}
            onMouseEnter={() => { isHovered.current = true; if (canPlay.current) startTone(); }}
            onMouseMove={handleMouseMove}
            onMouseLeave={stopTone}
            className="group relative border border-white/10 bg-[#050505] p-8 flex flex-col justify-between overflow-visible cursor-crosshair rounded-2xl h-full shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
            style={{ perspective: "1500px", rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
            <div className="absolute inset-0 z-[1] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "4px 100%" }} />
            </div>
            <motion.div className="absolute inset-0 z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl pointer-events-none" style={{ background: shimmer, x: shimmerX }} />
            <motion.div className="absolute inset-0 z-[3] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" style={{ background }} />
            <div className="relative z-10 flex flex-col h-full transform-gpu" style={{ transformStyle: "preserve-3d" }}>
                <div
                    className="absolute top-0 right-0 z-[50] cursor-pointer p-2 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity duration-300"
                    onClick={(e) => { e.stopPropagation(); toggleAudio(); stopTone(); }}
                    style={{ transform: "translateZ(150px)" }}
                >
                    {isAudioEnabled ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                    )}
                </div>
                <div className="mt-8 mb-8 transform-gpu" style={{ transform: "translateZ(60px)" }}>
                    <h3 className="text-white text-3xl xl:text-4xl font-montserrat font-black tracking-tighter leading-[0.9] group-hover:text-[#c9a84c] transition-all duration-500 max-w-[90%] group-hover:[text-shadow:2px_0_10px_rgba(201,168,76,0.3),-2px_0_10px_rgba(0,255,255,0.2)]">
                        {tech.title.replace('_', '\n')}
                    </h3>
                </div>
                <ul className="space-y-5 mb-8 flex-1 transform-gpu" style={{ transform: "translateZ(90px)" }}>
                    {tech.metrics.map((m: string) => (
                        <li key={m} className="flex items-center gap-4 text-white/40 font-roboto text-[10px] xl:text-xs tracking-[0.2em] group-hover:text-white/90 transition-all duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#c9a84c] group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
                            {m}
                        </li>
                    ))}
                </ul>
                <div
                    className="bg-black/80 backdrop-blur-md border border-white/10 p-5 rounded-xl font-roboto text-[9px] xl:text-[10px] text-white/40 select-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] transform-gpu group-hover:border-[#c9a84c]/30 transition-colors duration-500"
                    style={{ transform: "translateZ(130px)" }}
                >
                    <div className="flex gap-2 mb-4 border-b border-white/10 pb-3">
                        <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-red-500/40" />
                        <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-yellow-500/40" />
                        <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-green-500/40" />
                    </div>
                    <code className="text-[#c9a84c]/60 group-hover:text-[#c9a84c] transition-colors duration-500">{tech.code}</code>
                </div>
            </div>
            <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 h-[3px] bg-[#c9a84c] rounded-full pointer-events-none shadow-[0_0_15px_rgba(201,168,76,0.8)]"
                style={{ transform: "translateZ(20px)" }}
            />
        </motion.div>
    );
};

export const Slide3: React.FC<{ isMobile: boolean; direction: number }> = ({ isMobile, direction }) => {
    const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);

    const techData = [
        {
            area: "ENGINEERING",
            title: "ARCHITECTURE",
            metrics: ["Distributed Systems", "Scalable Logic", "High Availability", "Cloud Native", "Microservices", "Zero-Trust Security"],
            code: "cluster.orchestrate({ nodes: 12 })"
        },
        {
            area: "DYNAMICS",
            title: "INTERACTION",
            metrics: ["Kinetic Motion", "Predictable State", "Fluid UX", "SVG Animation", "Gesture Logic", "Accessibility Layer"],
            code: "dispatch({ type: 'KINETIC_SYNC' })"
        },
        {
            area: "LOGIC",
            title: "DATA",
            metrics: ["Real-time Streams", "Pattern Recognition", "Schema Evolution", "Latency Buffering", "Async Handling", "Data Integrity"],
            code: "stream.pipe(analytics.engine)"
        }
    ];

    if (isMobile) {
        return (
            <motion.div
                ref={scrollRef}
                key="mb-skills-3"
                custom={direction}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: CINEMATIC_EASE }}
                className="absolute inset-0 w-full h-full overflow-y-auto overscroll-none [will-change:scroll-position] [-webkit-overflow-scrolling:touch]"
            >
                <div className="px-5 pt-20 pb-64 flex flex-col gap-6">
                    {techData.map((tech, i) => (
                        <MobileTouchCard
                            key={tech.title}
                            tech={tech}
                            i={i}
                            isRight={i % 2 !== 0}
                        />
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            key="skills-slide-3"
            custom={direction}
            variants={desktopVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: CINEMATIC_EASE }}
            className="absolute inset-0 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center h-full overflow-hidden perspective-distant"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 h-[65%] mt-12">
                {techData.map((tech, i) => (
                    <MagneticTiltCard
                        key={tech.title}
                        tech={tech}
                        i={i}
                        isAudioEnabled={isAudioEnabled}
                        toggleAudio={toggleAudio}
                    />
                ))}
            </div>
        </motion.div>
    );
};

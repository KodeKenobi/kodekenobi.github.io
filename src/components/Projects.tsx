import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "./about/Shared";
import Slide0 from "./projects/Slide0";
import Globe from "./Globe";
import { HiArrowLongRight, HiOutlineArrowDownTray } from "react-icons/hi2";
import { useRepoStore } from "../store/useRepoStore";

export default function Projects({ isActive, isMobile, slideIndex, direction }: { isActive: boolean; isMobile: boolean; slideIndex: number; direction: number }) {
    const { repos, loading, fetchRepos } = useRepoStore();
    const [currentPage, setCurrentPage] = useState(1);
    const reposPerPage = 6;

    useEffect(() => {
        if (isActive) {
            fetchRepos();
        }
    }, [isActive, fetchRepos]);

    // Pagination Logic
    const totalPages = Math.ceil(repos.length / reposPerPage);
    const currentRepos = repos.slice((currentPage - 1) * reposPerPage, currentPage * reposPerPage);

    // Scroll to top when page changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [currentPage]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, ease: CINEMATIC_EASE }
        }
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleTouch = (e: TouchEvent) => {
            const isAtTop = el.scrollTop <= 5;
            const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 5;

            if (!isAtTop && !isAtBottom) {
                e.stopPropagation();
            }
        };

        el.addEventListener('touchstart', handleTouch, { passive: true });
        el.addEventListener('touchmove', handleTouch, { passive: true });

        return () => {
            el.removeEventListener('touchstart', handleTouch);
            el.removeEventListener('touchmove', handleTouch);
        };
    }, []);

    const slideVariants = {
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

    return (
        <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
                {isActive && slideIndex === 0 && (
                    <Slide0 isMobile={isMobile} direction={direction} />
                )}

                {isActive && slideIndex === 1 && (
                    <motion.div
                        key="projects-grid"
                        id="projects-grid"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6, ease: CINEMATIC_EASE }}
                        ref={scrollRef}
                        className="absolute inset-0 w-full h-full font-sans bg-[#050505] flex flex-col pt-24 pb-20 px-6 md:px-12 overflow-y-auto overflow-x-hidden"
                    >
                        <div className="flex-1 w-full max-w-7xl mx-auto mt-12 relative z-10">
                            {/* Stats Header */}
                            {!loading && repos.length > 0 && (
                                <div className="flex justify-between items-end mb-12">
                                    <div className="space-y-1">
                                        <h2 className="text-[#c9a84c] text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">Neural Archives</h2>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold text-white tracking-tighter">
                                                {String((currentPage - 1) * reposPerPage + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-lg font-mono text-white/20">/ {repos.length}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="w-full flex justify-center py-20">
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-[#c9a84c]"
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {currentRepos.length > 0 ? (
                                            currentRepos.map((repo, idx) => {
                                                const isEven = idx % 2 === 0;
                                                return (
                                                    <motion.div
                                                        key={repo.id}
                                                        variants={cardVariants}
                                                        className="group relative flex h-[420px] w-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-2xl transition-all duration-700 hover:border-[#c9a84c]/30"
                                                    >
                                                        {/* Top Glow */}
                                                        <div className="absolute inset-0 bg-[radial-gradient(50%_160px_at_50%_0%,rgba(201,168,76,0.08),transparent)] pointer-events-none"></div>

                                                        {/* Floating Globe */}
                                                        <div className={`absolute top-0 ${isEven ? 'right-[-20%]' : 'left-[-20%]'} w-[80%] h-full pointer-events-none transition-transform duration-700 group-hover:scale-110`}>
                                                            <div className="pointer-events-auto w-full h-full">
                                                                <Globe
                                                                    dark
                                                                    baseColor="#ffffff"
                                                                    glowColor="#c9a84c"
                                                                    markerColor="#c9a84c"
                                                                    brightness={1.2}
                                                                    offsetX={0}
                                                                    offsetY={-40}
                                                                    scale={1}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Activity Pulse Graph */}
                                                        <div className="absolute bottom-32 left-0 w-full px-6 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                                                            <MiniGraph seed={repo.id} />
                                                        </div>

                                                        {/* Info Overlay */}
                                                        <div className="mt-auto p-8 relative z-20">
                                                            <div className="space-y-4">
                                                                {/* Languages */}
                                                                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                                                    {repo.languages?.map(lang => (
                                                                        <span key={lang} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#c9a84c] tracking-widest uppercase">
                                                                            {lang}
                                                                        </span>
                                                                    ))}
                                                                </div>

                                                                <div className="space-y-1 transform transition-transform duration-500 group-hover:-translate-y-4">
                                                                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#c9a84c] transition-colors duration-300">
                                                                        {repo.name}
                                                                    </h3>
                                                                    <p className="text-xs font-mono text-white/40 leading-relaxed line-clamp-2 max-w-[80%]">
                                                                        {repo.description || "Experimental architecture and codebase."}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center justify-between pt-2">
                                                                    <div className="flex gap-4 text-[10px] font-mono text-white/30 uppercase tracking-tighter">
                                                                        <span>★ {repo.stargazers_count}</span>
                                                                        <span>⑂ {repo.forks_count}</span>
                                                                    </div>

                                                                    <div className="flex items-center gap-3 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                                        <a
                                                                            href={`${repo.html_url}/archive/refs/heads/${repo.default_branch || 'main'}.zip`}
                                                                            title="Download ZIP"
                                                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
                                                                        >
                                                                            <HiOutlineArrowDownTray className="h-4 w-4" />
                                                                        </a>

                                                                        <a
                                                                            href={repo.html_url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#c9a84c] transition-all duration-300"
                                                                        >
                                                                            <span>Source</span>
                                                                            <HiArrowLongRight className="h-4 w-4" />
                                                                        </a>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Animated Hover Border */}
                                                        <div className="absolute inset-0 border border-[#c9a84c]/0 group-hover:border-[#c9a84c]/20 rounded-3xl transition-all duration-700 pointer-events-none"></div>
                                                    </motion.div>
                                                );
                                            })
                                        ) : (
                                            <div className="col-span-full py-20 text-center">
                                                <p className="text-[#c9a84c] font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
                                                    Establishing Neural Link...
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-8 mt-16 mb-8">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="group flex items-center gap-3 text-[10px] font-mono tracking-[0.4em] uppercase text-white/30 hover:text-[#c9a84c] disabled:opacity-0 transition-all duration-300"
                                            >
                                                <HiArrowLongRight className="h-4 w-4 transition-transform group-hover:-translate-x-1 rotate-180" />
                                                Prev
                                            </button>

                                            <div className="flex gap-4">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`w-1 h-8 transition-all duration-500 ${currentPage === i + 1 ? 'bg-[#c9a84c] scale-y-125' : 'bg-white/10 hover:bg-white/30'}`}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="group flex items-center gap-3 text-[10px] font-mono tracking-[0.4em] uppercase text-white/30 hover:text-[#c9a84c] disabled:opacity-0 transition-all duration-300"
                                            >
                                                Next
                                                <HiArrowLongRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Background Grid Lines */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                            style={{
                                backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                                backgroundSize: '4rem 4rem'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Mini Activity Graph Component
function MiniGraph({ seed }: { seed: number }) {
    // Generate organic-looking points based on seed
    const points = Array.from({ length: 10 }, (_, i) => {
        const x = i * 11;
        // Create a wave that looks like git activity
        const h = 5 + (Math.abs(Math.sin(seed + i * 0.9)) * 15 + Math.abs(Math.cos(seed * 0.7 + i * 1.3)) * 10);
        return `${x},${40 - h}`;
    }).join(" ");

    return (
        <svg viewBox="0 0 100 40" className="w-full h-10 stroke-[#c9a84c] fill-none stroke-[1.5] transition-all duration-700 group-hover:stroke-white/40">
            <motion.polyline
                points={points}
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

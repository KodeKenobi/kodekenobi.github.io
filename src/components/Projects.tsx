import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { SplitText, ClipReveal, CINEMATIC_EASE } from "./about/Shared";

interface Repository {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    languages: string[];
    topics: string[];
    updated_at: string;
    default_branch: string;
    languages_url: string;
}

export default function Projects({ isActive }: { isActive: boolean }) {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const REPOS_PER_PAGE = 9;
    const cardsTopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive && repos.length > 0) return;

        const fetchRepos = async () => {
            try {
                // Fetch user repos, sort by updated
                const res = await fetch("https://api.github.com/users/KodeKenobi/repos?sort=updated&per_page=100");
                if (res.ok) {
                    const data = await res.json();
                    // Filter out forks and specific repos
                    const filtered = data.filter((r: any) =>
                        !r.fork &&
                        r.name.toLowerCase() !== 'thuis' &&
                        !r.name.toLowerCase().includes('trevnoctilla')
                    );

                    // Fetch languages for each repo
                    const reposWithLanguages = await Promise.all(
                        filtered.map(async (repo: any) => {
                            try {
                                const langRes = await fetch(repo.languages_url);
                                if (langRes.ok) {
                                    const langData = await langRes.json();
                                    return { ...repo, languages: Object.keys(langData) };
                                }
                            } catch (e) {
                                // Ignore error and return repo as is
                            }
                            return { ...repo, languages: repo.language ? [repo.language] : [] };
                        })
                    );

                    setRepos(reposWithLanguages);
                }
            } catch (error) {
                console.error("Failed to fetch GitHub repos", error);
            } finally {
                setLoading(false);
            }
        };

        if (isActive && repos.length === 0) {
            fetchRepos();
        }
    }, [isActive, repos.length]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: CINEMATIC_EASE } }
    };

    const totalPages = Math.ceil(repos.length / REPOS_PER_PAGE);
    const displayedRepos = repos.slice((page - 1) * REPOS_PER_PAGE, page * REPOS_PER_PAGE);

    return (
        <div className="relative w-full min-h-screen font-sans bg-[#050505] flex flex-col pt-32 pb-24 px-8 md:px-16">
            {/* Header */}
            <div className="absolute top-24 left-8 md:left-16 z-10 pointers-events-none">
                <div className="flex flex-col items-start leading-[0.85]">
                    {isActive && (
                        <>
                            <h1 className="text-white text-6xl md:text-[8rem] font-black tracking-tighter">
                                <SplitText text="MY" startDelay={0.2} charDelay={0.03} />
                            </h1>
                            <h1 className="text-white/40 text-6xl md:text-[8rem] font-black tracking-tighter">
                                <SplitText text="PROJECTS" startDelay={0.3} charDelay={0.02} />
                                <motion.span
                                    initial={{ y: -150, opacity: 0 }}
                                    animate={{
                                        y: [null, 0, -50, 0, -20, 0, -6, 0],
                                        opacity: 1,
                                    }}
                                    transition={{
                                        y: { duration: 2.2, times: [0, 0.18, 0.32, 0.45, 0.58, 0.70, 0.82, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"], delay: 0.8 },
                                        opacity: { duration: 0.1, delay: 0.8 },
                                    }}
                                    style={{ display: "inline-block" }}
                                >
                                    .
                                </motion.span>
                            </h1>
                        </>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full max-w-7xl mx-auto mt-64 md:mt-80 relative z-10">
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
                        {/* Scroll Target */}
                        <div ref={cardsTopRef} className="absolute -top-16" />
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={isActive ? "show" : "hidden"}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {displayedRepos.map((repo, i) => (
                                <motion.div
                                    key={repo.id}
                                    variants={cardVariants}
                                    className="group relative bg-[#0a0a0a] border border-white/5 p-8 flex flex-col justify-between hover:bg-white/[0.02] transition-colors duration-500 overflow-hidden"
                                >
                                    {/* Background Accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 rounded-full blur-3xl group-hover:bg-[#c9a84c]/10 transition-colors duration-700 pointer-events-none" />

                                    <div className="relative z-10 flex-1">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-3 items-center">
                                                {repo.languages && repo.languages.length > 0 && (
                                                    <>
                                                        <svg className="w-5 h-5 text-white/40 group-hover:text-[#c9a84c] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M4 19a2 2 0 10 4 0 2 2 0 00-4 0zm0 0V5a2 2 0 114 0v14" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8 5a2 2 0 104 0v9a2 2 0 11-4 0" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <span className="text-[#c9a84c] font-mono text-[9px] tracking-widest uppercase">
                                                            {repo.languages.join(' \u2022 ')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex gap-4 font-mono text-[10px] text-white/50">
                                                <span className="flex items-center gap-1 group-hover:text-white/80 transition-colors">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                    {repo.stargazers_count}
                                                </span>
                                                <span className="flex items-center gap-1 group-hover:text-white/80 transition-colors">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="18" r="3" />
                                                        <circle cx="6" cy="6" r="3" />
                                                        <circle cx="18" cy="6" r="3" />
                                                        <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9M12 12v3" />
                                                    </svg>
                                                    {repo.forks_count}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-white text-2xl font-black tracking-tighter mb-3 group-hover:text-[#c9a84c] transition-colors duration-500 truncate">
                                            {repo.name}
                                        </h3>

                                        <p className="text-white/50 font-mono text-[11px] leading-relaxed tracking-wider line-clamp-3 mb-6">
                                            {repo.description || "No description provided for this repository. Code speaks for itself."}
                                        </p>

                                        {/* Topics */}
                                        {repo.topics && repo.topics.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {repo.topics.slice(0, 3).map(topic => (
                                                    <span key={topic} className="px-2 py-0.5 bg-white/5 text-white/40 font-mono text-[9px] tracking-widest uppercase rounded">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="relative z-10 flex gap-3 mt-auto pt-6 border-t border-white/5">
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 text-center bg-white/5 hover:bg-white/10 text-white/80 font-mono text-[10px] py-3 tracking-widest uppercase transition-colors rounded-sm border border-white/10 hover:border-[#c9a84c]/50"
                                        >
                                            View Source
                                        </a>
                                        <a
                                            href={`${repo.html_url}/archive/refs/heads/${repo.default_branch || 'main'}.zip`}
                                            className="flex-1 text-center bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] font-mono text-[10px] py-3 tracking-widest uppercase transition-colors rounded-sm border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                            </svg>
                                            Download
                                        </a>
                                    </div>

                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileHover={{ width: '100%' }}
                                        className="absolute bottom-0 left-0 h-[1px] bg-[#c9a84c]/40 origin-left"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 pb-12 gap-6 w-full">
                                <button
                                    onClick={() => {
                                        setPage(p => Math.max(1, p - 1));

                                        // Scroll the nearest scrollable parent to top
                                        const container = cardsTopRef.current?.closest('.overflow-y-auto');
                                        if (container) {
                                            container.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    disabled={page === 1}
                                    className="px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:text-white/50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors uppercase font-mono text-xs tracking-widest rounded-sm hover:border-[#c9a84c]/50"
                                >
                                    Prev
                                </button>
                                <span className="text-[#c9a84c] font-mono text-sm tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-sm border border-[#c9a84c]/20">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => {
                                        setPage(p => Math.min(totalPages, p + 1));

                                        // Scroll the nearest scrollable parent to top
                                        const container = cardsTopRef.current?.closest('.overflow-y-auto');
                                        if (container) {
                                            container.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    disabled={page === totalPages}
                                    className="px-6 py-3 border border-white/10 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:text-white/50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors uppercase font-mono text-xs tracking-widest rounded-sm hover:border-[#c9a84c]/50"
                                >
                                    Next
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
        </div>
    );
}

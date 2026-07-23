import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CINEMATIC_EASE } from "./about/Shared";
import Slide0 from "./products/Slide0";

export default function Products({ isActive, isMobile, slideIndex, direction }: { isActive: boolean; isMobile: boolean; slideIndex: number; direction: number }) {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3;

    // Sample products data
    const products = [
        { id: 1, name: "ActiveDesk", description: "Keeps your work status active while you step away. Lightweight desktop app for Teams, Slack & more. For Mac and Windows.", url: "https://kodekenobi.github.io/ActiveDesk/" },
        { id: 2, name: "Product Two", description: "Tools designed for modern development" },
        { id: 3, name: "Product Three", description: "Systems that drive real impact" },
    ];

    // Pagination Logic
    const totalPages = Math.ceil(products.length / productsPerPage);
    const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

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
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
                {isActive && slideIndex === 0 && (
                    <Slide0 isMobile={isMobile} direction={direction} />
                )}

                {isActive && slideIndex === 1 && (
                    <motion.div
                        key="products-grid"
                        id="products-grid"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.6, ease: CINEMATIC_EASE }}
                        ref={scrollRef}
                        className="absolute inset-0 w-full h-full font-roboto flex flex-col pt-24 pb-20 px-6 md:px-12 overflow-y-auto no-scrollbar overflow-x-hidden"
                    >
                        <div className="flex-1 w-full max-w-7xl mx-auto mt-12 relative z-10">
                            {/* Header */}
                            <div className="mb-16">
                                <h2 className="text-[#c9a84c] text-[10px] font-montserrat font-semibold tracking-[0.3em] uppercase opacity-50">
                                    What I Build
                                </h2>
                                <div className="flex items-baseline gap-2 mt-3">
                                    <span className="text-4xl font-inter font-black text-white tracking-tighter">
                                        {String(products.length).padStart(2, "0")}
                                    </span>
                                    <span className="text-lg font-roboto text-white/20">
                                        products
                                    </span>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product, idx) => (
                                        <div 
                                            key={product.id} 
                                            className="flex flex-col group"
                                            style={{
                                                transition: 'transform 0.3s ease-out'
                                            }}
                                            onMouseEnter={(e) => {
                                                const container = e.currentTarget.closest('.grid');
                                                if (container) {
                                                    const allCards = container.querySelectorAll('.group');
                                                    allCards.forEach((card: any) => {
                                                        if (card !== e.currentTarget) {
                                                            card.style.transform = 'scale(0.9)';
                                                            card.style.opacity = '0.7';
                                                        }
                                                    });
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const container = e.currentTarget.closest('.grid');
                                                if (container) {
                                                    const allCards = container.querySelectorAll('.group');
                                                    allCards.forEach((card: any) => {
                                                        card.style.transform = 'scale(1)';
                                                        card.style.opacity = '1';
                                                    });
                                                }
                                            }}
                                        >
                                            <motion.div
                                                variants={cardVariants}
                                                className={`relative bg-white/5 border border-white/10 h-56 group-hover:border-[#c9a84c]/50 transition-all duration-500 overflow-hidden rounded-3xl group-hover:scale-110 group-hover:z-50 ${product.url ? "cursor-pointer" : ""}`}
                                            >
                                            {product.url && (
                                                <a
                                                    href={product.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 z-20"
                                                    aria-label={product.name}
                                                />
                                            )}
                                            {/* Hover glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/0 to-[#c9a84c]/0 group-hover:from-[#c9a84c]/10 group-hover:to-[#c9a84c]/0 transition-all duration-500 pointer-events-none rounded-3xl" />
                                            {/* Hover border effect */}
                                            <div className="absolute inset-0 border border-[#c9a84c]/0 group-hover:border-[#c9a84c]/20 rounded-3xl transition-all duration-500 pointer-events-none" />

                                            <div className="relative z-10 flex flex-col h-full w-full">
                                                {product.name === "ActiveDesk" ? (
                                                    <>
                                                        {/* ActiveDesk iframe preview - zoomed out to show full hero, fills entire card */}
                                                        <div className="w-full h-full overflow-hidden relative rounded-3xl">
                                                            <iframe
                                                                src={product.url}
                                                                className="border-0 pointer-events-none group-hover:blur-sm transition-all duration-300"
                                                                title={product.name}
                                                                style={{ 
                                                                    width: '1920px',
                                                                    height: '1080px',
                                                                    transform: 'scale(0.25)',
                                                                    transformOrigin: 'top left',
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    overflow: 'hidden'
                                                                }}
                                                            />
                                                            {/* Hover eye icon overlay */}
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                                <svg className="w-8 h-8 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                                </svg>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-white text-xs font-montserrat font-semibold uppercase tracking-[0.15em]">View Product</span>
                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Cards 2 & 3 - Same layout as ActiveDesk */}
                                                        <div className="w-full h-full overflow-hidden relative rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] flex flex-col items-center justify-center p-8">
                                                            {/* Content behind overlay */}
                                                            <div className="text-center z-0">
                                                                <span className="text-4xl font-inter font-black text-[#c9a84c]/40 mb-4 block">
                                                                    {String(idx + 1).padStart(2, "0")}
                                                                </span>
                                                                <h3 className="text-lg font-inter font-black text-white mb-3">
                                                                    {product.name}
                                                                </h3>
                                                                <p className="text-sm font-roboto text-white/50 leading-relaxed">
                                                                    {product.description}
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Hover eye icon overlay */}
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-3xl">
                                                                <svg className="w-8 h-8 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                                </svg>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-white text-xs font-montserrat font-semibold uppercase tracking-[0.15em]">Coming Soon</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                        
                                        {/* Text below card */}
                                        <div className="mt-4">
                                            <h3 className="text-lg font-inter font-black text-white group-hover:text-[#c9a84c] transition-colors duration-300">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm font-roboto text-white/50 leading-relaxed mt-2">
                                                {product.description}
                                            </p>
                                        </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-[#c9a84c] font-roboto text-xs tracking-[0.3em] uppercase animate-pulse">
                                            Loading Products...
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
                                        className="group flex items-center gap-3 text-[10px] font-montserrat font-semibold tracking-[0.4em] uppercase text-white/30 hover:text-[#c9a84c] disabled:opacity-0 transition-all duration-300"
                                    >
                                        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
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
                                        className="group flex items-center gap-3 text-[10px] font-montserrat font-semibold tracking-[0.4em] uppercase text-white/30 hover:text-[#c9a84c] disabled:opacity-0 transition-all duration-300"
                                    >
                                        Next
                                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

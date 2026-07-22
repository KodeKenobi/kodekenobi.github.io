import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RightClickModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setIsOpen(true);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none"
        >
          {/* Liquid Glass Container */}
          <div className="relative max-w-3xl w-[95%] md:w-[85%] pointer-events-auto">
            {/* Background blur layer with liquid gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl border border-white/20" />
            
            {/* Animated liquid gradient overlay */}
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 20% 30%, rgba(201, 168, 76, 0.15) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 70%, rgba(201, 168, 76, 0.15) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 30%, rgba(201, 168, 76, 0.15) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
            />

            {/* Content with proper layering */}
            <div className="relative z-10 p-8 md:p-10 space-y-4">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Subtitle */}
              <p className="text-white/70 font-montserrat text-sm tracking-[0.03em] leading-relaxed">
                Curious about how this was built?
              </p>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-px bg-gradient-to-r from-[#c9a84c]/50 via-[#c9a84c]/30 to-transparent origin-left"
              />

              <p className="text-white/60 font-roboto text-xs tracking-[0.2em] leading-relaxed">
                Let's build something incredible together.
              </p>

              {/* Contact section with liquid styling */}
              <div className="pt-2 space-y-3 ">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Email */}
                  <a
                    href="mailto:kodekenobi@gmail.com"
                    className="group block"
                  >
                    <div className="relative p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/10 transition-all duration-300">
                      <p className="text-white/40 font-roboto text-xs tracking-[0.1em] uppercase group-hover:text-white/60 transition-colors">Email</p>
                      <p className="text-white font-montserrat text-sm mt-1 group-hover:text-[#c9a84c] transition-colors truncate">
                        kodekenobi@gmail.com
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+27630291420"
                    className="group block"
                  >
                    <div className="relative p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/10 transition-all duration-300">
                      <p className="text-white/40 font-roboto text-xs tracking-[0.1em] uppercase group-hover:text-white/60 transition-colors">Phone</p>
                      <p className="text-white font-montserrat text-sm mt-1 group-hover:text-[#c9a84c] transition-colors">
                        +27 630 291 420
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/27630291420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/10 transition-all duration-300">
                      <p className="text-white/40 font-roboto text-xs tracking-[0.1em] uppercase group-hover:text-white/60 transition-colors">WhatsApp</p>
                      <p className="text-white font-montserrat text-sm mt-1 group-hover:text-[#c9a84c] transition-colors">
                        Message Direct
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Animated liquid overlay backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[998] bg-black/30 backdrop-blur-md"
        />
      )}
    </AnimatePresence>
  );
};

export default RightClickModal;

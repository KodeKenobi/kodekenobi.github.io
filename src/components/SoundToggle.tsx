import React from "react";
import { useSound } from "../hooks/useSound";
import { motion } from "framer-motion";

export const SoundToggle: React.FC = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="mt-12 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      <div className="relative flex items-center justify-center">
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/40"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <div className="flex h-4 items-end gap-[2px]">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  height: ["20%", "100%", "40%", "80%", "20%"],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-[3px] bg-white rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
};

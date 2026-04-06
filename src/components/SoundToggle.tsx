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
      className="mt-8 group flex items-center justify-center gap-2 transition-all cursor-pointer opacity-50 hover:opacity-100"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      <div className="relative flex items-center justify-center">
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        )}
      </div>
      <span className="text-white font-montserrat font-semibold text-[10px] uppercase tracking-[0.2em]">
        {isMuted ? "Sound Off" : "Sound On"}
      </span>
    </motion.button>
  );
};

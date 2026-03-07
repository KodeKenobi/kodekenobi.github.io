import React from "react";
import { motion } from "framer-motion";
import { CINEMATIC_EASE, StationaryText } from "./Shared";

const Slide3: React.FC = () => (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center h-full">

        <div className="max-w-5xl">
            <StationaryText
                text="This is more than a portfolio; it's a living architecture."
                startDelay={0.2}
                className="text-white text-3xl md:text-5xl font-light leading-snug md:leading-tight"
            />
            <div className="mt-4">
                <StationaryText
                    text="The boundaries between data and art dissolve within the scroll."
                    startDelay={0.5}
                    className="text-white text-3xl md:text-5xl font-light leading-snug md:leading-tight"
                />
            </div>
            <div className="mt-8">
                <StationaryText
                    text="Every interaction is a choice, and every choice reveals a layer of intent."
                    startDelay={1.0}
                    className="text-white/40 text-2xl md:text-4xl font-light leading-snug md:leading-tight"
                />
            </div>
            <div className="mt-4">
                <StationaryText
                    text="The observer is an extension of the system's execution."
                    startDelay={1.4}
                    className="text-white/40 text-2xl md:text-4xl font-light leading-snug md:leading-tight"
                />
            </div>
        </div>

        <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: CINEMATIC_EASE, delay: 1.5 }}
            className="mt-16 flex items-center gap-4"
        >
            <div className="h-px w-16 bg-white/10" />
            <span className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                Architecture
            </span>
        </motion.div>
    </div>
);

export default Slide3;

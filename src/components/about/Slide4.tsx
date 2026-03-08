import React from "react";
import { motion } from "framer-motion";
import { CINEMATIC_EASE, StationaryText } from "./Shared";

const Slide4: React.FC = () => (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center h-full">

        <div className="max-w-5xl">
            <StationaryText
                text="The interface breathes, responding to presence with mathematical grace."
                startDelay={0.2}
                className="text-white text-xl md:text-5xl font-light leading-snug md:leading-tight"
            />
            <div className="mt-2 md:mt-4">
                <StationaryText
                    text="Precision isn't just in the code; it's in the weight of every transition."
                    startDelay={0.5}
                    className="text-white text-xl md:text-5xl font-light leading-tight"
                />
            </div>
            <div className="mt-4 md:mt-8">
                <StationaryText
                    text="Noise dissolves until only the essential remains."
                    startDelay={0.9}
                    className="text-white/40 text-lg md:text-4xl font-light leading-snug md:leading-tight"
                />
            </div>
            <div className="mt-2 md:mt-4">
                <StationaryText
                    text="Exploration becomes synonymous with the discovery of the engine."
                    startDelay={1.4}
                    className="text-white/40 text-lg md:text-4xl font-light leading-snug md:leading-tight"
                />
            </div>
        </div>

        <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: CINEMATIC_EASE, delay: 1.5 }}
            className="mt-8 md:mt-16 flex items-center gap-4"
        >
            <div className="h-px w-16 bg-white/10" />
            <span className="text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">
                Intent
            </span>
        </motion.div>
    </div>
);

export default Slide4;

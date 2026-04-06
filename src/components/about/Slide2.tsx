import React from "react";
import { motion } from "framer-motion";
import { CINEMATIC_EASE, StationaryText } from "./Shared";

const Slide2: React.FC = () => (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center h-full">

        <div className="max-w-5xl">
            <StationaryText
                text="I bridge the gap between technical precision and creative expression,"
                startDelay={0.2}
                className="text-white text-2xl md:text-6xl font-roboto font-light leading-snug md:leading-tight"
            />
            <div className="mt-4">
                <StationaryText
                    text="building digital experiences that feel as good as they look."
                    startDelay={0.6}
                    className="text-white text-2xl md:text-6xl font-roboto font-light leading-snug md:leading-tight"
                />
            </div>
        </div>

        <motion.div
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: CINEMATIC_EASE, delay: 1.2 }}
            className="mt-8 md:mt-16 flex items-center gap-4"
        >
            <div className="h-px w-16 bg-white/10" />
            <span className="text-zinc-600 font-montserrat font-semibold text-[10px] tracking-[0.5em] uppercase">
                Philosophy
            </span>
        </motion.div>
    </div>
);

export default Slide2;

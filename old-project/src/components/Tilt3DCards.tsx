import React, { useRef } from "react";
import { motion } from "framer-motion";

const TiltCard = ({ title }: { title: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="h-48 w-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-blue-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm text-white font-bold text-xl flex items-center justify-center transition-transform duration-200 will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {title}
    </div>
  );
};

export default function Tilt3DCards() {
  const cards = ["Design", "Code", "Launch", "Learn", "Scale", "Repeat"];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-10 flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {cards.map((title, i) => (
          <TiltCard key={i} title={title} />
        ))}
      </div>
    </section>
  );
}

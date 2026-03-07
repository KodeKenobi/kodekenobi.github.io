import React from "react";
import { motion } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { FaGithub, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://github.com/kodekenobi",
    icon: <FaGithub className="w-6 h-6" />,
  },
  {
    href: "https://www.facebook.com/kodekenobi",
    icon: <FaFacebook className="w-6 h-6" />,
  },
  {
    href: "https://www.twitter.com/kodekenobi",
    icon: <FaTwitter className="w-6 h-6" />,
  },
  {
    href: "https://www.instagram.com/kodekenobi",
    icon: <FaInstagram className="w-6 h-6" />,
  },
];

const MAX_ROTATION = 35;
const MAX_LOOK_ROTATION = 65; // much more dramatic for non-hovered cards
const FLOAT_Z = 80; // px
const MAX_ICON_TRANSLATE = 24; // px, how far icons can move toward hovered card

const Footer = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  // Create refs for all cards
  const cardRefs = useMemo(
    () => socialLinks.map(() => React.createRef<HTMLDivElement>()),
    []
  );

  // Handler for hovered card
  const handleCardMouseMove = (index: number, e: React.MouseEvent) => {
    setHoveredIndex(index);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCardMouseLeave = () => {
    setHoveredIndex(null);
    setMousePos({ x: 0, y: 0 });
  };

  // Calculate tilt for each card
  const getTilt = (index: number): { rotateX: number; rotateY: number } => {
    if (hoveredIndex === null) return { rotateX: 0, rotateY: 0 };
    if (index === hoveredIndex) {
      // Hovered card: tilt based on mouse position
      const ref = cardRefs[index].current;
      if (!ref) return { rotateX: 0, rotateY: 0 };
      const rect = ref.getBoundingClientRect();
      const x = mousePos.x - rect.left;
      const y = mousePos.y - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / (rect.width / 2);
      const percentY = (y - centerY) / (rect.height / 2);
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      return {
        rotateX: -clamp(percentY) * MAX_ROTATION,
        rotateY: clamp(percentX) * MAX_ROTATION,
      };
    } else {
      // Other cards: tilt toward the hovered card, more dramatically
      const ref = cardRefs[index].current;
      const hoveredRef = cardRefs[hoveredIndex].current;
      if (!ref || !hoveredRef) return { rotateX: 0, rotateY: 0 };
      const rect = ref.getBoundingClientRect();
      const hoveredRect = hoveredRef.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const hoveredCenterX = hoveredRect.left + hoveredRect.width / 2;
      const hoveredCenterY = hoveredRect.top + hoveredRect.height / 2;
      // Direction vector from this card to hovered card
      const dx = hoveredCenterX - centerX;
      const dy = hoveredCenterY - centerY;
      // Normalize to [-1, 1] range
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      const percentX = Math.max(-1, Math.min(1, dx / maxDist));
      const percentY = Math.max(-1, Math.min(1, dy / maxDist));
      return {
        rotateX: percentY * MAX_LOOK_ROTATION,
        rotateY: percentX * MAX_LOOK_ROTATION,
      };
    }
  };

  // Calculate icon translation for each card
  const getIconTransform = (index: number): string => {
    if (hoveredIndex === null) return `scale(0.90)`;
    if (index === hoveredIndex) {
      // Hovered card: float up and centered
      return `translateZ(${FLOAT_Z}px) scale(0.90)`;
    } else {
      // Other cards: move toward hovered card
      const ref = cardRefs[index].current;
      const hoveredRef = cardRefs[hoveredIndex].current;
      if (!ref || !hoveredRef) return `scale(0.90)`;
      const rect = ref.getBoundingClientRect();
      const hoveredRect = hoveredRef.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const hoveredCenterX = hoveredRect.left + hoveredRect.width / 2;
      const hoveredCenterY = hoveredRect.top + hoveredRect.height / 2;
      // Direction vector from this card to hovered card
      const dx = hoveredCenterX - centerX;
      const dy = hoveredCenterY - centerY;
      // Normalize to [-1, 1] range
      const maxDist = Math.max(window.innerWidth, window.innerHeight) / 2;
      const percentX = Math.max(-1, Math.min(1, dx / maxDist));
      const percentY = Math.max(-1, Math.min(1, dy / maxDist));
      const tx = percentX * MAX_ICON_TRANSLATE;
      const ty = percentY * MAX_ICON_TRANSLATE;
      return `translateX(${tx}px) translateY(${ty}px) scale(0.90)`;
    }
  };

  return (
    <footer className="mt-16">
      <div className="flex flex-wrap justify-center gap-6">
        {socialLinks.map((link, index) => (
          <TiltCard
            key={index}
            href={link.href}
            delay={index * 0.15}
            tilt={getTilt(index)}
            isActive={hoveredIndex !== null}
            isHovered={hoveredIndex === index}
            refObj={cardRefs[index]}
            onMouseMove={(e) => handleCardMouseMove(index, e)}
            onMouseLeave={handleCardMouseLeave}
            cardIndex={index}
            getIconTransform={getIconTransform}
          >
            {link.icon}
          </TiltCard>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6 mb-8 text-center text-sm text-gray-400"
      >
        © {new Date().getFullYear()} kodekenobi. All rights reserved.
      </motion.div>
    </footer>
  );
};

const TiltCard = ({
  children,
  href,
  delay = 0,
  tilt,
  isActive,
  isHovered,
  refObj,
  onMouseMove,
  onMouseLeave,
  cardIndex,
  getIconTransform,
}: {
  children: React.ReactNode;
  href: string;
  delay?: number;
  tilt: { rotateX: number; rotateY: number };
  isActive: boolean;
  isHovered: boolean;
  refObj: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  cardIndex: number;
  getIconTransform: (index: number) => string;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        margin: "0.8rem",
        padding: 0,
      }}
    >
      <div
        ref={refObj}
        className={`relative rounded-full overflow-visible flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border shadow-md transition-shadow duration-200 ${
          isHovered ? "border-green-400 shadow-green-400/30" : "border-gray-700"
        }`}
        style={{
          width: 64,
          height: 64,
          transition: "transform 0.22s cubic-bezier(.23,1.02,.32,1)",
          transformStyle: "preserve-3d",
          boxShadow:
            isHovered && (tilt.rotateX !== 0 || tilt.rotateY !== 0)
              ? "0 20px 40px rgba(34, 197, 94, 0.4)"
              : "none",
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.05,1.05,1.05)`,
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseMove}
      >
        <div
          className="transition-transform duration-700 ease-out flex items-center justify-center"
          style={{
            transform: getIconTransform(cardIndex),
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>
      </div>
    </motion.a>
  );
};

export default Footer;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "classnames";
import SplashCursor from "./Animations/SplashCursor";

const navItems = [
  { name: "HOME", id: "home" },
  { name: "ABOUT", id: "about" },
  { name: "SKILLS", id: "skills" },
  { name: "EXPERIENCE", id: "experience" },
  { name: "PROJECTS", id: "projects" },
];

const menuVariants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
  exit: { opacity: 0, y: "-100%", transition: { duration: 0.4 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, rotateX: 90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5 },
  },
};

const lineVariants = {
  closed: {
    backgroundColor: "#3b82f6",
    width: "1.25rem",
    rotate: 0,
    y: 0,
    opacity: 1,
  },
  openTop: {
    backgroundColor: "#fff",
    width: "1.25rem",
    rotate: 45,
    y: 6,
    opacity: 1,
  },
  openMid: {
    backgroundColor: "#fff",
    width: "1.25rem",
    opacity: 0,
  },
  openBot: {
    backgroundColor: "#fff",
    width: "1.25rem",
    rotate: -45,
    y: -6,
    opacity: 1,
  },
  hover: {
    width: "1.5rem",
    backgroundColor: "#60a5fa",
  },
};

function GameFocusBorder({ children }: { children: React.ReactNode }) {
  const lineLength = 28;
  const lineThickness = 2;
  const glow = "0 0 8px 2px #22d3ee, 0 0 16px 4px #67e8f9";

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{
        minWidth: "1.5em",
        minHeight: "1.2em",
        padding: "0.2em 1.0em",
      }}
    >
      <span style={{ position: "absolute", left: 0, top: 0 }}>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 220 }}
          className="absolute"
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: lineThickness,
              height: lineLength,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: lineLength,
              height: lineThickness,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
        </motion.span>
      </span>
      <span style={{ position: "absolute", right: 0, bottom: 0 }}>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.35,
            type: "spring",
            stiffness: 220,
            delay: 0.15,
          }}
          className="absolute"
        >
          <span
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: lineLength,
              height: lineThickness,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: lineThickness,
              height: lineLength,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
        </motion.span>
      </span>
      <span className="relative z-10 flex items-center justify-center text-center font-extrabold text-4xl">
        {children}
      </span>
    </span>
  );
}

interface AnimatedNavbarProps {
  currentSection: string;
  onSectionChange: (sectionId: string) => void;
  disableBlur?: boolean;
  isScrolled?: boolean;
  isGoldLineActive?: boolean;
}

export default function AnimatedNavbar({
  currentSection,
  onSectionChange,
  disableBlur,
  isScrolled: externalScrolled,
  isGoldLineActive,
}: AnimatedNavbarProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isActuallyScrolled = externalScrolled || scrolled;

  // Intro Delay: Only show menu after 11.5s (After all Acts)
  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 7500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-50 font-sans text-white">
      {/* Intro Fade-In Wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showMenu ? 1 : 0 }}
        transition={{ duration: 1 }}
        className={`fixed top-0 left-0 w-full h-20 z-50 flex items-center transition-all duration-500
          ${disableBlur
            ? "bg-transparent backdrop-blur-0 border-none shadow-none"
            : isActuallyScrolled
              ? "backdrop-blur-3xl bg-black/95 shadow-2xl"
              : currentSection !== "home"
                ? "bg-black/60 backdrop-blur-md shadow-sm"
                : "bg-transparent backdrop-blur-0 border-none shadow-none"
          }`}
      >
        <div className="w-full h-full flex items-center justify-between px-8">
          {/* Logo on Left */}
          <button
            onClick={() => onSectionChange("home")}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/10 backdrop-blur-md hover:scale-105 transition-all duration-200 flex items-center justify-center group"
          >
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-8 w-auto transition-transform group-hover:scale-110"
            />
          </button>

          {/* Menu Button on Right */}
          <div className="flex items-center">
            <button
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md hover:scale-105 transition-all duration-200 flex items-center justify-center group"
              onClick={() => setOpen(!open)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              aria-label="Open menu"
            >
              <div className="flex flex-col items-center justify-center space-y-[3px]">
                <motion.span
                  className="block h-[2px] rounded"
                  animate={open ? "openTop" : hovered ? "hover" : "closed"}
                  variants={{
                    ...lineVariants,
                    closed: { ...lineVariants.closed, backgroundColor: "#ffffff" },
                    hover: { ...lineVariants.hover, backgroundColor: "#ffffff" }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.span
                  className="block h-[2px] rounded"
                  animate={open ? "openMid" : hovered ? "hover" : "closed"}
                  variants={{
                    ...lineVariants,
                    closed: { ...lineVariants.closed, backgroundColor: "#ffffff" },
                    hover: { ...lineVariants.hover, backgroundColor: "#ffffff" }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.span
                  className="block h-[2px] rounded"
                  animate={open ? "openBot" : hovered ? "hover" : "closed"}
                  variants={{
                    ...lineVariants,
                    closed: { ...lineVariants.closed, backgroundColor: "#ffffff" },
                    hover: { ...lineVariants.hover, backgroundColor: "#ffffff" }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Global Gold Line Animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isGoldLineActive ? 1 : 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.5)]"
        />
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-40"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              <SplashCursor key={open ? "open" : "closed"} paused={!open} />
              {navItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.2, rotateX: -10 }}
                  className={clsx(
                    "text-4xl sm:text-5xl font-extrabold uppercase tracking-widest my-3",
                    "transition-all hover:text-cyan-300 cursor-pointer"
                  )}
                  onClick={() => {
                    onSectionChange(item.id);
                    setOpen(false);
                  }}
                >
                  {currentSection === item.id ? (
                    <GameFocusBorder>{item.name}</GameFocusBorder>
                  ) : (
                    item.name
                  )}
                </motion.div>
              ))}
              <motion.button
                className="mt-12 text-sm text-blue-300 hover:text-white underline"
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.05 }}
              >
                Close
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Vertical Section Dots (Right Bottom) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: showMenu && !open ? 1 : 0,
          x: showMenu && !open ? 0 : 20
        }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed bottom-10 right-8 z-40 hidden md:flex flex-col gap-4 pointer-events-auto"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className="group flex items-center justify-end"
            aria-label={`Scroll to ${item.name}`}
          >
            {/* Label on Hover */}
            <span className="mr-4 text-xs font-mono tracking-widest text-white/0 group-hover:text-white/70 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
              {item.name}
            </span>

            {/* Square Dot */}
            <div
              className={clsx(
                "w-2.5 h-2.5 transition-all duration-300 transform",
                currentSection === item.id
                  ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  : "bg-white/20 hover:bg-white/50 hover:scale-110"
              )}
            />
          </button>
        ))}
      </motion.div>
    </div>
  );
}

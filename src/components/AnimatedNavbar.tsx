import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlobScene from "./BlobScene";
import clsx from "classnames";
import SplashCursor from "./SplashCursor/SplashCursor";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

const navItems = [
  { name: "Home", path: "/home" },
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  // { name: "Contact", path: "/contact" },
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

// Hamburger line animation variants
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

// GameFocusBorder component
function GameFocusBorder({ children }: { children: React.ReactNode }) {
  // Corner line length and thickness
  const lineLength = 28;
  const lineThickness = 2;
  const glow = "0 0 8px 2px #22d3ee, 0 0 16px 4px #67e8f9";

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{
        minWidth: "1.5em", // tweak as needed
        minHeight: "1.2em", // tweak as needed
        padding: "0.2em 1.0em", // tweak as needed
      }}
    >
      {/* Top Left */}
      <span style={{ position: "absolute", left: 0, top: 0 }}>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, type: "spring", stiffness: 220 }}
          className="absolute"
        >
          {/* Horizontal */}
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
          {/* Vertical */}
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
        </motion.span>
      </span>
      {/* Top Right */}
      <span style={{ position: "absolute", right: 0, top: 0 }}>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.35,
            type: "spring",
            stiffness: 220,
            delay: 0.05,
          }}
          className="absolute"
        >
          {/* Horizontal */}
          <span
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: lineLength,
              height: lineThickness,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
          {/* Vertical */}
          <span
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: lineThickness,
              height: lineLength,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
        </motion.span>
      </span>
      {/* Bottom Left */}
      <span style={{ position: "absolute", left: 0, bottom: 0 }}>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.35,
            type: "spring",
            stiffness: 220,
            delay: 0.1,
          }}
          className="absolute"
        >
          {/* Horizontal */}
          <span
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: lineLength,
              height: lineThickness,
              background: "#22d3ee",
              boxShadow: glow,
              borderRadius: 2,
            }}
          />
          {/* Vertical */}
          <span
            style={{
              position: "absolute",
              left: 0,
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
      {/* Bottom Right */}
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
          {/* Horizontal */}
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
          {/* Vertical */}
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
  disableBlur?: boolean;
}

export default function AnimatedNavbar({ disableBlur }: AnimatedNavbarProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentTab, setCurrentTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync currentTab with the current route
  React.useEffect(() => {
    const found = navItems.find((item) => item.path === location.pathname);
    if (found) setCurrentTab(found.name);
  }, [location.pathname]);

  // Track scroll position to toggle blur/background
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-50 font-sans text-white">
      {/* Blurred Navbar Bar */}
      <div
        className={`fixed top-0 left-0 w-full h-16 z-50 flex items-center transition-all duration-300
          ${
            disableBlur
              ? "bg-transparent backdrop-blur-0 border-none shadow-none"
              : scrolled
              ? "backdrop-blur-md bg-[rgba(20,30,50,0.7)] border-b border-blue-900/40 shadow-lg"
              : "bg-transparent backdrop-blur-0 border-none shadow-none"
          }`}
      >
        {/* Menu Button */}
        <div className="pl-5">
          <button
            className="w-9 h-9 rounded-full border-2 border-[#3b82f6] bg-white/10 backdrop-blur-md hover:scale-105 transition-all duration-200 flex items-center justify-center group"
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Open menu"
          >
            <div className="flex flex-col items-center justify-center space-y-[3px]">
              <motion.span
                className="block h-[2px] rounded"
                animate={open ? "openTop" : hovered ? "hover" : "closed"}
                variants={lineVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.span
                className="block h-[2px] rounded"
                animate={open ? "openMid" : hovered ? "hover" : "closed"}
                variants={lineVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.span
                className="block h-[2px] rounded"
                animate={open ? "openBot" : hovered ? "hover" : "closed"}
                variants={lineVariants}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
          </button>
        </div>
        {/* Add logo or nav links here if desired */}
      </div>
      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <BlobScene />
            </motion.div>
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
                  key={item.path}
                  variants={itemVariants}
                  whileHover={{ scale: 1.2, rotateX: -10 }}
                  className={clsx(
                    "text-4xl sm:text-5xl font-extrabold uppercase tracking-widest my-3",
                    "transition-all hover:text-cyan-300",
                    { "cursor-pointer": currentTab !== item.name }
                  )}
                  onClick={() => {
                    setCurrentTab(item.name);
                    setOpen(false);
                    navigate(item.path);
                  }}
                >
                  {currentTab === item.name ? (
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
    </div>
  );
}

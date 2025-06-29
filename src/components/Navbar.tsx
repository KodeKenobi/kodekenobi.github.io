import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    // { name: "Contact", path: "/contact" },
  ];

  const menuVariants = {
    closed: {
      y: -100,
      transition: {
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      y: 0,
      transition: {
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Glassy gradient overlay with 3D shadow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-b-3xl"
        // style={{
        //   background:
        //     "linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(200,255,220,0.18) 100%)",
        //   boxShadow:
        //     "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(80,255,180,0.12)",
        //   borderBottom: "2px solid rgba(80,255,180,0.18)",
        //   borderRight: "1px solid rgba(255,255,255,0.08)",
        //   borderLeft: "1px solid rgba(255,255,255,0.08)",
        //   backdropFilter: "blur(18px) saturate(1.2)",
        //   WebkitBackdropFilter: "blur(18px) saturate(1.2)",
        // }}
      />
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center"></div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => {
              const isCurrent = location.pathname === item.path;
              const linkClass = [
                "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
                "hover:bg-black hover:text-white",
                isCurrent
                  ? "bg-white/20 text-green-600 shadow-inner border border-green-400/30 shadow-green-200"
                  : "text-gray-900",
              ].join(" ");
              return (
                <motion.div
                  key={item.name}
                  whileHover={{
                    y: -4,
                    scale: 1.08,
                    rotateX: 8,
                    boxShadow:
                      "0 6px 24px 0 rgba(80,255,180,0.18), 0 1.5px 8px 0 rgba(80,255,180,0.12)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-block" }}
                >
                  <Link to={item.path} className={linkClass}>
                    {item.name}
                    {isCurrent && (
                      <span className="absolute left-1/2 -bottom-1 w-2 h-2 bg-green-400 rounded-full -translate-x-1/2 animate-pulse shadow-[0_0_8px_2px_rgba(80,255,180,0.5)]" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 p-2 rounded-lg text-white hover:text-green-400 hover:bg-white/10 focus:outline-none backdrop-blur"
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-6 h-6">
                {isOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 right-0 h-screen bg-white/20 backdrop-blur-lg md:hidden z-40 border-b border-white/10 shadow-xl rounded-b-3xl"
            style={{
              boxShadow:
                "0 12px 48px 0 rgba(31, 38, 135, 0.27), 0 2.5px 16px 0 rgba(80,255,180,0.12)",
              borderBottom: "2px solid rgba(80,255,180,0.18)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col h-full pt-24 pb-6 px-6">
              <div className="space-y-4">
                {navItems.map((item, i) => {
                  const isCurrent = location.pathname === item.path;
                  const linkClass = [
                    "relative block w-full px-6 py-4 rounded-xl text-xl font-medium transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
                    "hover:bg-black hover:text-white",
                    isCurrent
                      ? "bg-white/30 text-green-600 shadow-inner border border-green-400/30 shadow-green-200"
                      : "text-gray-900",
                  ].join(" ");
                  return (
                    <motion.div
                      key={item.name}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      whileHover={{
                        y: -2,
                        scale: 1.04,
                        rotateX: 6,
                        boxShadow:
                          "0 6px 24px 0 rgba(80,255,180,0.18), 0 1.5px 8px 0 rgba(80,255,180,0.12)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        to={item.path}
                        className={linkClass}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                        {isCurrent && (
                          <span className="absolute left-4 bottom-2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(80,255,180,0.5)]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

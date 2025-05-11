import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-300 hover:text-green-400"
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 p-2 rounded-lg text-gray-300 hover:text-green-400 hover:bg-gray-800/50 focus:outline-none transition-all duration-200"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <div
                  className={`absolute inset-0 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  {isOpen ? (
                    <FaTimes className="h-6 w-6" />
                  ) : (
                    <FaBars className="h-6 w-6" />
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900/95 backdrop-blur-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-4">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "bg-gray-800/50 text-green-400"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-green-400"
                } block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:scale-105`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  opacity: isOpen ? 1 : 0,
                  transform: `translateX(${isOpen ? 0 : 20}px)`,
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

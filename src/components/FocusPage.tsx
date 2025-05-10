import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import Focus from "./sections/Projects";

function FocusPage() {
  useEffect(() => {
    // Initialize AOS with modern settings
    AOS.init({
      duration: 1000,
      once: false,
      offset: 50,
      easing: "ease-out-cubic",
      mirror: true,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <Navbar />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <div className="flex-1 pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 opacity-20 animate-gradient"></div>
        <div className="w-full relative">
          {/* Terminal Window */}
          <div className="mt-4 terminal-window mx-auto shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fade-in px-4 sm:px-8 py-4 sm:py-6">
            <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base overflow-x-auto break-words">
              <div className="animate-fade-in">
                <div
                  className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center"
                  data-aos="fade-zoom-in"
                  data-aos-duration="1200"
                >
                  Focus Areas
                  <span className="animate-blink">_</span>
                </div>
                <Focus />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusPage;

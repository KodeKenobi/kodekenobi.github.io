import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import About from "./sections/About";
import Footer from "./Footer";
import AnimatedNavbar from "./AnimatedNavbar";
import CardsOnScroll from "./CardsOnScroll";
import WorkTimeline from "./WorkTimeline";
function AboutPage() {
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
      <AnimatedNavbar />
      <WorkTimeline />
      {/* Main Content - Add padding-top to account for fixed navbar */}
    </div>
  );
}

export default AboutPage;

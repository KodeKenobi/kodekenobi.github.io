import { useState, useEffect, useRef } from "react";
import AnimatedHero from "./components/AnimatedHero";
import MobileAnimatedHero from "./components/MobileAnimatedHero";
import AnimatedNavbar from "./components/AnimatedNavbar";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";

const sections = [
  { id: "home", name: "HOME" },
  { id: "about", name: "ABOUT" },
  { id: "skills", name: "SKILLS" },
  { id: "experience", name: "EXPERIENCE" },
  { id: "projects", name: "PROJECTS" },
];

const ABOUT_TOTAL_SLIDES = 5;

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [aboutSlide, setAboutSlide] = useState(0);
  const [aboutDirection, setAboutDirection] = useState(1); // 1 = forward (from right), -1 = backward (from left)

  const [experienceSlide, setExperienceSlide] = useState(0);
  const [experienceDirection, setExperienceDirection] = useState(1);
  const experienceSlideRef = useRef(0);

  const [skillsSlide, setSkillsSlide] = useState(0);
  const [skillsDirection, setSkillsDirection] = useState(1);
  const [skillsExperienceProgress, setSkillsExperienceProgress] = useState(0); // 0 to 100
  const skillsSlideRef = useRef(0);
  const skillsExperienceProgressRef = useRef(0);
  const SKILLS_TOTAL_SLIDES = 3; // desktop; mobile uses 4 (Engineering split into 2)
  const isMobileRef = useRef(false);

  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const [isProjectsScrolled, setIsProjectsScrolled] = useState(false);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const currentSectionRef = useRef("home");
  const scrollAccumulatorRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const aboutSlideRef = useRef(0);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const heroAnimDoneRef = useRef(false);

  const [isPreviewInteracting, setIsPreviewInteracting] = useState(false);
  const isPreviewInteractingRef = useRef(false);
  const [isSkillsScrolled, setIsSkillsScrolled] = useState(false);
  const [isHeaderGoldLineActive, setIsHeaderGoldLineActive] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keep ref in sync for event listener
  useEffect(() => {
    isPreviewInteractingRef.current = isPreviewInteracting;
  }, [isPreviewInteracting]);

  // Unlock scrolling after hero animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      heroAnimDoneRef.current = true;
    }, 7500);
    return () => clearTimeout(timer);
  }, []);

  const showSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    currentSectionRef.current = sectionId;
    // Reset about slide when navigating to about via menu
    if (sectionId === "about") {
      setAboutSlide(0);
      aboutSlideRef.current = 0;
      setAboutDirection(1);
    }
  };

  const lockScroll = (durationMs = 800) => {
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, durationMs);
  };

  const navigateSection = (direction: number) => {
    const currentIndex = sections.findIndex(
      (s) => s.id === currentSectionRef.current
    );
    const nextIndex = direction > 0
      ? Math.min(currentIndex + 1, sections.length - 1)
      : Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      lockScroll(1200);
      const nextSection = sections[nextIndex].id;
      setCurrentSection(nextSection);
      currentSectionRef.current = nextSection;
      // Reset about slide when entering about
      if (nextSection === "about") {
        const slideTarget = direction > 0 ? 0 : ABOUT_TOTAL_SLIDES - 1;
        setAboutSlide(slideTarget);
        aboutSlideRef.current = slideTarget;
        setAboutDirection(direction);
      }

      // Reset skills slide when entering skills
      if (nextSection === "skills") {
        const maxSkillsSlide = isMobileRef.current ? 3 : 2;
        const slideTarget = direction > 0 ? 0 : maxSkillsSlide;
        setSkillsSlide(slideTarget);
        skillsSlideRef.current = slideTarget;
        setSkillsDirection(direction);
      }

      // Reset experience slide when entering experience
      if (nextSection === "experience") {
        const slideTarget = direction > 0 ? 0 : 1;
        setExperienceSlide(slideTarget);
        experienceSlideRef.current = slideTarget;
        setExperienceDirection(direction);
      }
    }
  };

  useEffect(() => {
    const handleWheelEvent = (e: Event) => {
      // Block during hero animation
      if (!heroAnimDoneRef.current) {
        e.preventDefault();
        return;
      }
      // Block during transition
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }
      // Block if interacting with code preview
      if (isPreviewInteractingRef.current) {
        return;
      }

      const wheelEvent = e as WheelEvent;
      const scrollingDown = wheelEvent.deltaY > 0;
      const current = currentSectionRef.current;

      const now = Date.now();
      if (now - lastWheelTimeRef.current > 250) {
        scrollAccumulatorRef.current = 0;
      }
      lastWheelTimeRef.current = now;
      scrollAccumulatorRef.current += wheelEvent.deltaY;

      // HOME — any scroll triggers section change
      if (current === "home") {
        e.preventDefault();
        if (scrollingDown) {
          navigateSection(1);
        }
        return;
      }

      // ABOUT — horizontal slides
      if (current === "about") {
        e.preventDefault();
        const slide = aboutSlideRef.current;

        if (scrollingDown) {
          if (slide < ABOUT_TOTAL_SLIDES - 1) {
            // Next horizontal slide
            const next = slide + 1;
            setAboutDirection(1);
            setAboutSlide(next);
            aboutSlideRef.current = next;
            lockScroll(800);
          } else {
            // Last slide, go to Skills
            navigateSection(1);
          }
        } else {
          if (slide > 0) {
            // Previous horizontal slide
            const prev = slide - 1;
            setAboutDirection(-1);
            setAboutSlide(prev);
            aboutSlideRef.current = prev;
            lockScroll(800);
          } else {
            // First slide, go to Home
            navigateSection(-1);
          }
        }
        return;
      }

      // SKILLS — Slides 0 to 2 (desktop) or 0 to 3 (mobile)
      if (current === "skills") {
        const slide = skillsSlideRef.current;
        const maxSlide = isMobileRef.current ? 3 : 2;

        e.preventDefault();

        if (scrollingDown) {
          if (slide < maxSlide) {
            setSkillsDirection(1);
            const nextSlide = slide + 1;
            setSkillsSlide(nextSlide);
            skillsSlideRef.current = nextSlide;
            lockScroll(800);
          } else {
            // End of section
            if (scrollAccumulatorRef.current > 120) {
              scrollAccumulatorRef.current = 0;
              navigateSection(1);
            }
          }
        } else {
          if (slide > 0) {
            setSkillsDirection(-1);
            const nextSlide = slide - 1;
            setSkillsSlide(nextSlide);
            skillsSlideRef.current = nextSlide;
            lockScroll(800);
          } else {
            // Start of section
            if (scrollAccumulatorRef.current < -120) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        }
        return;
      }

      // EXPERIENCE
      if (current === "experience") {
        e.preventDefault();
        const slide = experienceSlideRef.current;

        if (slide === 0) {
          if (scrollingDown) {
            if (scrollAccumulatorRef.current > 200) {
              scrollAccumulatorRef.current = 0;
              setExperienceDirection(1);
              setExperienceSlide(1);
              experienceSlideRef.current = 1;
              lockScroll(800);
            }
          } else {
            if (scrollAccumulatorRef.current < -200) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
          return;
        }

        // Timeline logic (slide 1)
        const currentProgress = skillsExperienceProgressRef.current;
        const delta = wheelEvent.deltaY * 0.05; // Sensitivity
        const nextProgress = Math.min(Math.max(0, currentProgress + delta), 100);

        if (scrollingDown) {
          if (currentProgress < 100) {
            setSkillsExperienceProgress(nextProgress);
            skillsExperienceProgressRef.current = nextProgress;
            return;
          }
          if (scrollAccumulatorRef.current > 250) {
            scrollAccumulatorRef.current = 0;
            navigateSection(1);
          }
        } else {
          if (currentProgress > 0) {
            setSkillsExperienceProgress(nextProgress);
            skillsExperienceProgressRef.current = nextProgress;
            return;
          }
          if (scrollAccumulatorRef.current < -250) {
            scrollAccumulatorRef.current = 0;
            setExperienceDirection(-1);
            setExperienceSlide(0);
            experienceSlideRef.current = 0;
            lockScroll(800);
          }
        }
        return;
      }

      // PROJECTS — vertical scrolling
      if (current === "projects") {
        const container = projectsContainerRef.current;
        if (!container) return;

        if (scrollingDown) {
          // Native scroll
          return;
        } else {
          // Scroll up
          if (container.scrollTop > 5) {
            // Native scroll
            return;
          } else {
            // Reached the top, block scroll to trigger back navigation safely
            e.preventDefault();
            if (scrollAccumulatorRef.current < -200) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        }
        return;
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      scrollAccumulatorRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!heroAnimDoneRef.current || isScrollingRef.current || isPreviewInteractingRef.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const scrollingDown = deltaY > 0;
      const current = currentSectionRef.current;

      if (current === "projects") {
        const container = projectsContainerRef.current;
        if (!container) return;
        if (!scrollingDown && container.scrollTop <= 5) {
          if (e.cancelable) e.preventDefault();
          scrollAccumulatorRef.current += deltaY;
          if (scrollAccumulatorRef.current < -100) {
            scrollAccumulatorRef.current = 0;
            navigateSection(-1);
          }
        }
      }

      if (current === "skills") {
        const slide = skillsSlideRef.current;
        const maxSlide = isMobileRef.current ? 3 : 2;

        if (e.cancelable) e.preventDefault();
        if (scrollingDown) {
          if (slide < maxSlide) {
            setSkillsDirection(1);
            const nextSlide = slide + 1;
            setSkillsSlide(nextSlide);
            skillsSlideRef.current = nextSlide;
            lockScroll(800);
          } else {
            // Last slide: swipe to next section
            scrollAccumulatorRef.current += deltaY;
            if (scrollAccumulatorRef.current > 100) {
              scrollAccumulatorRef.current = 0;
              navigateSection(1);
            }
          }
        } else {
          if (slide > 0) {
            setSkillsDirection(-1);
            const nextSlide = slide - 1;
            setSkillsSlide(nextSlide);
            skillsSlideRef.current = nextSlide;
            lockScroll(800);
          } else {
            scrollAccumulatorRef.current += deltaY;
            if (scrollAccumulatorRef.current < -100) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        }
      }

      if (current === "experience") {
        if (e.cancelable) e.preventDefault();
        const slide = experienceSlideRef.current;

        if (slide === 0) {
          if (scrollingDown) {
            scrollAccumulatorRef.current += deltaY;
            if (scrollAccumulatorRef.current > 100) {
              scrollAccumulatorRef.current = 0;
              setExperienceDirection(1);
              setExperienceSlide(1);
              experienceSlideRef.current = 1;
              lockScroll(800);
            }
          } else {
            scrollAccumulatorRef.current += deltaY;
            if (scrollAccumulatorRef.current < -100) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
          return;
        }

        const currentProgress = skillsExperienceProgressRef.current;
        const deltaProgress = deltaY * 0.05;
        const nextProgress = Math.min(Math.max(0, currentProgress + deltaProgress), 100);

        if (scrollingDown) {
          if (currentProgress < 100) {
            setSkillsExperienceProgress(nextProgress);
            skillsExperienceProgressRef.current = nextProgress;
          } else {
            scrollAccumulatorRef.current += deltaY;
            if (scrollAccumulatorRef.current > 100) {
              scrollAccumulatorRef.current = 0;
              navigateSection(1);
            }
          }
        } else {
          if (currentProgress > 0) {
            setSkillsExperienceProgress(nextProgress);
            skillsExperienceProgressRef.current = nextProgress;
          } else {
            scrollAccumulatorRef.current += deltaY;
            if (scrollAccumulatorRef.current < -100) {
              scrollAccumulatorRef.current = 0;
              setExperienceDirection(-1);
              setExperienceSlide(0);
              experienceSlideRef.current = 0;
              lockScroll(800);
            }
          }
        }
      }
    };

    document.addEventListener("wheel", handleWheelEvent, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheelEvent);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Monitor Skills container scroll for header blur
  useEffect(() => {
    const container = skillsContainerRef.current;
    if (!container) return;

    const handleContainerScroll = () => {
      setIsSkillsScrolled(container.scrollTop > 20);
    };

    container.addEventListener("scroll", handleContainerScroll);
    return () => container.removeEventListener("scroll", handleContainerScroll);
  }, [currentSection]);

  // Monitor Projects container scroll for header blur
  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const handleContainerScroll = () => {
      setIsProjectsScrolled(container.scrollTop > 20);
    };

    container.addEventListener("scroll", handleContainerScroll);
    return () => container.removeEventListener("scroll", handleContainerScroll);
  }, [currentSection]);

  useEffect(() => {
    // Section-specific logic
  }, [currentSection]);

  return (
    <div className="relative bg-[#050505] min-h-screen overflow-hidden">

      {/* Navigation */}
      <AnimatedNavbar
        currentSection={currentSection}
        onSectionChange={showSection}
        isScrolled={isSkillsScrolled || isProjectsScrolled}
        isGoldLineActive={isHeaderGoldLineActive}
      />

      {/* Main Content */}
      <div className="scroll-container relative z-10 w-full h-screen pt-20 overflow-hidden">
        {/* Home Section */}
        <section
          className="absolute inset-0"
          style={{
            opacity: currentSection === "home" ? 1 : 0,
            pointerEvents: currentSection === "home" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          {isMobile ? <MobileAnimatedHero /> : <AnimatedHero />}
        </section>

        {/* About Section — no overflow, horizontal slides handled internally */}
        <section
          className="absolute inset-0 bg-[#050505] overflow-hidden"
          style={{
            opacity: currentSection === "about" ? 1 : 0,
            pointerEvents: currentSection === "about" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <About
            slideIndex={aboutSlide}
            direction={aboutDirection}
            isActive={currentSection === "about"}
            onSlideChange={(index, dir) => {
              setAboutDirection(dir);
              setAboutSlide(index);
              aboutSlideRef.current = index;
            }}
            onSlide5Action={setIsHeaderGoldLineActive}
          />
        </section>

        <section
          className={`absolute inset-0 bg-[#050505] snap-start snap-always no-scrollbar overflow-hidden`}
          ref={skillsContainerRef}
          style={{
            opacity: currentSection === "skills" ? 1 : 0,
            pointerEvents: currentSection === "skills" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <Skills
            isMobile={isMobile}
            slideIndex={skillsSlide}
            direction={skillsDirection}
            isActive={currentSection === "skills"}
            onInteractionChange={setIsPreviewInteracting}
            onSlideChange={(index, dir) => {
              setSkillsDirection(dir);
              setSkillsSlide(index);
              skillsSlideRef.current = index;
            }}
          />
        </section>

        {/* Experience Section */}
        <section
          className={`absolute inset-0 bg-[#050505] snap-start snap-always no-scrollbar overflow-hidden`}
          style={{
            opacity: currentSection === "experience" ? 1 : 0,
            pointerEvents: currentSection === "experience" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <Experience
            isMobile={isMobile}
            slideIndex={experienceSlide}
            direction={experienceDirection}
            progress={skillsExperienceProgress}
          />
        </section>

        {/* Projects Section */}
        <section
          className={`absolute inset-0 bg-[#050505] snap-start snap-always no-scrollbar overflow-y-auto`}
          ref={projectsContainerRef}
          style={{
            opacity: currentSection === "projects" ? 1 : 0,
            pointerEvents: currentSection === "projects" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <Projects isActive={currentSection === "projects"} />
        </section>

      </div>
    </div>
  );
}

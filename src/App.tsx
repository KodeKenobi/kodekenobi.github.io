import { useState, useEffect, useRef } from "react";
import AnimatedHero from "./components/AnimatedHero";
import MobileAnimatedHero from "./components/MobileAnimatedHero";
import AnimatedNavbar from "./components/AnimatedNavbar";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import { soundEngine } from "./lib/SoundEngine";

const sections = [
  { id: "home", name: "HOME" },
  { id: "about", name: "ABOUT" },
  { id: "skills", name: "SKILLS" },
  { id: "experience", name: "EXPERIENCE" },
  { id: "projects", name: "PROJECTS" },
];

const ABOUT_TOTAL_SLIDES = 5;
const SKILLS_TOTAL_SLIDES = 3;
const PROJECTS_TOTAL_SLIDES = 2; // NEW: Slide 0 (Intro), Slide 1 (Grid)

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const [aboutSlide, setAboutSlide] = useState(0);
  const [aboutDirection, setAboutDirection] = useState(1);

  const [experienceSlide, setExperienceSlide] = useState(0);
  const [experienceDirection, setExperienceDirection] = useState(1);
  const experienceSlideRef = useRef(0);

  const [skillsSlide, setSkillsSlide] = useState(0);
  const [skillsDirection, setSkillsDirection] = useState(1);
  const [skillsExperienceProgress, setSkillsExperienceProgress] = useState(0);
  const skillsSlideRef = useRef(0);
  const skillsExperienceProgressRef = useRef(0);

  const [projectsSlide, setProjectsSlide] = useState(0);
  const [projectsDirection, setProjectsDirection] = useState(1);
  const projectsSlideRef = useRef(0);

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

  useEffect(() => {
    isPreviewInteractingRef.current = isPreviewInteracting;
  }, [isPreviewInteracting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      heroAnimDoneRef.current = true;
    }, 7500);
    return () => clearTimeout(timer);
  }, []);

  const showSection = (sectionId: string) => {
    // Initialize sound engine on user gesture and play click
    soundEngine.init();
    soundEngine.playClick();

    setCurrentSection(sectionId);
    currentSectionRef.current = sectionId;
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
      (s) => s.id === currentSectionRef.current,
    );
    const nextIndex =
      direction > 0
        ? Math.min(currentIndex + 1, sections.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      // Initialize sound engine on user gesture
      soundEngine.init();
      
      lockScroll(1200);
      const nextSection = sections[nextIndex].id;
      setCurrentSection(nextSection);
      currentSectionRef.current = nextSection;

      if (nextSection === "about") {
        const slideTarget = direction > 0 ? 0 : ABOUT_TOTAL_SLIDES - 1;
        setAboutSlide(slideTarget);
        aboutSlideRef.current = slideTarget;
        setAboutDirection(direction);
      }
      if (nextSection === "skills") {
        const slideTarget = direction > 0 ? 0 : SKILLS_TOTAL_SLIDES - 1;
        setSkillsSlide(slideTarget);
        skillsSlideRef.current = slideTarget;
        setSkillsDirection(direction);
      }
      if (nextSection === "experience") {
        const slideTarget = direction > 0 ? 0 : 1;
        setExperienceSlide(slideTarget);
        experienceSlideRef.current = slideTarget;
        setExperienceDirection(direction);
      }
      if (nextSection === "projects") {
        const slideTarget = direction > 0 ? 0 : PROJECTS_TOTAL_SLIDES - 1;
        setProjectsSlide(slideTarget);
        projectsSlideRef.current = slideTarget;
        setProjectsDirection(direction);
      }
    }
  };

  useEffect(() => {
    const handleWheelEvent = (e: Event) => {
      if (
        !heroAnimDoneRef.current ||
        isScrollingRef.current ||
        isPreviewInteractingRef.current
      ) {
        if (!isPreviewInteractingRef.current) e.preventDefault();
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

      if (current === "home") {
        e.preventDefault();
        if (scrollingDown) navigateSection(1);
        return;
      }

      if (current === "about") {
        e.preventDefault();
        const slide = aboutSlideRef.current;
        if (scrollingDown) {
          if (slide < ABOUT_TOTAL_SLIDES - 1) {
            const next = slide + 1;
            setAboutDirection(1);
            setAboutSlide(next);
            aboutSlideRef.current = next;
            lockScroll(800);
          } else {
            navigateSection(1);
          }
        } else {
          if (slide > 0) {
            const prev = slide - 1;
            setAboutDirection(-1);
            setAboutSlide(prev);
            aboutSlideRef.current = prev;
            lockScroll(800);
          } else {
            navigateSection(-1);
          }
        }
        return;
      }

      if (current === "skills") {
        const slide = skillsSlideRef.current;
        const maxSlide = SKILLS_TOTAL_SLIDES - 1;

        if (slide > 0) {
          const container =
            skillsContainerRef.current?.querySelector(".overflow-y-auto");
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const isAtTop = scrollTop <= 2;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;

            if (scrollingDown && !isAtBottom) return; // Let native scroll happen
            if (!scrollingDown && !isAtTop) return; // Let native scroll happen
          }
        }

        e.preventDefault();
        if (scrollingDown) {
          if (slide < maxSlide) {
            setSkillsDirection(1);
            const nextSlide = slide + 1;
            setSkillsSlide(nextSlide);
            skillsSlideRef.current = nextSlide;
            lockScroll(800);
          } else {
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
            if (scrollAccumulatorRef.current < -120) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        }
        return;
      }

      if (current === "experience") {
        const slide = experienceSlideRef.current;
        if (slide === 1 && isMobileRef.current) {
          const container = document.getElementById(
            "mobile-experience-timeline",
          );
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const atTop = scrollTop <= 5;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (scrollingDown && !atBottom) return; // Let native scroll happen
            if (!scrollingDown && !atTop) return; // Let native scroll happen
          }
        }

        if (slide === 0) {
          e.preventDefault();
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

        if (isMobileRef.current) {
          // Mobile native scroll boundary detection
          const container = document.getElementById(
            "mobile-experience-timeline",
          );
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const atTop = scrollTop <= 5;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (atTop && !scrollingDown) {
              e.preventDefault();
              if (scrollAccumulatorRef.current < -200) {
                scrollAccumulatorRef.current = 0;
                setExperienceDirection(-1);
                setExperienceSlide(0);
                experienceSlideRef.current = 0;
                lockScroll(800);
              }
            } else if (atBottom && scrollingDown) {
              e.preventDefault();
              if (scrollAccumulatorRef.current > 200) {
                scrollAccumulatorRef.current = 0;
                navigateSection(1);
              }
            } else {
              scrollAccumulatorRef.current = 0;
            }
          }
        } else {
          // Desktop virtual scroll
          e.preventDefault();
          const currentProgress = skillsExperienceProgressRef.current;
          const delta = wheelEvent.deltaY * 0.05;
          const nextProgress = Math.min(
            Math.max(0, currentProgress + delta),
            100,
          );
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
        }
        return;
      }

      if (current === "projects") {
        const slide = projectsSlideRef.current;
        const threshold = 200; // Increased feel of intentionality

        if (slide === 1) {
          const container = document.getElementById("projects-grid");
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const atTop = scrollTop <= 5;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (scrollingDown && !atBottom) return; // Let native scroll happen
            if (!scrollingDown && !atTop) return; // Let native scroll happen

            if (atTop && !scrollingDown) {
              e.preventDefault();
              if (scrollAccumulatorRef.current < -threshold) {
                scrollAccumulatorRef.current = 0;
                setProjectsDirection(-1);
                setProjectsSlide(0);
                projectsSlideRef.current = 0;
                lockScroll(800);
              }
            }
          }
        } else {
          e.preventDefault();
          if (scrollingDown) {
            if (scrollAccumulatorRef.current > threshold) {
              scrollAccumulatorRef.current = 0;
              setProjectsDirection(1);
              setProjectsSlide(1);
              projectsSlideRef.current = 1;
              lockScroll(800);
            }
          } else {
            if (scrollAccumulatorRef.current < -threshold) {
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
      // Initialize sound engine on user gesture
      soundEngine.init();

      if (
        !heroAnimDoneRef.current ||
        isScrollingRef.current ||
        isPreviewInteractingRef.current
      )
        return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const scrollingDown = deltaY > 0;
      const current = currentSectionRef.current;

      if (current === "projects") {
        const slide = projectsSlideRef.current;
        const threshold = 60; // Sensitive but intentional for touch
        if (slide === 0) {
          if (e.cancelable) e.preventDefault();
          scrollAccumulatorRef.current += deltaY;
          if (scrollingDown) {
            if (scrollAccumulatorRef.current > threshold) {
              setProjectsDirection(1);
              setProjectsSlide(1);
              projectsSlideRef.current = 1;
              scrollAccumulatorRef.current = 0;
              lockScroll(600);
            }
          } else {
            if (scrollAccumulatorRef.current < -threshold) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        } else {
          const container = document.getElementById("projects-grid");
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const atTop = scrollTop <= 5;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (atTop && !scrollingDown) {
              if (e.cancelable) e.preventDefault();
              scrollAccumulatorRef.current += deltaY;
              if (scrollAccumulatorRef.current < -threshold) {
                setProjectsDirection(-1);
                setProjectsSlide(0);
                projectsSlideRef.current = 0;
                scrollAccumulatorRef.current = 0;
                lockScroll(600);
              }
            } else if (atBottom && scrollingDown) {
              // Standard behavior: allow exit to next section if needed,
              // but user requested "vertical scroll on mobile and desktop",
              // implying they might want to stay in repos more easily.
              // For now, let's keep it similar to Experience section's atBottom logic.
              if (e.cancelable) e.preventDefault();
              scrollAccumulatorRef.current += deltaY;
              if (scrollAccumulatorRef.current > 80) {
                // Slightly harder to leave accidentally
                scrollAccumulatorRef.current = 0;
                navigateSection(1);
              }
            } else {
              scrollAccumulatorRef.current = 0;
            }
          }
        }
        return;
      }

      if (current === "home") {
        if (e.cancelable) e.preventDefault();
        scrollAccumulatorRef.current += deltaY;
        if (
          Math.abs(deltaY) > 50 ||
          Math.abs(scrollAccumulatorRef.current) > 50
        ) {
          if (scrollingDown) {
            scrollAccumulatorRef.current = 0;
            navigateSection(1);
          }
        }
        return;
      }

      if (current === "about") {
        if (e.cancelable) e.preventDefault();
        const slide = aboutSlideRef.current;
        scrollAccumulatorRef.current += deltaY;
        const threshold = 40;
        if (scrollingDown) {
          if (slide < ABOUT_TOTAL_SLIDES - 1) {
            if (scrollAccumulatorRef.current > threshold) {
              setAboutDirection(1);
              const next = slide + 1;
              setAboutSlide(next);
              aboutSlideRef.current = next;
              scrollAccumulatorRef.current = 0;
              lockScroll(500);
            }
          } else {
            if (scrollAccumulatorRef.current > 60) {
              scrollAccumulatorRef.current = 0;
              navigateSection(1);
            }
          }
        } else {
          if (slide > 0) {
            if (scrollAccumulatorRef.current < -threshold) {
              setAboutDirection(-1);
              const prev = slide - 1;
              setAboutSlide(prev);
              aboutSlideRef.current = prev;
              scrollAccumulatorRef.current = 0;
              lockScroll(500);
            }
          } else {
            if (scrollAccumulatorRef.current < -60) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        }
        return;
      }

      if (current === "skills") {
        const slide = skillsSlideRef.current;
        const maxSlide = SKILLS_TOTAL_SLIDES - 1;
        const threshold = 40;
        if (slide === 0) {
          if (e.cancelable) e.preventDefault();
          scrollAccumulatorRef.current += deltaY;
          if (scrollingDown) {
            if (scrollAccumulatorRef.current > threshold) {
              setSkillsDirection(1);
              setSkillsSlide(1);
              skillsSlideRef.current = 1;
              scrollAccumulatorRef.current = 0;
              lockScroll(500);
            }
          } else {
            if (scrollAccumulatorRef.current < -threshold) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
        } else {
          const container =
            skillsContainerRef.current?.querySelector(".overflow-y-auto");
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const isAtTop = scrollTop <= 2;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2;
            if (isAtTop && !scrollingDown && deltaY < -threshold) {
              setSkillsDirection(-1);
              setSkillsSlide(slide - 1);
              skillsSlideRef.current = slide - 1;
              scrollAccumulatorRef.current = 0;
              if (e.cancelable) e.preventDefault();
              lockScroll(500);
            } else if (isAtBottom && scrollingDown && deltaY > threshold) {
              if (slide < maxSlide) {
                setSkillsDirection(1);
                setSkillsSlide(slide + 1);
                skillsSlideRef.current = slide + 1;
                scrollAccumulatorRef.current = 0;
                if (e.cancelable) e.preventDefault();
                lockScroll(500);
              } else {
                scrollAccumulatorRef.current = 0;
                navigateSection(1);
                if (e.cancelable) e.preventDefault();
              }
            } else {
              scrollAccumulatorRef.current = 0;
            }
          }
        }
        return;
      }

      if (current === "experience") {
        const slide = experienceSlideRef.current;
        if (slide === 0) {
          if (e.cancelable) e.preventDefault();
          scrollAccumulatorRef.current += deltaY;
          if (scrollingDown) {
            if (scrollAccumulatorRef.current > 50 || Math.abs(deltaY) > 60) {
              scrollAccumulatorRef.current = 0;
              setExperienceDirection(1);
              setExperienceSlide(1);
              experienceSlideRef.current = 1;
              lockScroll(600);
            }
          } else {
            if (scrollAccumulatorRef.current < -60) {
              scrollAccumulatorRef.current = 0;
              navigateSection(-1);
            }
          }
          return;
        }

        if (isMobileRef.current) {
          // Mobile native scroll for Experience Timeline
          const container = document.getElementById(
            "mobile-experience-timeline",
          );
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } =
              container as HTMLElement;
            const atTop = scrollTop <= 5;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

            if (atTop && !scrollingDown) {
              if (e.cancelable) e.preventDefault();
              scrollAccumulatorRef.current += deltaY;
              if (scrollAccumulatorRef.current < -60) {
                scrollAccumulatorRef.current = 0;
                setExperienceDirection(-1);
                setExperienceSlide(0);
                experienceSlideRef.current = 0;
                lockScroll(600);
              }
            } else if (atBottom && scrollingDown) {
              if (e.cancelable) e.preventDefault();
              scrollAccumulatorRef.current += deltaY;
              if (scrollAccumulatorRef.current > 60) {
                scrollAccumulatorRef.current = 0;
                navigateSection(1);
              }
            } else {
              scrollAccumulatorRef.current = 0;
            }
          }
        } else {
          // Desktop virtual scroll
          if (e.cancelable) e.preventDefault();
          scrollAccumulatorRef.current += deltaY;
          const currentProgress = skillsExperienceProgressRef.current;
          const sensitivity = 0.05;
          const nextProgress = Math.min(
            Math.max(0, currentProgress + deltaY * sensitivity),
            100,
          );
          if (scrollingDown) {
            if (currentProgress < 100) {
              setSkillsExperienceProgress(nextProgress);
              skillsExperienceProgressRef.current = nextProgress;
              scrollAccumulatorRef.current = 0;
            } else {
              if (scrollAccumulatorRef.current > 60) {
                scrollAccumulatorRef.current = 0;
                navigateSection(1);
              }
            }
          } else {
            if (currentProgress > 0) {
              setSkillsExperienceProgress(nextProgress);
              skillsExperienceProgressRef.current = nextProgress;
              scrollAccumulatorRef.current = 0;
            } else {
              if (scrollAccumulatorRef.current < -60) {
                scrollAccumulatorRef.current = 0;
                setExperienceDirection(-1);
                setExperienceSlide(0);
                experienceSlideRef.current = 0;
                lockScroll(600);
              }
            }
          }
        }
        return;
      }
    };

    document.addEventListener("wheel", handleWheelEvent, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheelEvent);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const container = skillsContainerRef.current;
    if (!container) return;
    const handleContainerScroll = () => {
      setIsSkillsScrolled(container.scrollTop > 20);
    };
    container.addEventListener("scroll", handleContainerScroll);
    return () => container.removeEventListener("scroll", handleContainerScroll);
  }, [currentSection]);

  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;
    const handleContainerScroll = () => {
      setIsProjectsScrolled(container.scrollTop > 20);
    };
    container.addEventListener("scroll", handleContainerScroll);
    return () => container.removeEventListener("scroll", handleContainerScroll);
  }, [currentSection]);

  return (
    <div className="relative bg-[#050505] h-[100dvh] w-full overflow-hidden">
      <AnimatedNavbar
        currentSection={currentSection}
        onSectionChange={showSection}
        isScrolled={isSkillsScrolled || isProjectsScrolled}
        isGoldLineActive={isHeaderGoldLineActive}
      />
      <div className="scroll-container relative z-10 w-full h-full pt-20 overflow-hidden">
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
          className={`absolute inset-0 bg-[#050505] no-scrollbar overflow-hidden`}
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
        <section
          className={`absolute inset-0 bg-[#050505] no-scrollbar overflow-hidden`}
          style={{
            opacity: currentSection === "experience" ? 1 : 0,
            pointerEvents: currentSection === "experience" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <Experience
            isActive={currentSection === "experience"}
            isMobile={isMobile}
            slideIndex={experienceSlide}
            direction={experienceDirection}
            progress={skillsExperienceProgress}
          />
        </section>
        <section
          className={`absolute inset-0 bg-[#050505] no-scrollbar overflow-hidden`}
          ref={projectsContainerRef}
          style={{
            opacity: currentSection === "projects" ? 1 : 0,
            pointerEvents: currentSection === "projects" ? "auto" : "none",
            transition: "opacity 0.6s ease-in-out",
          }}
        >
          <Projects
            isActive={currentSection === "projects"}
            isMobile={isMobile}
            slideIndex={projectsSlide}
            direction={projectsDirection}
          />
        </section>
      </div>
    </div>
  );
}

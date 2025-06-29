import { useEffect, useState, useCallback, useRef } from "react";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaDocker,
  FaCloud,
  FaTools,
  FaGitAlt,
  FaServer,
} from "react-icons/fa";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import Hero from "./Hero";
// import ModelViewer from "./ModelViewer/ModelViewer";
import AnimatedNavbar from "./AnimatedNavbar";
import TextPressure from "./TextPressure/TextPressure";
import ScrollReveal from "./ScrollReveal/ScrollReveal";
import TrueFocus from "./TrueFocus/TrueFocus";
import TiltCard from "./TiltCard";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardSwap, { Card } from "./CardSwap/CardSwap";
import { HyperText } from "./HyperText/HyperText";
import InfiniteScroll from "./InfiniteScroll/InfiniteScroll";
import {
  SiMongodb,
  SiKubernetes,
  SiJavascript,
  SiTypescript,
  SiAew,
  SiVercel,
} from "react-icons/si";
import RollingGallery from "./RollingGallery/RollingGallery";
import ProgressiveImage from "./ProgressiveImage";
import EnergyOrbScene from "./EnergyOrbScene";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

const items = [
  {
    content: (
      <div className="flex items-center gap-3 text-white text-lg font-semibold">
        <FaReact className="text-cyan-400 text-2xl" />
        React.js
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-green-400 text-lg font-semibold">
        <FaNodeJs className="text-green-500 text-2xl" />
        Node.js
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-emerald-400 text-lg font-semibold">
        <SiMongodb className="text-emerald-500 text-2xl" />
        MongoDB
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-yellow-300 text-lg font-semibold">
        <SiJavascript className="text-yellow-300 text-2xl" />
        JavaScript
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-blue-400 text-lg font-semibold">
        <SiTypescript className="text-blue-400 text-2xl" />
        TypeScript
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-orange-400 text-lg font-semibold">
        <FaGitAlt className="text-orange-500 text-2xl" />
        Git & GitHub
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-indigo-400 text-lg font-semibold">
        <FaDocker className="text-sky-400 text-2xl" />
        Docker
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-purple-400 text-lg font-semibold">
        <SiKubernetes className="text-purple-500 text-2xl" />
        Kubernetes
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-pink-300 text-lg font-semibold">
        <FaServer className="text-pink-400 text-2xl" />
        CI/CD
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-blue-300 text-lg font-semibold">
        <SiAew className="text-blue-300 text-2xl" />
        AWS
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-white text-lg font-semibold">
        <FaCloud className="text-white text-2xl" />
        Cloud Architecture
      </div>
    ),
  },
  {
    content: (
      <div className="flex items-center gap-3 text-gray-200 text-lg font-semibold">
        <SiVercel className="text-gray-200 text-2xl" />
        Vercel
      </div>
    ),
  },
];

function Home() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const skillsGridRef = useRef<HTMLDivElement>(null);
  const [skillsFocus, setSkillsFocus] = useState(0);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [isFeaturedInView, setIsFeaturedInView] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const energyOrbSectionRef = useRef<HTMLDivElement>(null);
  const [isEnergyOrbInView, setIsEnergyOrbInView] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);
  const [orbResetKey, setOrbResetKey] = useState(0);
  const [scrollUpCount, setScrollUpCount] = useState(0);
  const [scrollDownCount, setScrollDownCount] = useState(0);
  const SCROLL_THRESHOLD = 2;
  const [hasOrbScrolled, setHasOrbScrolled] = useState(false);
  const [explodedScrollUpCount, setExplodedScrollUpCount] = useState(0);
  const [explodedScrollDownCount, setExplodedScrollDownCount] = useState(0);
  const [hasTriggeredOrbExit, setHasTriggeredOrbExit] = useState(false);
  const [orbLockDisabled, setOrbLockDisabled] = useState(false);
  const [showEnergyOrbSection, setShowEnergyOrbSection] = useState(false);

  useEffect(() => {
    setIsInstalling(true);
  }, []);

  useEffect(() => {
    if (isInstalling) {
      const installTimeout = setTimeout(() => {
        setIsInstalling(false);
      }, 2500);

      return () => {
        clearTimeout(installTimeout);
      };
    }
  }, [isInstalling]);

  useEffect(() => {
    const el = skillsGridRef.current;
    if (!el) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setSkillsFocus(entry.intersectionRatio);
        if (entry.intersectionRatio > 0 && !hasBeenInView) {
          setHasBeenInView(true);
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasBeenInView]);

  useEffect(() => {
    const onHashChange = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFeaturedInView(entry.isIntersecting);
        console.log("Featured in view:", entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    if (featuredRef.current) observer.observe(featuredRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = energyOrbSectionRef.current;
    if (!showEnergyOrbSection || !section || orbLockDisabled) return;

    const isPartiallyInView = () => {
      const rect = section.getBoundingClientRect();
      return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
      );
    };

    // Remove all auto scroll on mount

    // Observer for smooth scroll when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) {
          setIsEnergyOrbInView(true);
          const rect = section.getBoundingClientRect();
          // Only scroll if not already at top (allowing a small margin)
          if (Math.abs(rect.top) > 2 && !hasOrbScrolled) {
            window.scrollTo({
              top: window.scrollY + rect.top,
              behavior: "smooth",
            });
            setHasOrbScrolled(true);
          }
        } else {
          setIsEnergyOrbInView(false);
          setHasOrbScrolled(false); // Reset for next entry
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasOrbScrolled, orbLockDisabled, showEnergyOrbSection]);

  // Lock/unlock scroll when exploded and in view
  useEffect(() => {
    if (orbLockDisabled) return;
    const lockScroll = () => {
      document.body.style.overflow = "hidden";
    };
    const unlockScroll = () => {
      document.body.style.overflow = "";
    };

    // Prevent manual scroll (wheel, touch, keyboard)
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    const preventKeys = (e: KeyboardEvent) => {
      // Arrow keys, space, page up/down, home/end
      const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
      if (keys.includes(e.keyCode)) {
        e.preventDefault();
      }
    };

    if (isEnergyOrbInView && hasExploded) {
      lockScroll();
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("keydown", preventKeys, { passive: false });
    } else if (isEnergyOrbInView) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [isEnergyOrbInView, hasExploded, orbLockDisabled]);

  const scrollToFeaturedBottom = () => {
    if (featuredRef.current) {
      const rect = featuredRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      let scrollY;
      if (sectionHeight <= window.innerHeight) {
        // Align bottom of section with bottom of viewport
        scrollY = window.scrollY + rect.bottom - window.innerHeight;
      } else {
        // Section is taller than viewport, align top
        scrollY = window.scrollY + rect.top;
      }
      gsap.to(window, {
        scrollTo: { y: scrollY, autoKill: false },
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });
    }
  };

  const handleArrowClick = (direction: "up" | "down") => {
    if (direction === "up") {
      scrollToFeaturedBottom();
      setOrbResetKey((k) => k + 1); // reset orb scene
    } else if (direction === "down" && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setHasExploded(false);
    document.body.style.overflow = "";
  };

  const skillCategories = [
    {
      title: "Frontend",
      icon: (
        <FaReact className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: [
        "React.js",
        "React Native",
        "TypeScript",
        "Tailwind CSS",
        "Material UI",
        "Shadcn UI",
      ],
    },
    {
      title: "Backend",
      icon: (
        <FaNodeJs className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: [
        "Node.js",
        "Express",
        "REST",
        "GraphQL",
        "Python",
        "Django",
        "Flask",
        "FastAPI",
      ],
    },
    {
      title: "Database",
      icon: (
        <FaDatabase className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: [
        "MongoDB",
        "SQL",
        "Firebase",
        "Supabase",
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "MariaDB",
      ],
    },
    {
      title: "DevOps",
      icon: (
        <FaDocker className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: [
        "Docker",
        "Kubernetes",
        "AWS",
        "CI/CD",
        "GitHub Actions",
        "Elastic Search",
        "RabbitMQ",
      ],
    },
    {
      title: "Cloud",
      icon: (
        <FaCloud className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: [
        "AWS",
        "Firebase",
        "Vercel",
        "Cloud Functions",
        "Azure",
        "Google Cloud Platform",
      ],
    },
    {
      title: "Tools",
      icon: (
        <FaTools className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: [
        "Git",
        "Figma",
        "VS Code",
        "Postman",
        "Jira",
        "Notion",
        "Cursor IDE",
      ],
    },
  ];

  const handleScrollDown = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }
  };

  useEffect(() => {
    const sections = [
      { name: "Skills", ref: skillsGridRef },
      { name: "Featured", ref: featuredRef },
      // Only include Energy Orb if it's rendered
      ...(showEnergyOrbSection
        ? [{ name: "Energy Orb", ref: energyOrbSectionRef }]
        : []),
      { name: "Footer", ref: footerRef },
    ];

    let lastSection = "";

    const onScroll = () => {
      let maxVisible = 0;
      let currentSection = "";
      for (const { name, ref } of sections) {
        const el = ref.current;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const visible =
          Math.max(
            0,
            Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
          ) / Math.min(rect.height, window.innerHeight);
        if (visible > maxVisible && visible > 0.2) {
          maxVisible = visible;
          currentSection = name;
        }
      }
      if (currentSection && currentSection !== lastSection) {
        lastSection = currentSection;
        console.log(`[Scroll] Currently in section: ${currentSection}`);
        // Log navbar blur state
        console.log(`[Navbar] Blurry: ${!isEnergyOrbInView}`);
        // Log DOM-based orb visibility
        const orbEl = energyOrbSectionRef.current;
        if (showEnergyOrbSection && orbEl) {
          const rect = orbEl.getBoundingClientRect();
          const orbInView =
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0;
          console.log(`[DOM] Energy Orb in view: ${orbInView}`);
          if (orbInView !== isEnergyOrbInView) {
            setIsEnergyOrbInView(orbInView);
          }
          // Snap and lock scroll if orb is in view
          if (orbInView) {
            if (Math.abs(rect.top) > 2) {
              gsap.to(window, {
                scrollTo: { y: window.scrollY + rect.top, autoKill: false },
                duration: 0.8,
                ease: "power3.out",
              });
            }
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = "";
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, [isEnergyOrbInView, showEnergyOrbSection]);

  useEffect(() => {
    if (isEnergyOrbInView && hasExploded) {
      console.log("[EnergyOrb Observer] Orb snapped and scroll locked");
    }
  }, [isEnergyOrbInView, hasExploded]);

  // Effect to handle wheel and touch events for orb section
  useEffect(() => {
    const orbEl = energyOrbSectionRef.current;
    if (!showEnergyOrbSection || !orbEl) return;

    let lastTouchY: number | null = null;

    const onWheel = (e: WheelEvent) => {
      const rect = orbEl.getBoundingClientRect();
      // At top and scrolling up
      if (rect.top >= 0 && e.deltaY < 0) {
        setScrollUpCount((c) => {
          if (c + 1 >= SCROLL_THRESHOLD) {
            handleArrowClick("up");
            return 0;
          }
          return c + 1;
        });
      } else if (rect.bottom <= window.innerHeight && e.deltaY > 0) {
        // At bottom and scrolling down
        setScrollDownCount((c) => {
          if (c + 1 >= SCROLL_THRESHOLD) {
            handleArrowClick("down");
            return 0;
          }
          return c + 1;
        });
      } else {
        setScrollUpCount(0);
        setScrollDownCount(0);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      lastTouchY = null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || lastTouchY === null) return;
      const touchY = e.touches[0].clientY;
      const rect = orbEl.getBoundingClientRect();
      const deltaY = touchY - lastTouchY;
      // At top and swiping down (pull to refresh style)
      if (rect.top >= 0 && deltaY > 10) {
        setScrollUpCount((c) => {
          if (c + 1 >= SCROLL_THRESHOLD) {
            handleArrowClick("up");
            return 0;
          }
          return c + 1;
        });
      } else if (rect.bottom <= window.innerHeight && deltaY < -10) {
        // At bottom and swiping up
        setScrollDownCount((c) => {
          if (c + 1 >= SCROLL_THRESHOLD) {
            handleArrowClick("down");
            return 0;
          }
          return c + 1;
        });
      } else {
        setScrollUpCount(0);
        setScrollDownCount(0);
      }
      lastTouchY = touchY;
    };

    orbEl.addEventListener("wheel", onWheel, { passive: false });
    orbEl.addEventListener("touchstart", onTouchStart, { passive: true });
    orbEl.addEventListener("touchmove", onTouchMove, { passive: false });
    orbEl.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      orbEl.removeEventListener("wheel", onWheel);
      orbEl.removeEventListener("touchstart", onTouchStart);
      orbEl.removeEventListener("touchmove", onTouchMove);
      orbEl.removeEventListener("touchend", onTouchEnd);
    };
  }, [energyOrbSectionRef.current, showEnergyOrbSection]);

  // Function to handle orb exit: reset, clean, and hide the section
  const handleOrbExit = useCallback(() => {
    setHasExploded(false);
    setIsEnergyOrbInView(false);
    setOrbLockDisabled(false);
    setHasTriggeredOrbExit(false);
    setExplodedScrollUpCount(0);
    setExplodedScrollDownCount(0);
    setOrbResetKey((k) => k + 1); // Optionally reset orb scene
    setShowEnergyOrbSection(false); // Hide the section
    document.body.style.overflow = ""; // Clean up scroll lock
  }, []);

  // Effect to log scroll up/down counts when orb is exploded
  useEffect(() => {
    if (
      !showEnergyOrbSection ||
      !(hasExploded && isEnergyOrbInView) ||
      orbLockDisabled
    )
      return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        setExplodedScrollUpCount((count) => {
          const newCount = count + 1;
          console.log(`[Orb Exploded] Mouse scrolled UP: ${newCount} times`);
          // After 15 scrolls up, snap out and scroll to footerRef
          if (newCount >= 15 && !hasTriggeredOrbExit) {
            handleOrbExit();
            setTimeout(() => {
              if (footerRef.current) {
                footerRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 100); // slight delay to allow state update
          }
          return newCount;
        });
      } else if (e.deltaY > 0) {
        setExplodedScrollDownCount((count) => {
          const newCount = count + 1;
          console.log(`[Orb Exploded] Mouse scrolled DOWN: ${newCount} times`);
          // After 15 scrolls down, snap out and scroll to featuredRef
          if (newCount >= 15 && !hasTriggeredOrbExit) {
            handleOrbExit();
            setTimeout(() => {
              if (featuredRef.current) {
                featuredRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 100); // slight delay to allow state update
          }
          return newCount;
        });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [
    hasExploded,
    isEnergyOrbInView,
    hasTriggeredOrbExit,
    featuredRef,
    orbLockDisabled,
    showEnergyOrbSection,
  ]);

  // Reset counters and trigger flag when orb is not exploded
  useEffect(() => {
    if (!hasExploded) {
      setExplodedScrollUpCount(0);
      setExplodedScrollDownCount(0);
      setHasTriggeredOrbExit(false);
    }
  }, [hasExploded]);

  useEffect(() => {
    if (showEnergyOrbSection && energyOrbSectionRef.current) {
      energyOrbSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showEnergyOrbSection]);

  return (
    <>
      <Helmet>
        <title>Home | KodeKenobi</title>
        <meta property="og:title" content="Home | KodeKenobi" />
        <meta
          property="og:description"
          content="Welcome to my portfolio website!"
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/assets/images/home-og.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/home" />
        {/* Twitter Card tags (optional) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/assets/images/home-og.png"
        />
      </Helmet>
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* <Navbar /> */}
        {heroLoaded && <AnimatedNavbar disableBlur={isEnergyOrbInView} />}
        <div className="relative">
          <Hero onLoaded={() => setHeroLoaded(true)} />
          {/* Mouse scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
            onClick={handleScrollDown}
          >
            <div className="w-8 h-14 rounded-full border-2 border-gray-800 flex items-start justify-center relative">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 animate-bounce"></div>
            </div>
            <span className="block text-gray-800 text-xs mt-2 text-center">
              Scroll
            </span>
          </div>
        </div>
        {!heroLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400 border-solid"></div>
            <span className="ml-4 text-green-300 text-xl font-mono">
              Loading...
            </span>
          </div>
        )}
        {heroLoaded && (
          <div ref={mainContentRef} className="flex-1 pt-8">
            <div className="w-4/5 mx-auto">
              <TextPressure
                text="Hello!"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={24}
              />
            </div>
            <div className="w-4/5 mx-auto mt-8">
              <TrueFocus
                sentence="Welcome To My Website"
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
            <div className="w-4/5 mx-auto text-center mt-8 mb-8">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={10}
              >
                I'm a passionate developer specializing in modern web and mobile
                technologies. With a strong foundation in the MERN stack and
                experience across cloud platforms, databases, and DevOps tools,
                I build scalable, user-focused solutions. Whether it's web apps,
                mobile experiences, or backend systems, I enjoy turning ideas
                into reliable, intuitive products.
              </ScrollReveal>
            </div>
            {/* <div className="w-4/5 mx-auto mt-8">
              <TrueFocus
                sentence="Skills & Expertise"
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div> */}
            <div
              ref={skillsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-4/5 mx-auto"
              // style={{
              //   filter: hasBeenInView
              //     ? "blur(0px)"
              //     : `blur(${8 - 8 * skillsFocus}px)`,
              //   opacity: hasBeenInView ? 1 : skillsFocus,
              //   transition: "filter 0.3s, opacity 0.3s",
              // }}
            >
              {skillCategories.map((category, idx) => (
                <ScrollReveal
                  key={category.title}
                  baseOpacity={0.05}
                  enableBlur={true}
                  baseRotation={8}
                  blurStrength={18}
                  containerClassName="h-full"
                  wordAnimationEnd="top center"
                >
                  <TiltCard className="group relative overflow-visible">
                    {/* Foreground content floats on hover */}
                    <div
                      className="relative z-10 transition-all duration-700 ease-out group"
                      style={{
                        perspective: "1200px", // for 3D effect
                      }}
                    >
                      {/* Card Container (shrinks and tilts) */}
                      <div
                        className="relative transform-gpu transition-transform duration-700 ease-out group-hover:rotate-x-12 group-hover:rotate-y-6 group-hover:scale-90 group-hover:-translate-y-2 group-hover:shadow-green-400/30 will-change-transform"
                        style={{
                          transformStyle: "preserve-3d",
                          filter:
                            "drop-shadow(0 12px 32px rgba(34,197,94,0.35))",
                        }}
                      >
                        {/* Content (counter-scale to remain same size) */}
                        <div className="scale-100 group-hover:scale-110 transition-transform duration-700 ease-out">
                          {/* Header */}
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="text-green-400 transform group-hover:scale-125 transition-transform duration-300 group-hover:text-green-300">
                              {category.icon}
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300">
                              {category.title}
                            </h3>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, i) => (
                              <span
                                key={skill}
                                className={`px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-700 hover:border-green-500/50 hover:text-green-400 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-lg`}
                                style={{ transitionDelay: `${i * 40}ms` }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
            <div
              ref={featuredRef}
              className="relative flex flex-col lg:flex-row items-center justify-center w-full rounded-2xl overflow-hidden gap-8 min-h-[400px] lg:min-h-[500px] py-8"
              style={{ zIndex: 1 }}
            >
              {/* Sparkles background */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas
                  className="w-full h-full"
                  style={{ width: "100%", height: "100%", background: "none" }}
                >
                  <Sparkles
                    count={250}
                    scale={18}
                    size={2.5}
                    color="#0ff"
                    speed={0.12}
                  />
                  <Sparkles
                    count={80}
                    scale={12}
                    size={1.2}
                    color="#00fff7"
                    speed={0.18}
                  />
                  <Sparkles
                    count={40}
                    scale={8}
                    size={3.5}
                    color="#fff"
                    speed={0.08}
                  />
                </Canvas>
              </div>
              {/* Special clickable particle overlay */}
              <div
                className="absolute z-20 group"
                style={{
                  left: "50%", // center horizontally
                  top: "50%", // center vertically
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                onClick={() => {
                  setShowEnergyOrbSection(true);
                  setTimeout(() => {
                    if (energyOrbSectionRef.current) {
                      energyOrbSectionRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }, 100);
                }}
                title="Click me!"
              >
                <div className="relative w-10 h-10 flex items-center justify-center">
                  {/* Animated HUD label */}
                  <span
                    className="absolute left-1/2 -top-8 text-cyan-100 text-xs font-thin pointer-events-none select-none"
                    style={{
                      transform: "translateX(-50%)",
                      animation: "hud-float-up 2.2s infinite",
                      letterSpacing: "0.08em",
                      textShadow: "0 2px 8px #0ff8",
                    }}
                  >
                    click here
                  </span>
                  {/* Glowing effect */}
                  <div
                    className="absolute inset-0 rounded-full bg-cyan-300 opacity-70 blur-2xl animate-pulse"
                    style={{
                      animation:
                        "energy-wobble 2.2s infinite cubic-bezier(.36,.07,.19,.97) both",
                    }}
                  ></div>
                  {/* Main particle */}
                  <div
                    className="w-6 h-6 rounded-full bg-cyan-200 shadow-lg shadow-cyan-400/70 animate-ping"
                    style={{
                      animation:
                        "energy-wobble 1.7s infinite cubic-bezier(.36,.07,.19,.97) both",
                    }}
                  ></div>
                  {/* Extra sparkle on hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 z-10 lg:mb-0">
                <RollingGallery autoplay={true} pauseOnHover={true} />
              </div>
              <div className="flex-1 flex justify-center z-10">
                <CardSwap
                  cardDistance={60}
                  verticalDistance={70}
                  delay={5000}
                  pauseOnHover={false}
                >
                  <Card>
                    <ProgressiveImage
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                      alt="Coding workspace"
                      className="flex flex-col items-start justify-start h-full w-full p-4 pt-6 text-white space-y-3 relative rounded-xl overflow-hidden"
                      style={{ minHeight: "100%" }}
                    >
                      {/* Overlay for readability */}
                      <div
                        className="absolute inset-0 bg-black/50 rounded-xl"
                        style={{ zIndex: 0 }}
                      />
                      <div className="relative z-10 w-full p-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                          🧙‍♂️
                        </div>
                        <h3 className="text-xl font-bold leading-tight">
                          Code Wizardry
                        </h3>
                        <p className="text-sm text-gray-300">
                          Turning complex problems into elegant, magical
                          solutions with clean code and creativity.
                        </p>
                        <button
                          className="mt-2 px-4 py-1 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 transition"
                          onClick={() => {
                            setShowEnergyOrbSection(true);
                            setTimeout(() => {
                              if (energyOrbSectionRef.current) {
                                energyOrbSectionRef.current.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }
                            }, 100);
                          }}
                        >
                          Cast a Spell
                        </button>
                      </div>
                    </ProgressiveImage>
                  </Card>
                  <Card>
                    <ProgressiveImage
                      src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
                      alt="Developer at work"
                      className="flex flex-col items-start justify-start h-full w-full p-4 pt-6 text-white space-y-3 relative rounded-xl overflow-hidden"
                      style={{ minHeight: "100%" }}
                    >
                      <div
                        className="absolute inset-0 bg-black/50 rounded-xl"
                        style={{ zIndex: 0 }}
                      />
                      <div className="relative z-10 w-full p-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                          ⚡
                        </div>
                        <h3 className="text-xl font-bold leading-tight">
                          Full Stack Power
                        </h3>
                        <p className="text-sm text-gray-300">
                          Mastery across frontend, backend, and cloud—building
                          seamless, scalable experiences from pixel to
                          production.
                        </p>
                        <button
                          className="mt-2 px-4 py-1 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 transition"
                          onClick={() => {
                            setShowEnergyOrbSection(true);
                            setTimeout(() => {
                              if (energyOrbSectionRef.current) {
                                energyOrbSectionRef.current.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }
                            }, 100);
                          }}
                        >
                          Unleash Magic
                        </button>
                      </div>
                    </ProgressiveImage>
                  </Card>
                  <Card>
                    <ProgressiveImage
                      src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
                      alt="Code on screen"
                      className="flex flex-col items-start justify-start h-full w-full p-4 pt-6 text-white space-y-3 relative rounded-xl overflow-hidden"
                      style={{ minHeight: "100%" }}
                    >
                      <div
                        className="absolute inset-0 bg-black/50 rounded-xl"
                        style={{ zIndex: 0 }}
                      />
                      <div className="relative z-10 w-full p-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                          🪄
                        </div>
                        <h3 className="text-xl font-bold leading-tight">
                          UI/UX Enchanter
                        </h3>
                        <p className="text-sm text-gray-300">
                          Crafting interfaces that delight and engage, blending
                          design and code for magical user journeys.
                        </p>
                        <button
                          className="mt-2 px-4 py-1 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 transition"
                          onClick={() => {
                            setShowEnergyOrbSection(true);
                            setTimeout(() => {
                              if (energyOrbSectionRef.current) {
                                energyOrbSectionRef.current.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }
                            }, 100);
                          }}
                        >
                          Reveal the Arcane
                        </button>
                      </div>
                    </ProgressiveImage>
                  </Card>
                </CardSwap>
              </div>
            </div>
            {/* Only render Energy Orb section if showEnergyOrbSection is true */}
            {showEnergyOrbSection && (
              <div
                ref={energyOrbSectionRef}
                id="energy-orb-section"
                className="relative min-h-screen w-full flex items-center justify-center"
              >
                <EnergyOrbScene
                  featuredRef={featuredRef}
                  footerRef={footerRef}
                  onExplosion={() => setHasExploded(true)}
                  resetKey={orbResetKey}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <style>
        {`
@keyframes energy-wobble {
  0% { transform: scale(1) rotate(0deg); filter: blur(8px); }
  20% { transform: scale(1.08, 0.95) rotate(-4deg); filter: blur(10px); }
  40% { transform: scale(0.97, 1.05) rotate(3deg); filter: blur(7px); }
  60% { transform: scale(1.05, 0.98) rotate(-2deg); filter: blur(9px); }
  80% { transform: scale(0.98, 1.04) rotate(2deg); filter: blur(8px); }
  100% { transform: scale(1) rotate(0deg); filter: blur(8px); }
}

@keyframes hud-float-up {
  0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  10% { opacity: 0.7; }
  30% { opacity: 1; transform: translateX(-50%) translateY(0); }
  80% { opacity: 0.7; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-16px); }
}
`}
      </style>
    </>
  );
}

export default Home;

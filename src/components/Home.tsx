import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaDocker,
  FaCloud,
  FaTools,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Particle Background Component
const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: "#4ade80",
      transparent: true,
      opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    camera.position.z = 2;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0001;
      particlesMesh.rotation.y += 0.0001;
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

function Home() {
  const [isInstalling, setIsInstalling] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  // Mouse move effect for cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cardsRef.current.forEach((card) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });
    };

    const handleMouseLeave = () => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
      });
    };

    cardsRef.current.forEach((card) => {
      if (card) {
        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.removeEventListener("mousemove", handleMouseMove);
          card.removeEventListener("mouseleave", handleMouseLeave);
        }
      });
    };
  }, []);

  // Simplified Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      title: "Frontend",
      icon: <FaReact className="w-8 h-8" />,
      skills: [
        "React.js",
        "React Native",
        "TypeScript",
        "Tailwind CSS",
        "Material UI",
      ],
    },
    {
      title: "Backend",
      icon: <FaNodeJs className="w-8 h-8" />,
      skills: ["Node.js", "Express", "REST", "GraphQL", "Python"],
    },
    {
      title: "Database",
      icon: <FaDatabase className="w-8 h-8" />,
      skills: ["MongoDB", "SQL", "Firebase", "Supabase"],
    },
    {
      title: "DevOps",
      icon: <FaDocker className="w-8 h-8" />,
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions"],
    },
    {
      title: "Cloud",
      icon: <FaCloud className="w-8 h-8" />,
      skills: ["AWS", "Firebase", "Vercel", "Cloud Functions"],
    },
    {
      title: "Tools",
      icon: <FaTools className="w-8 h-8" />,
      skills: ["Git", "Figma", "VS Code", "Postman", "Jira"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 opacity-20 animate-gradient"></div>
        <div className="w-full relative px-4 sm:px-8">
          <div className="mt-4 terminal-window mx-auto shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fade-in px-4 sm:px-8 py-4 sm:py-6 glow-border">
            <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base overflow-x-auto break-words">
              <div className="animate-fade-in">
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center float glitch-text">
                  Welcome to My Website
                  <span className="animate-blink">_</span>
                </div>

                <div id="about" className="topic-header mt-20">
                  ABOUT ME
                </div>
                <div className="topic-text glow-border p-4 rounded-xl">
                  I'm a passionate developer specializing in modern web and
                  mobile technologies. With a strong foundation in the MERN
                  stack and experience across cloud platforms, databases, and
                  DevOps tools, I build scalable, user-focused solutions.
                  Whether it's web apps, mobile experiences, or backend systems,
                  I enjoy turning ideas into reliable, intuitive products.
                </div>

                <div id="skills" className="topic-header">
                  SKILLS & EXPERTISE
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
                  {skillCategories.map((category, index) => (
                    <div
                      key={category.title}
                      ref={(el) => (cardsRef.current[index] = el)}
                      className="card-3d group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 
                        transform transition-all duration-300 ease-out
                        border border-gray-700 hover:border-green-500/50"
                    >
                      <div className="content">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-green-400 transform group-hover:scale-110 transition-transform duration-300 float">
                            {category.icon}
                          </div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            {category.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => (
                            <span
                              key={skill}
                              className="skill-tag px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300 
                                border border-gray-700 hover:border-green-500/50 hover:text-green-400 
                                transition-all duration-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div id="focus" className="topic-header mt-12">
                  CURRENT FOCUS
                </div>
                <div
                  className="topic-text bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl 
                  border border-gray-700 hover:border-green-500/50 transition-all duration-300
                  transform hover:scale-[1.02] hover:-translate-y-1 glow-border"
                >
                  Exploring the frontiers of AI and Machine Learning while
                  building scalable web applications. Always learning, always
                  growing.
                </div>

                <div id="contact" className="topic-header mt-12">
                  GET IN TOUCH
                </div>
                <div
                  className="topic-text bg-gradient-to-r from-gray-800 to-gray-900 p-4 sm:p-6 rounded-xl 
                  border border-gray-700 hover:border-green-500/50 transition-all duration-300
                  transform hover:scale-[1.02] hover:-translate-y-1 glow-border"
                >
                  Let's connect and create something amazing together.{" "}
                  <a
                    href="mailto:kodekenobi@gmail.com"
                    className="text-green-400 hover:text-green-300 font-semibold hover:underline transition-all duration-300"
                  >
                    Send me an email
                  </a>
                  .
                </div>

                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

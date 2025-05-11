import { useEffect, useState, useCallback } from "react";
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
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

function Home() {
  const [isInstalling, setIsInstalling] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine as any);
  }, []);

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
      ],
    },
    {
      title: "Backend",
      icon: (
        <FaNodeJs className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: ["Node.js", "Express", "REST", "GraphQL", "Python"],
    },
    {
      title: "Database",
      icon: (
        <FaDatabase className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: ["MongoDB", "SQL", "Firebase", "Supabase"],
    },
    {
      title: "DevOps",
      icon: (
        <FaDocker className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions"],
    },
    {
      title: "Cloud",
      icon: (
        <FaCloud className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: ["AWS", "Firebase", "Vercel", "Cloud Functions"],
    },
    {
      title: "Tools",
      icon: (
        <FaTools className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      skills: ["Git", "Figma", "VS Code", "Postman", "Jira"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#4ade80",
            },
            links: {
              color: "#4ade80",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 40,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0"
      />
      <Navbar />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <div className="flex-1 pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 opacity-20 animate-gradient"></div>
        <div className="w-full relative">
          {/* Terminal Window */}
          <div className="mt-4 terminal-window mx-auto shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fade-in px-4 sm:px-8 py-4 sm:py-6">
            <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base overflow-x-auto break-words">
              {/* Main Content */}
              <div className="animate-fade-in">
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center">
                  Welcome to My Website
                  <span className="animate-blink">_</span>
                </div>

                <div
                  id="about"
                  className="topic-header mt-24 sm:mt-24 md:mt-20 text-center"
                >
                  ABOUT ME
                </div>
                <div className="text-center">
                  I'm a passionate developer specializing in modern web and
                  mobile technologies. With a strong foundation in the MERN
                  stack and experience across cloud platforms, databases, and
                  DevOps tools, I build scalable, user-focused solutions.
                  Whether it's web apps, mobile experiences, or backend systems,
                  I enjoy turning ideas into reliable, intuitive products.
                </div>
                <div
                  id="skills"
                  className="topic-header mt-16 sm:mt-16 md:mt-12 text-center"
                >
                  SKILLS & EXPERTISE
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {skillCategories.map((category) => (
                    <div
                      key={category.title}
                      className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 transition-all duration-500 border border-gray-700 hover:border-green-500/50 overflow-hidden"
                    >
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl animate-gradient-x"></div>

                      {/* Pulsing glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 rounded-xl opacity-70 animate-pulse-slow"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-green-400 transform group-hover:scale-110 transition-transform duration-300 group-hover:text-green-300">
                            {category.icon}
                          </div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300">
                            {category.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-700 hover:border-green-500/50 hover:text-green-400 transition-all duration-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  id="focus"
                  className="topic-header mt-16 sm:mt-16 md:mt-12 text-center"
                >
                  CURRENT FOCUS
                </div>
                <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl animate-gradient-x"></div>

                  {/* Pulsing glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/15 via-blue-500/15 to-purple-500/15 rounded-xl opacity-50 animate-pulse-slow"></div>

                  <div className="relative z-10 text-center">
                    Exploring the frontiers of AI and Machine Learning while
                    building scalable web applications. Always learning, always
                    growing.
                  </div>
                </div>

                <div
                  id="contact"
                  className="topic-header mt-16 sm:mt-16 md:mt-12 text-center"
                >
                  GET IN TOUCH
                </div>
                <div className="relative bg-gradient-to-r from-gray-800/90 to-gray-900/90 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl animate-gradient-x"></div>

                  {/* Pulsing glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/15 via-blue-500/15 to-purple-500/15 rounded-xl opacity-50 animate-pulse-slow"></div>

                  <div className="relative z-10 text-center">
                    Let's connect and create something amazing together.{" "}
                    <a
                      href="mailto:kodekenobi@gmail.com"
                      className="text-green-400 hover:text-green-300 font-semibold hover:underline transition-all duration-300"
                    >
                      Send me an email
                    </a>
                    .
                  </div>
                </div>

                {/* Footer */}
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

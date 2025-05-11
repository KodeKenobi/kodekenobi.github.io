import { useEffect, useState, useRef } from "react";
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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            entry.target.classList.remove("animate-out");
          } else {
            entry.target.classList.add("animate-out");
            entry.target.classList.remove("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
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

                <div id="about" className="topic-header mt-20">
                  ABOUT ME
                </div>
                <div className="topic-text">
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
                      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 
                        transform transition-all duration-500 ease-out
                        animate-out opacity-0 translate-y-8 scale-95
                        hover:shadow-2xl hover:-translate-y-2 hover:scale-105
                        border border-gray-700 hover:border-green-500/50"
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-green-400 transform group-hover:scale-110 transition-transform duration-300">
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
                              className="px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300 
                                border border-gray-700 hover:border-green-500/50 hover:text-green-400 
                                transition-all duration-300 transform hover:scale-105"
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
                  transform hover:scale-[1.02] hover:-translate-y-1"
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
                  transform hover:scale-[1.02] hover:-translate-y-1"
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

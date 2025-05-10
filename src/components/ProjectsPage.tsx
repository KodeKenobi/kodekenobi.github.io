import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import { FaMobile, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
const ProjectsPage = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "Nusuru App",
      icon: <FaMobile className="w-8 h-8" />,
      description:
        "A mobile app for everyday hustlers - connecting service providers with those who need their services. Built with React Native (Expo) and Supabase.",
      tags: ["React Native", "Expo", "Supabase", "Marketplace"],
      onClick: () => navigate("/projects/nusuru"),
    },
  ];

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
            <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base">
              <div className="animate-fade-in">
                <div
                  className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center"
                  data-aos="fade-zoom-in"
                  data-aos-duration="1200"
                >
                  Projects
                  <span className="animate-blink">_</span>
                </div>

                {/* GitHub Section */}
                <div className="mb-12 text-center" data-aos="fade-up">
                  <p className="text-gray-300 leading-relaxed mb-6">
                    I work on multiple different projects. Visit my GitHub to
                    see more of my work and contributions.
                  </p>
                  <a
                    href="https://github.com/kodekenobi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300 px-6 py-3 rounded-lg transition-all duration-300 border border-gray-700 hover:border-green-500/50"
                  >
                    <FaGithub className="w-6 h-6" />
                    <span>View My GitHub</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-6 mt-8">
                  {projects.map((project, index) => (
                    <div
                      key={project.title}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50 cursor-pointer"
                      data-aos="flip-up"
                      data-aos-delay={index * 100}
                      onClick={project.onClick}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-green-400 bg-gray-800 p-3 rounded-lg">
                          {project.icon}
                        </div>
                        <h3 className="text-green-300 text-xl font-bold">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-800 text-green-400 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

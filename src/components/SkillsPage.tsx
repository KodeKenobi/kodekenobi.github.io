import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaDocker,
  FaCloud,
  FaTools,
} from "react-icons/fa";
import Layout from "./Layout";
import Footer from "./Footer";

const Skills = () => {
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
    <Layout>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 opacity-20 animate-gradient"></div>
        <div className="w-full relative">
          {/* Terminal Window */}
          <div className="mt-4 terminal-window mx-auto shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fade-in px-4 sm:px-8 py-4 sm:py-6">
            <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base overflow-x-auto break-words">
              <div className="animate-fade-in">
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center">
                  Skills & Expertise
                  <span className="animate-blink">_</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
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
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Skills;

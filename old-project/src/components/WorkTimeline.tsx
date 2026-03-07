import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  FaBriefcase,
  FaCalendar,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaGraduationCap,
} from "react-icons/fa";
import Footer from "./Footer";

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
  link?: string;
  logo?: string;
  type: "work" | "education";
  responsibilities?: string[];
  skills?: string[];
}

const workExperience: WorkExperience[] = [
  {
    id: 1,
    company: "Fluff Software",
    position: "Software Engineer",
    duration: "Sep 2023 - Present",
    location: "Remote (Swindon, England)",
    description:
      "Full-stack development using React.js, Next.js, and Tailwind CSS. Cross-platform mobile development with React Native and Expo. Backend development with RESTful APIs and GraphQL. Security implementation using AWS Cognito, NextAuth, and OAuth.",
    technologies: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "React Native",
      "Expo",
      "GraphQL",
      "AWS Cognito",
      "NextAuth",
      "OAuth",
    ],
    achievements: [
      "Developed full-stack applications using modern React ecosystem",
      "Implemented cross-platform mobile solutions with React Native",
      "Built secure authentication systems with AWS Cognito",
      "Created responsive web applications with Next.js and Tailwind CSS",
    ],
    type: "work",
    responsibilities: [
      "Develop full-stack applications using modern React ecosystem",
      "Implement cross-platform mobile solutions with React Native",
      "Build secure authentication systems with AWS Cognito",
      "Create responsive web applications with Next.js and Tailwind CSS",
    ],
    skills: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "React Native",
      "Expo",
      "GraphQL",
      "AWS Cognito",
      "NextAuth",
      "OAuth",
    ],
  },
  {
    id: 2,
    company: "GotBot.Ai",
    position: "Senior Software Engineer",
    duration: "2023",
    location: "Contract (South Africa)",
    description:
      "Developed conversational agents and chatbots. Worked with NLP, AWS, Kubernetes, and various cloud technologies.",
    technologies: [
      "NLP",
      "AWS",
      "Kubernetes",
      "Chatbots",
      "Conversational AI",
      "Cloud Technologies",
    ],
    achievements: [
      "Built advanced conversational agents and chatbots",
      "Implemented NLP solutions for natural language processing",
      "Deployed applications using Kubernetes and AWS",
      "Worked with various cloud technologies and services",
    ],
    type: "work",
    responsibilities: [
      "Develop conversational agents and chatbots",
      "Work with NLP, AWS, Kubernetes, and various cloud technologies",
      "Implement NLP solutions for natural language processing",
      "Deploy applications using Kubernetes and AWS",
      "Work with various cloud technologies and services",
    ],
    skills: [
      "NLP",
      "AWS",
      "Kubernetes",
      "Chatbots",
      "Conversational AI",
      "Cloud Technologies",
    ],
  },
  {
    id: 3,
    company: "MfundoPedia",
    position: "Full Stack Developer",
    duration: "2021 - 2022",
    location: "Hybrid (South Africa)",
    description:
      "Full-stack development with React, Vue.js, Angular, and Ionic. Mobile app development using Flutter and Dart.",
    technologies: [
      "React",
      "Vue.js",
      "Angular",
      "Ionic",
      "Flutter",
      "Dart",
      "Full Stack",
    ],
    achievements: [
      "Developed full-stack applications using multiple frameworks",
      "Built mobile applications with Flutter and Dart",
      "Worked with modern frontend frameworks (React, Vue, Angular)",
      "Created hybrid mobile apps with Ionic",
    ],
    type: "work",
    responsibilities: [
      "Develop full-stack applications using multiple frameworks",
      "Build mobile applications with Flutter and Dart",
      "Work with modern frontend frameworks (React, Vue, Angular)",
      "Create hybrid mobile apps with Ionic",
    ],
    skills: [
      "React",
      "Vue.js",
      "Angular",
      "Ionic",
      "Flutter",
      "Dart",
      "Full Stack",
    ],
  },
  {
    id: 4,
    company: "Digileads",
    position: "Frontend Web Developer",
    duration: "Jan 2018 - Feb 2021",
    location: "Remote (South Africa)",
    description:
      "Web design and WordPress development. Managed and maintained multiple client websites.",
    technologies: [
      "WordPress",
      "Web Design",
      "Frontend Development",
      "Client Management",
    ],
    achievements: [
      "Designed and developed multiple client websites",
      "Managed and maintained WordPress sites",
      "Provided ongoing client support and maintenance",
      "Built responsive web designs for various clients",
    ],
    type: "work",
    responsibilities: [
      "Design and develop multiple client websites",
      "Manage and maintain WordPress sites",
      "Provide ongoing client support and maintenance",
      "Build responsive web designs for various clients",
    ],
    skills: [
      "WordPress",
      "Web Design",
      "Frontend Development",
      "Client Management",
    ],
  },
  {
    id: 5,
    company: "Harvard Online",
    position: "CS50x - Computer Science",
    duration: "2019 - 2021",
    location: "Online",
    description:
      "CS50 Certificate in Computer Science - Comprehensive computer science course covering programming fundamentals, algorithms, and data structures.",
    technologies: [
      "Computer Science",
      "Programming Fundamentals",
      "Algorithms",
      "Data Structures",
      "C",
      "Python",
    ],
    achievements: [
      "Completed comprehensive computer science curriculum",
      "Learned programming fundamentals and best practices",
      "Studied algorithms and data structures",
      "Earned CS50 Certificate in Computer Science",
    ],
    type: "education",
  },
  {
    id: 6,
    company: "Harvard Online",
    position: "CS50AI - Artificial Intelligence",
    duration: "2020 - 2022",
    location: "Online",
    description:
      "Advanced course in artificial intelligence covering machine learning, neural networks, and AI principles.",
    technologies: [
      "Artificial Intelligence",
      "Machine Learning",
      "Neural Networks",
      "AI Principles",
      "Python",
    ],
    achievements: [
      "Studied artificial intelligence fundamentals",
      "Learned machine learning algorithms and techniques",
      "Explored neural networks and deep learning",
      "Applied AI principles to real-world problems",
    ],
    type: "education",
  },
  {
    id: 7,
    company: "freeCodeCamp",
    position: "Scientific Computing with Python",
    duration: "2020 - 2021",
    location: "Online",
    description:
      "Comprehensive course on scientific computing using Python, covering data analysis, visualization, and computational methods.",
    technologies: [
      "Python",
      "Scientific Computing",
      "Data Analysis",
      "Data Visualization",
      "Computational Methods",
    ],
    achievements: [
      "Learned scientific computing with Python",
      "Mastered data analysis and visualization techniques",
      "Applied computational methods to scientific problems",
      "Built data-driven applications and tools",
    ],
    type: "education",
  },
  {
    id: 8,
    company: "freeCodeCamp",
    position: "Responsive Web Design",
    duration: "2020 - 2021",
    location: "Online",
    description:
      "Comprehensive course on creating responsive web designs that work across all devices and screen sizes.",
    technologies: [
      "HTML",
      "CSS",
      "Responsive Design",
      "Web Design",
      "User Experience",
    ],
    achievements: [
      "Mastered responsive web design principles",
      "Created mobile-first web applications",
      "Learned modern CSS techniques and frameworks",
      "Built accessible and user-friendly interfaces",
    ],
    type: "education",
  },
  {
    id: 9,
    company: "freeCodeCamp",
    position: "JavaScript Algorithms and Data Structures",
    duration: "2021 - 2022",
    location: "Online",
    description:
      "Advanced JavaScript course focusing on algorithms, data structures, and programming fundamentals.",
    technologies: [
      "JavaScript",
      "Algorithms",
      "Data Structures",
      "ES6+",
      "Functional Programming",
    ],
    achievements: [
      "Mastered JavaScript algorithms and data structures",
      "Learned modern ES6+ JavaScript features",
      "Applied functional programming concepts",
      "Built efficient and optimized JavaScript applications",
    ],
    type: "education",
  },
];

// 3D Tilt Card Component
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -10;
      const rotateY = (mouseX / (rect.width / 2)) * 10;

      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transform-gpu transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

export default function WorkTimeline() {
  const [selectedExperience, setSelectedExperience] = useState<number | null>(
    null
  );

  return (
    <div className="w-full max-w-6xl mx-auto py-2 px-4 mb-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Professional Experience
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          My journey from web development to software engineering, including
          education and professional growth
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-purple-400 transform -translate-x-1/2"></div>

        {workExperience.map((experience, index) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative mb-12 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } flex flex-col md:flex-row items-center`}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-gray-900 transform -translate-x-1/2 z-10 ${
                experience.type === "work"
                  ? "bg-gradient-to-r from-green-400 to-blue-400"
                  : "bg-gradient-to-r from-purple-400 to-pink-400"
              }`}
            ></div>

            {/* Content card */}
            <div
              className={`w-full md:w-5/12 ${
                index % 2 === 0 ? "md:pr-8" : "md:pl-8"
              } mt-8 md:mt-0 relative`}
            >
              <TiltCard className="group relative overflow-visible rounded-xl border border-cyan-400 md:border-0 transition-shadow duration-500 shadow-none p-6 md:p-8">
                {/* Hover background, solid color, no opacity/blur */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[#19202a] opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-none group-hover:shadow-[0_0_40px_10px_rgba(34,197,94,0.45)] z-0" />
                {/* Foreground content floats on hover */}
                <div
                  className="relative z-10 transition-all duration-700 ease-out group"
                  style={{
                    perspective: "1200px", // for 3D effect
                  }}
                >
                  {/* Card Container (shrinks and tilts) */}
                  <div
                    className="relative transform-gpu transition-transform duration-700 ease-out group-hover:rotate-x-12 group-hover:rotate-y-6 group-hover:scale-90 group-hover:-translate-y-2 will-change-transform"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Content (counter-scale to remain same size) */}
                    <div className="scale-100 group-hover:scale-110 transition-transform duration-700 ease-out">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {experience.position}
                          </h3>
                          <div
                            className={`flex items-center mb-2 ${
                              experience.type === "work"
                                ? "text-green-400"
                                : "text-purple-400"
                            }`}
                          >
                            {experience.type === "work" ? (
                              <FaBriefcase className="w-4 h-4 mr-2" />
                            ) : (
                              <FaGraduationCap className="w-4 h-4 mr-2" />
                            )}
                            <span className="font-medium">
                              {experience.company}
                            </span>
                          </div>
                        </div>
                        {experience.link && (
                          <a
                            href={experience.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <FaExternalLinkAlt className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Duration and Location */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center">
                          <FaCalendar className="w-3 h-3 mr-1" />
                          {experience.duration}
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                          {experience.location}
                        </div>
                      </div>

                      {/* Work Responsibilities - Expandable */}
                      <div className="border-t border-gray-700 pt-4">
                        <button
                          className={`text-sm font-medium transition-colors ${
                            experience.type === "work"
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-purple-400 hover:text-purple-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExperience(
                              selectedExperience === experience.id
                                ? null
                                : experience.id
                            );
                          }}
                        >
                          {selectedExperience === experience.id
                            ? "Hide Work Responsibilities"
                            : "Show Work Responsibilities"}
                        </button>

                        {selectedExperience === experience.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-4"
                          >
                            {/* Description/Summary */}
                            <p className="text-gray-300 leading-relaxed mb-2">
                              {experience.description}
                            </p>
                            {/* Responsibilities */}
                            {experience.responsibilities &&
                              experience.responsibilities.length > 0 && (
                                <div>
                                  <h4 className="text-base font-semibold text-white mb-1">
                                    Key Responsibilities
                                  </h4>
                                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {experience.responsibilities.map(
                                      (item, idx) => (
                                        <li key={idx}>{item}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            {/* Achievements */}
                            {experience.achievements &&
                              experience.achievements.length > 0 && (
                                <div>
                                  <h4 className="text-base font-semibold text-white mb-1">
                                    Key Achievements
                                  </h4>
                                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {experience.achievements.map(
                                      (item, idx) => (
                                        <li key={idx}>{item}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                          </motion.div>
                        )}
                      </div>

                      {/* After the expandable section, always show skills/tools if present */}
                      {experience.skills && experience.skills.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">
                            Skills & Tools
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
}

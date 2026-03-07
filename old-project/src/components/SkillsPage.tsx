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
import InfiniteScroll from "./InfiniteScroll/InfiniteScroll";
import CardsOnScroll from "./CardsOnScroll";

const skillCategories = [
  {
    title: "Frontend",
    icon: <FaReact className="text-green-400 w-6 h-6" />,
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
    icon: <FaNodeJs className="text-green-400 w-6 h-6" />,
    skills: ["Node.js", "Express", "REST", "GraphQL", "Python"],
  },
  {
    title: "Database",
    icon: <FaDatabase className="text-green-400 w-6 h-6" />,
    skills: ["MongoDB", "SQL", "Firebase", "Supabase"],
  },
  {
    title: "DevOps",
    icon: <FaDocker className="text-green-400 w-6 h-6" />,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions"],
  },
  {
    title: "Cloud",
    icon: <FaCloud className="text-green-400 w-6 h-6" />,
    skills: ["AWS", "Firebase", "Vercel", "Cloud Functions"],
  },
  {
    title: "Tools",
    icon: <FaTools className="text-green-400 w-6 h-6" />,
    skills: ["Git", "Figma", "VS Code", "Postman", "Jira"],
  },
];

const items = skillCategories.map((category) => ({
  content: (
    <div className="border-l-2 border-green-400 pl-6 py-6 bg-gray-900/80 rounded-xl shadow-lg max-w-2xl mx-auto my-8">
      <div className="flex items-center mb-3">
        <span className="mr-3">{category.icon}</span>
        <h3 className="text-xl font-bold text-green-400">{category.title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  ),
}));

const SkillsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="w-full flex flex-col items-center pt-16 pb-24">
          <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">
            Skills & Expertise
          </h2>
          <div className="w-full flex justify-center">
            <CardsOnScroll />
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default SkillsPage;

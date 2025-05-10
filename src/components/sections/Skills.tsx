import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaDocker,
  FaCloud,
  FaTools,
} from "react-icons/fa";

const Skills = () => {
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
    <section id="skills" className="py-8">
      <div className="topic-header" data-aos="flip-up" data-aos-duration="800">
        <div className="flex items-center space-x-2">
          <FaTools className="text-green-400" />
          <span>SKILLS & EXPERTISE</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {skillCategories.map((category, index) => (
          <div
            key={category.title}
            className="bg-gray-800 bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all duration-300 transform hover:rotate-y-180"
            data-aos="flip-up"
            data-aos-delay={index * 100}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-green-400">{category.icon}</div>
              <h3 className="text-green-300 font-semibold">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

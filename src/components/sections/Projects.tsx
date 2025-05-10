import { FaCode, FaMobile, FaServer, FaCloud } from "react-icons/fa";

const Focus = () => {
  const focusAreas = [
    {
      title: "Web Development",
      icon: <FaCode className="w-8 h-8" />,
      description:
        "Building responsive and performant web applications using modern frameworks and best practices.",
    },
    {
      title: "Mobile Development",
      icon: <FaMobile className="w-8 h-8" />,
      description:
        "Creating cross-platform mobile applications with React Native for iOS and Android.",
    },
    {
      title: "Backend Development",
      icon: <FaServer className="w-8 h-8" />,
      description:
        "Designing scalable and secure backend systems with Node.js and various databases.",
    },
    {
      title: "Cloud Solutions",
      icon: <FaCloud className="w-8 h-8" />,
      description:
        "Implementing cloud-based solutions using AWS, Firebase, and other cloud platforms.",
    },
  ];

  return (
    <section id="focus" className="py-16">
      <div className="topic-header" data-aos="flip-up" data-aos-duration="800">
        <div className="flex items-center space-x-3">
          <FaCode className="text-green-400 w-6 h-6" />
          <span className="text-xl font-bold tracking-wider">PROJECTS</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {focusAreas.map((area, index) => (
          <div
            key={area.title}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50"
            data-aos="flip-up"
            data-aos-delay={index * 100}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-green-400 bg-gray-800 p-3 rounded-lg">
                {area.icon}
              </div>
              <h3 className="text-green-300 text-xl font-bold">{area.title}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Focus;

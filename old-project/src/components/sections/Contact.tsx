import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <FaGithub className="w-6 h-6" />,
      url: "https://github.com/kodekenobi",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" />,
      url: "https://linkedin.com/in/kodekenobi",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="w-6 h-6" />,
      url: "https://twitter.com/kodekenobi",
    },
    {
      name: "Email",
      icon: <FaEnvelope className="w-6 h-6" />,
      url: "mailto:contact@kodekenobi.com",
    },
  ];

  return (
    <section id="contact" className="py-8">
      <div className="topic-header" data-aos="flip-up" data-aos-duration="800">
        <div className="flex items-center space-x-2">
          <FaEnvelope className="text-green-400" />
          <span>GET IN TOUCH</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-300 mb-6">
          Feel free to reach out to me for collaborations, job opportunities, or
          just to say hello!
        </p>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-300"
              data-aos="flip-up"
            >
              <span className="text-green-400">{link.icon}</span>
              <span className="text-gray-300">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;

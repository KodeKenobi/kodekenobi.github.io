import { FaGithub, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-16 mb-0">
      <div
        className="flex flex-wrap justify-center space-x-6 gap-y-4"
        data-aos-duration="1000"
      >
        <a
          href="https://github.com/kodekenobi"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link rounded-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-green-900 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20 border border-gray-700 hover:border-green-500/50"
        >
          <FaGithub className="w-6 h-6" />
        </a>
        <a
          href="https://www.facebook.com/kodekenobi"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link rounded-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-green-900 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20 border border-gray-700 hover:border-green-500/50"
        >
          <FaFacebook className="w-6 h-6" />
        </a>
        <a
          href="https://www.twitter.com/kodekenobi"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link rounded-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-green-900 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20 border border-gray-700 hover:border-green-500/50"
        >
          <FaTwitter className="w-6 h-6" />
        </a>
        <a
          href="https://www.instagram.com/kodekenobi"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link rounded-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-green-900 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20 border border-gray-700 hover:border-green-500/50"
        >
          <FaInstagram className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;

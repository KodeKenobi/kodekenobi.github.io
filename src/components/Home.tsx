import { Link } from "react-router-dom";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Welcome to My Portfolio
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Full-stack developer specializing in React, Node.js, and cloud
              technologies
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/about"
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                About Me
              </Link>
              <Link
                to="/projects"
                className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

import { FaLinkedin, FaDownload } from "react-icons/fa";

const About = () => {
  return (
    <div className="w-full px-2 sm:px-4 lg:px-6">
      {/* Action Buttons */}
      <div className="items-center flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12 justify-center">
        <a
          href="https://www.linkedin.com/in/ignatius-mutizwa-7662b5229/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-400 text-gray-900 rounded-lg hover:bg-green-300 transition-colors duration-200"
        >
          <FaLinkedin className="text-xl" />
          <span>LinkedIn</span>
        </a>
        <a
          href="/cv.pdf"
          download
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          <FaDownload className="text-xl" />
          <span>My CV</span>
        </a>
      </div>

      <div className="text-gray-200 mb-12 text-center">
        I am a developer who specializes in building scalable, high-impact web
        and mobile applications. I tackle complex challenges and create
        solutions that improve user experiences and drive real results. With a
        focus on both the front-end and back-end, I bring ideas to life with
        technology that makes a difference.
      </div>

      <div className="space-y-12">
        {/* Professional Experience Section */}
        <section>
          <div className="flex flex-col items-center mb-8 text-center">
            <FaLinkedin className="text-2xl text-green-400 mb-2" />
            <h3 className="text-2xl font-bold text-green-400 tracking-wide">
              PROFESSIONAL EXPERIENCE
            </h3>
          </div>
          <div className="space-y-8">
            <div className="border-l-2 border-green-400 pl-6 text-center">
              <h4 className="text-xl font-semibold text-green-400 mb-2">
                Software Engineer - Fluff Software
              </h4>
              <p className="text-gray-400 mb-4">
                Sep 2023 - Present · Remote (Swindon, England)
              </p>
              <ul className="list-none text-gray-200 space-y-3">
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>
                    Full-stack development using React.js, Next.js, and Tailwind
                    CSS
                  </span>
                </li>
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>
                    Cross-platform mobile development with React Native and Expo
                  </span>
                </li>
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Backend development with RESTful APIs and GraphQL</span>
                </li>
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>
                    Security implementation using AWS Cognito, NextAuth, and
                    OAuth
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-green-400 pl-6 text-center">
              <h4 className="text-xl font-semibold text-green-400 mb-2">
                Senior Software Engineer - GotBot.Ai
              </h4>
              <p className="text-gray-400 mb-4">
                2023 · Contract (South Africa)
              </p>
              <ul className="list-none text-gray-200 space-y-3">
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Developed conversational agents and chatbots</span>
                </li>
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>
                    Worked with NLP, AWS, Kubernetes, and various cloud
                    technologies
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-green-400 pl-6 text-center">
              <h4 className="text-xl font-semibold text-green-400 mb-2">
                Full Stack Developer - MfundoPedia
              </h4>
              <p className="text-gray-400 mb-4">
                2021 - 2022 · Hybrid (South Africa)
              </p>
              <ul className="list-none text-gray-200 space-y-3">
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>
                    Full-stack development with React, Vue.js, Angular, and
                    Ionic
                  </span>
                </li>
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Mobile app development using Flutter and Dart</span>
                </li>
              </ul>
            </div>

            <div className="border-l-2 border-green-400 pl-6 text-center">
              <h4 className="text-xl font-semibold text-green-400 mb-2">
                Frontend Web Developer - Digileads
              </h4>
              <p className="text-gray-400 mb-4">
                Jan 2018 - Feb 2021 · Remote (South Africa)
              </p>
              <ul className="list-none text-gray-200 space-y-3">
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Web design and WordPress development</span>
                </li>
                <li className="flex flex-col items-center space-y-2">
                  <FaLinkedin className="text-green-400 mt-1 flex-shrink-0" />
                  <span>Managed and maintained multiple client websites</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section>
          <div className="flex flex-col items-center mb-8 text-center">
            <FaLinkedin className="text-2xl text-green-400 mb-2" />
            <h3 className="text-2xl font-bold text-green-400 tracking-wide">
              EDUCATION
            </h3>
          </div>
          <div className="space-y-8">
            <div className="border-l-2 border-green-400 pl-6 text-center">
              <h4 className="text-xl font-semibold text-green-400 mb-4">
                Harvard Online
              </h4>
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-medium text-green-400 mb-2">
                    CS50x - Computer Science
                  </h5>
                  <p className="text-gray-400 mb-1">2019 - 2021</p>
                  <p className="text-gray-200">
                    CS50 Certificate in Computer Science
                  </p>
                </div>
                <div>
                  <h5 className="text-lg font-medium text-green-400 mb-2">
                    CS50AI - Artificial Intelligence
                  </h5>
                  <p className="text-gray-400">2020 - 2022</p>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-green-400 pl-6 text-center">
              <h4 className="text-xl font-semibold text-green-400 mb-4">
                freeCodeCamp
              </h4>
              <div className="space-y-6">
                <div>
                  <h5 className="text-lg font-medium text-green-400 mb-2">
                    Scientific Computing with Python
                  </h5>
                  <p className="text-gray-400">2020 - 2021</p>
                </div>
                <div>
                  <h5 className="text-lg font-medium text-green-400 mb-2">
                    Responsive Web Design
                  </h5>
                  <p className="text-gray-400">2020 - 2021</p>
                </div>
                <div>
                  <h5 className="text-lg font-medium text-green-400 mb-2">
                    JavaScript Algorithms and Data Structures
                  </h5>
                  <p className="text-gray-400">2021 - 2022</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section>
          <p className="text-gray-200 text-center">
            With over 6 years of experience in software development, I've built
            a strong foundation in both frontend and backend technologies. My
            expertise spans from web development to mobile applications, with a
            particular focus on creating responsive, user-friendly interfaces
            and robust backend systems. I'm passionate about leveraging
            technology to solve real-world problems and create impactful
            solutions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;

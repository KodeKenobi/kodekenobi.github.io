import Navbar from "./Navbar";
import { FaUsers, FaStore, FaHandshake, FaAndroid } from "react-icons/fa";
import Footer from "./Footer";

const NusuruPage = () => {
  const features = [
    {
      icon: (
        <FaUsers className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      title: "For Service Providers",
      description:
        "A platform for local service providers to showcase their services and connect with potential clients. Whether you clean shoes, fix pipes, or offer any service, get noticed in your community.",
    },
    {
      icon: (
        <FaStore className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      title: "Marketplace",
      description:
        "A dedicated marketplace where people can post products for sale by category - from clothes to kitchenware. Perfect for those who need to sell items to make ends meet.",
    },
    {
      icon: (
        <FaHandshake className="w-8 h-8 animate-float text-green-400 group-hover:text-green-300 transition-all duration-300" />
      ),
      title: "Community First",
      description:
        "Built for the community, by the community. No middlemen, no complicated steps. Just direct connections between service providers and those who need their services.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <Navbar />

      <div className="flex-1 pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 opacity-20 animate-gradient"></div>
        <div className="w-full relative">
          <div className="mt-4 terminal-window mx-auto shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fade-in px-4 sm:px-8 py-4 sm:py-6">
            <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base">
              <div className="animate-fade-in">
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center">
                  Nusuru
                  <span className="animate-blink">_</span>
                </div>

                {/* Download Button */}
                <div className="flex justify-center mb-12">
                  <a
                    href="https://github.com/KodeKenobi/kodekenobi.github.io/releases/download/v2.0.1/nusuru-v2.0.1.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:-translate-y-1"
                  >
                    <FaAndroid className="w-6 h-6" />
                    <span className="text-lg font-semibold">Download App</span>
                  </a>
                </div>

                <div className="max-w-4xl mx-auto">
                  {/* Project Overview */}
                  <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-green-300 mb-4">
                      Project Overview
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      I've been building something close to my heart — a mobile
                      app for the everyday hustler. Built with React Native
                      (Expo) and Supabase, this app is for people like me — the
                      ones who wake up every day trying to make a living, one
                      hustle at a time.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Too often, every day service providers struggle to get
                      their services seen. I want to be able to change that.
                      This app gives local service providers — whether you clean
                      shoes, fix broken pipes, offer cleaning help, sell
                      amakota, or run any side hustle — a space to post your
                      services and get noticed.
                    </p>
                  </div>

                  {/* App Videos */}
                  <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-green-300 mb-6">
                      View App Videos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 transition-all duration-500 border border-gray-700 hover:border-green-500/50 overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl animate-gradient-x"></div>

                        {/* Pulsing glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 rounded-xl opacity-70 animate-pulse-slow"></div>

                        <div className="relative z-10">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300 mb-4">
                            User Dashboard
                          </h3>
                          <video
                            className="w-full rounded-lg"
                            controls
                            src="https://fteifbqniqfmiuipvbug.supabase.co/storage/v1/object/public/website//user.mp4"
                          />
                        </div>
                      </div>
                      <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 transition-all duration-500 border border-gray-700 hover:border-green-500/50 overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl animate-gradient-x"></div>

                        {/* Pulsing glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 rounded-xl opacity-70 animate-pulse-slow"></div>

                        <div className="relative z-10">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300 mb-4">
                            Seller Dashboard
                          </h3>
                          <video
                            className="w-full rounded-lg"
                            controls
                            src="https://fteifbqniqfmiuipvbug.supabase.co/storage/v1/object/public/website//seller.mp4"
                          />
                        </div>
                      </div>
                      <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 transition-all duration-500 border border-gray-700 hover:border-green-500/50 overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl animate-gradient-x"></div>

                        {/* Pulsing glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 rounded-xl opacity-70 animate-pulse-slow"></div>

                        <div className="relative z-10">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300 mb-4">
                            Provider Dashboard
                          </h3>
                          <video
                            className="w-full rounded-lg"
                            controls
                            src="https://fteifbqniqfmiuipvbug.supabase.co/storage/v1/object/public/website//provider.mp4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-green-300 mb-6">
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {features.map((feature) => (
                        <div
                          key={feature.title}
                          className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 transition-all duration-500 border border-gray-700 hover:border-green-500/50 overflow-hidden"
                        >
                          {/* Animated gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl animate-gradient-x"></div>

                          {/* Pulsing glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-blue-500/30 to-purple-500/30 rounded-xl opacity-70 animate-pulse-slow"></div>

                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                              <div className="text-green-400 transform group-hover:scale-110 transition-transform duration-300 group-hover:text-green-300">
                                {feature.icon}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-blue-300 transition-all duration-300 mb-3">
                              {feature.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mission Statement */}
                  <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-green-300 mb-4">
                      Our Mission
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      This isn't just an app. It's a digital notice board for
                      the people. For the domestic workers, the young guys
                      fixing shoes on the corner, the lady selling vetkoek to
                      feed her kids, the man who's an electrician but doesn't
                      know where to find clients — this is for you.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Technology should serve everyone, not just those at the
                      top.
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-green-300 mb-4">
                      Tech Stack
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        "React Native",
                        "Expo",
                        "Supabase",
                        "Edge Functions",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-700 hover:border-green-500/50 hover:text-green-400 transition-all duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="text-center">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      If this resonates with you, or you know someone who'd
                      benefit, I'd love your feedback, shares, or support.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Let's give hustlers a fighting chance.
                      <br />
                      Let's make everyday services easier to find.
                      <br />
                      Let's build community through tech.
                    </p>
                  </div>
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NusuruPage;

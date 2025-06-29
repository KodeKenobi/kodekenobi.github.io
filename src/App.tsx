import { FaGithub, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
// import BlurText from "./components/BlurText/BlurText";
import Hyperspeed from "./components/Hyperspeed/Hyperspeed";
import SplashCursor from "./components/SplashCursor/SplashCursor";
import { HyperText } from "./components/HyperText/HyperText";
import Hero from "./components/Hero";

console.log("🚀 [App.tsx] Component module loaded");

function App() {
  console.log("🔄 [App.tsx] Component rendering");
  const location = useLocation();
  const navigate = useNavigate();
  console.log("🔍 [App.tsx] Current route:", location.pathname);

  // For blinking cursor animation
  const cursorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const [input, setInput] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState("");
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStep, setInstallStep] = useState(0);

  const installMessages = [
    "npm hr hireme@latest init... ",
    "✔ Preflight checks.... ",
    "✔ Verifying framework. Found Gooddev.js.... ",
    "✔ Validating import alias.... ",
    "✔ Creating .env file.... ",
    "✔ Creating package.json file.... ",
    "✔ Installing dependencies. ",
    "Success! Project initialization completed.",
  ];

  useEffect(() => {
    let installTimeout: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;
    if (isInstalling) {
      console.log("🔄 [App.tsx] Starting installation process");
      setInstallStep(0);
      // Animate steps
      stepTimeout = setInterval(() => {
        setInstallStep((prev) => {
          const next = prev < installMessages.length - 1 ? prev + 1 : prev;
          console.log(`🔄 [App.tsx] Installation step: ${next}`);
          return next;
        });
      }, 400);
      // After 2.5s, navigate to Home page
      installTimeout = setTimeout(() => {
        console.log(
          "✅ [App.tsx] Installation complete, navigating to Home page"
        );
        setIsInstalling(false);
        setShowContent(false);
        clearInterval(stepTimeout);
        navigate("/home");
      }, 4500);
    }
    return () => {
      console.log("🧹 [App.tsx] Cleaning up installation timeouts");
      clearTimeout(installTimeout);
      clearInterval(stepTimeout);
    };
  }, [isInstalling, navigate]);

  useEffect(() => {
    return () => {
      console.log("👋 [App.tsx] Component unmounting");
    };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("🔄 [App.tsx] Input changed:", e.target.value);
    setInput(e.target.value);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("🔍 [App.tsx] Enter key pressed, input:", input);
      if (input.trim() === "npm run dev") {
        console.log(
          "✅ [App.tsx] Valid command entered, starting installation"
        );
        setIsInstalling(true);
        setError("");
      } else {
        console.log("❌ [App.tsx] Invalid command:", input);
        setError(`command not found: ${input}`);
        setInput("");
      }
    }
  };

  console.log("🎨 [App.tsx] Rendering component JSX");
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/hero" element={<Hero />} />
      <Route
        path="/"
        element={
          <>
            <SplashCursor />
            <Hyperspeed
              effectOptions={{
                onSpeedUp: () => {},
                onSlowDown: () => {},
                distortion: "turbulentDistortion",
                length: 400,
                roadWidth: 10,
                islandWidth: 2,
                lanesPerRoad: 4,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.4,
                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.03, 400 * 0.2],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0xffffff,
                  brokenLines: 0xffffff,
                  leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                  rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                  sticks: 0x03b3c3,
                },
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="min-h-screen flex items-center justify-center bg-transparent px-1 sm:px-2 pb-0">
                <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                  {/* Terminal Window */}
                  <div className="mt-4 terminal-window mx-auto border border-gray-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fade-in px-2 sm:px-6 py-2 sm:py-4">
                    {/* Terminal Header */}
                    <div className="terminal-header flex items-center justify-between px-2 sm:px-4">
                      <div className="flex items-center space-x-2">
                        <div className="terminal-button bg-terminal-red animate-pulse hover:scale-110 transition-transform duration-200 shadow-lg"></div>
                        <div className="terminal-button bg-terminal-yellow animate-pulse hover:scale-110 transition-transform duration-200 shadow-lg"></div>
                        <div className="terminal-button bg-terminal-green animate-pulse hover:scale-110 transition-transform duration-200 shadow-lg"></div>
                      </div>
                      <div className="text-xs text-gray-300 font-mono select-none truncate max-w-[120px] sm:max-w-xs">
                        <HyperText
                          className="text-xs text-gray-300 font-mono select-none truncate max-w-[120px] sm:max-w-xs"
                          duration={1000}
                          delay={100}
                        >
                          kode@kenobi:~
                        </HyperText>
                      </div>
                    </div>

                    <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base overflow-x-auto break-words">
                      {/* Interactive Prompt */}
                      {!showContent && !isInstalling && (
                        <div className="mb-8">
                          <div className="flex flex-wrap items-center text-green-400 text-base sm:text-lg font-mono mb-2">
                            <span className="font-bold">
                              <HyperText
                                className="font-bold"
                                duration={1000}
                                delay={100}
                              >
                                kode@kenobi
                              </HyperText>
                            </span>
                            <span className="mx-1">
                              <HyperText
                                className="mx-1"
                                duration={1000}
                                delay={100}
                              >
                                :
                              </HyperText>
                            </span>
                            <span className="text-blue-400">
                              <HyperText
                                className="text-blue-400"
                                duration={1000}
                                delay={100}
                              >
                                ~
                              </HyperText>
                            </span>
                            <span className="mx-1">
                              <HyperText
                                className="mx-1"
                                duration={1000}
                                delay={100}
                              >
                                $
                              </HyperText>
                            </span>
                            {/* Input area: highlight and input stacked */}
                            <span
                              className="relative flex-1 min-w-[2ch] ml-1"
                              style={{ display: "inline-block" }}
                            >
                              {/* Syntax-highlighted text (visible) */}
                              <span
                                className="pointer-events-none select-none whitespace-pre font-mono text-base sm:text-lg h-full flex items-center z-0 w-full absolute top-0 left-0"
                                style={{ color: "inherit" }}
                              >
                                {(() => {
                                  const tokens = input.split(/(\s+)/);
                                  let out = [];
                                  let idx = 0;
                                  // npm
                                  if (tokens[0] === "npm") {
                                    out.push(
                                      <span
                                        key={idx++}
                                        className="text-yellow-400"
                                      >
                                        npm
                                      </span>
                                    );
                                    if (tokens.length > 1) {
                                      out.push(
                                        <span key={idx++}>{tokens[1]}</span>
                                      );
                                    }
                                    // run
                                    if (tokens[2] === "run") {
                                      out.push(
                                        <span
                                          key={idx++}
                                          className="text-green-400"
                                        >
                                          run
                                        </span>
                                      );
                                      if (tokens.length > 3) {
                                        out.push(
                                          <span key={idx++}>{tokens[3]}</span>
                                        );
                                      }
                                      // dev
                                      if (tokens[4] === "dev") {
                                        out.push(
                                          <span
                                            key={idx++}
                                            className="text-green-400"
                                          >
                                            dev
                                          </span>
                                        );
                                        if (tokens.length > 5) {
                                          out.push(
                                            <span key={idx++}>
                                              {tokens.slice(5).join("")}
                                            </span>
                                          );
                                        }
                                      } else if (tokens.length > 4) {
                                        out.push(
                                          <span key={idx++}>{tokens[4]}</span>
                                        );
                                      }
                                    } else if (tokens.length > 2) {
                                      out.push(
                                        <span key={idx++}>
                                          {tokens.slice(2).join("")}
                                        </span>
                                      );
                                    }
                                  } else if (tokens[0] && tokens[0] !== "") {
                                    // np or anything else
                                    if (tokens[0].startsWith("np")) {
                                      out.push(
                                        <span
                                          key={idx++}
                                          className="text-gray-400"
                                        >
                                          {tokens[0]}
                                        </span>
                                      );
                                    } else {
                                      out.push(
                                        <span
                                          key={idx++}
                                          className="text-gray-400"
                                        >
                                          {tokens[0]}
                                        </span>
                                      );
                                    }
                                    if (tokens.length > 1) {
                                      out.push(
                                        <span key={idx++}>
                                          {tokens.slice(1).join("")}
                                        </span>
                                      );
                                    }
                                  }
                                  return out.length ? (
                                    out
                                  ) : (
                                    <span className="text-gray-400"> </span>
                                  );
                                })()}
                              </span>
                              <input
                                ref={inputRef}
                                className="terminal-caret bg-transparent outline-none border-none text-green-200 font-mono w-full text-base sm:text-lg px-0 relative z-10"
                                value={input}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                spellCheck={false}
                                style={{
                                  background: "transparent",
                                  color: "transparent",
                                  caretColor: "#4ade80",
                                }}
                              />
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs sm:text-sm mt-2">
                            <HyperText as="span">Type:</HyperText>{" "}
                            <span className="font-mono bg-gray-800 px-2 py-1 rounded">
                              npm run dev
                            </span>{" "}
                            <HyperText as="span">and press Enter</HyperText>
                          </div>
                          {error && (
                            <div className="text-red-400 mt-2 font-mono text-xs sm:text-sm">
                              {error}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Fake install animation */}
                      {isInstalling && (
                        <div className="font-mono text-green-300 animate-fade-in">
                          {installMessages
                            .slice(0, installStep + 1)
                            .map((msg, i) => (
                              <div key={i} className="flex items-center">
                                <span>{msg}</span>
                                {i === installStep &&
                                  i !== installMessages.length - 1 && (
                                    <span className="ml-2 animate-blink">
                                      ...
                                    </span>
                                  )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Main Content */}
                      {showContent && <></>}
                    </div>
                  </div>

                  {/* Footer */}
                  <footer className="mt-8 mb-0">
                    <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mb-6 gap-y-2">
                      <a
                        href="https://github.com/kodekenobi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link rounded-full p-2 bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-md"
                      >
                        <FaGithub className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.facebook.com/kodekenobi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link rounded-full p-2 bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-md"
                      >
                        <FaFacebook className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.twitter.com/kodekenobi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link rounded-full p-2 bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-md"
                      >
                        <FaTwitter className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.instagram.com/kodekenobi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link rounded-full p-2 bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-md"
                      >
                        <FaInstagram className="w-6 h-6" />
                      </a>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </>
        }
      />
    </Routes>
  );
}

export default App;

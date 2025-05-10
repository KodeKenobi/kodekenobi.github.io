import { FaGithub, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

console.log("🚀 App.tsx: Component starting to load");

function App() {
  console.log("🔄 App.tsx: Component rendering");
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
    "Installing packages... ",
    "Resolving packages... ",
    "Fetching packages... ",
    "Linking dependencies... ",
    "Building... ",
    "Done!",
  ];

  useEffect(() => {
    console.log("✅ App.tsx: Component mounted");
    if (cursorRef.current) {
      cursorRef.current.animate(
        [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }],
        {
          duration: 1200,
          iterations: Infinity,
        }
      );
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [showContent]);

  useEffect(() => {
    if (ghostRef.current) {
      // +2 for caret
      ghostRef.current.style.width = `${ghostRef.current.offsetWidth + 2}px`;
    }
  }, [input]);

  useEffect(() => {
    let installTimeout: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;
    if (isInstalling) {
      setInstallStep(0);
      // Animate steps
      stepTimeout = setInterval(() => {
        setInstallStep((prev) =>
          prev < installMessages.length - 1 ? prev + 1 : prev
        );
      }, 400);
      // After 2.5s, show content
      installTimeout = setTimeout(() => {
        setIsInstalling(false);
        setShowContent(true);
        clearInterval(stepTimeout);
      }, 2500);
    }
    return () => {
      clearTimeout(installTimeout);
      clearInterval(stepTimeout);
    };
  }, [isInstalling]);

  useEffect(() => {
    return () => {
      console.log("👋 App.tsx: Component unmounting");
    };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim() === "npm run dev") {
        setIsInstalling(true);
        setError("");
      } else {
        setError(`command not found: ${input}`);
        setInput("");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-1 sm:px-2 pb-0">
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
              kode@kenobi:~
            </div>
          </div>

          <div className="terminal-content font-mono animate-slide-up px-1 sm:px-4 py-2 sm:py-6 text-[0.97rem] sm:text-base overflow-x-auto break-words">
            {/* Interactive Prompt */}
            {!showContent && !isInstalling && (
              <div className="mb-8">
                <div className="flex flex-wrap items-center text-green-400 text-base sm:text-lg font-mono mb-2">
                  <span className="font-bold">kode@kenobi</span>
                  <span className="mx-1">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="mx-1">$</span>
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
                            <span key={idx++} className="text-yellow-400">
                              npm
                            </span>
                          );
                          if (tokens.length > 1) {
                            out.push(<span key={idx++}>{tokens[1]}</span>);
                          }
                          // run
                          if (tokens[2] === "run") {
                            out.push(
                              <span key={idx++} className="text-green-400">
                                run
                              </span>
                            );
                            if (tokens.length > 3) {
                              out.push(<span key={idx++}>{tokens[3]}</span>);
                            }
                            // dev
                            if (tokens[4] === "dev") {
                              out.push(
                                <span key={idx++} className="text-green-400">
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
                              out.push(<span key={idx++}>{tokens[4]}</span>);
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
                              <span key={idx++} className="text-gray-400">
                                {tokens[0]}
                              </span>
                            );
                          } else {
                            out.push(
                              <span key={idx++} className="text-gray-400">
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
                  Type:{" "}
                  <span className="font-mono bg-gray-800 px-2 py-1 rounded">
                    npm run dev
                  </span>{" "}
                  and press Enter
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
                {installMessages.slice(0, installStep + 1).map((msg, i) => (
                  <div key={i} className="flex items-center">
                    <span>{msg}</span>
                    {i === installStep && i !== installMessages.length - 1 && (
                      <span className="ml-2 animate-blink">...</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Main Content */}
            {showContent && (
              <div className="animate-fade-in">
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center">
                  Kode Kenobi<span className="animate-blink">_</span>
                </div>

                <div className="topic-header">COMPANY NAME</div>
                <div className="topic-text">Kode Kenobi</div>

                <div className="topic-header">DEVELOPER NICK(S)</div>
                <div className="topic-text">
                  Kenobi, General Kenobi, Kobe, Kopenikus
                </div>

                <div className="topic-header">DESCRIPTION</div>
                <div className="topic-text">
                  MERN Stack Specialist · React.js, React Native, Redux,
                  Next.js, TypeScript, Tailwind CSS, Material UI, AWS, Firebase,
                  MongoDB, REST, GraphQL, SQL, Node.js, Docker, Kubernetes,
                  Cognito, Expo, Supabase, CI/CD, GitHub Actions, Vercel, Linux,
                  Bash, Agile, Figma, OpenAI API, and more.
                </div>

                <div className="topic-header">CONTACT METHODS</div>
                <div className="topic-text">
                  <a
                    href="mailto:kodekenobi@gmail.com"
                    className="text-green-400 hover:text-green-300"
                  >
                    E-mail
                  </a>{" "}
                  - This would be the best way to contact me.
                </div>

                <div className="topic-header">WEBSITE</div>
                <div className="topic-text">
                  Now, introductions aside, kindly visit my website{" "}
                  <Link
                    to="/home"
                    className="text-green-400 hover:text-green-300"
                  >
                    here
                  </Link>
                  .
                </div>

                <div className="topic-header">My C.V</div>
                <div className="topic-text">
                  You can download my C.V{" "}
                  <a
                    href="/assets/docs/cv.pdf"
                    className="text-green-400 hover:text-green-300"
                    download
                  >
                    here
                  </a>
                  .
                </div>

                <div className="mt-8 text-xs sm:text-sm text-gray-500 text-center">
                  Latest Update - 05/22/2021 V-21.5.22
                </div>
              </div>
            )}
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
  );
}

export default App;

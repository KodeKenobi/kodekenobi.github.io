import React from "react";

interface AboutTimelineProps {
  currentSubsection: number;
  totalSubsections: number;
  onSubsectionChange: (index: number) => void;
}

export default function AboutTimeline({
  currentSubsection,
  totalSubsections,
  onSubsectionChange,
}: AboutTimelineProps) {
  const subsections = Array.from({ length: totalSubsections }, (_, i) => i);

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="relative">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <span className="text-white text-sm font-light tracking-widest relative z-10">
              ABOUT
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-sm"></div>
          </div>
        </div>

        <div className="relative">
          <div className="relative w-16 h-80 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>

            {subsections.map((index) => {
              const isActive = index === currentSubsection;
              const progress = (index / (totalSubsections - 1)) * 100;
              const isCompleted = index < currentSubsection;

              return (
                <div
                  key={index}
                  className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out"
                  style={{ top: `${progress}%` }}
                >
                  <div className="relative group">
                    <button
                      onClick={() => onSubsectionChange(index)}
                      className={`
                        w-5 h-5 rounded-full transition-all duration-700 transform relative cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50
                        ${
                          isActive
                            ? "scale-125 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-lg shadow-cyan-400/50"
                            : isCompleted
                            ? "scale-110 bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-400/30 hover:scale-125"
                            : "scale-100 bg-white/20 hover:bg-white/40 hover:scale-110"
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-ping opacity-60"></div>
                      )}

                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>

                    {isActive && (
                      <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-md animate-pulse"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";

const CHARS = "ABCDEFGHIKLMNOPQRSTVXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number;
  maxIterations?: number;
  trigger?: any;
}

export const DecryptText: React.FC<DecryptTextProps> = ({
  text,
  className = "",
  speed = 30,
  maxIterations = 10,
  trigger,
}) => {
  const [displayText, setDisplayText] = useState(text);

  const decrypt = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / maxIterations;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, maxIterations]);

  useEffect(() => {
    const cleanup = decrypt();
    return cleanup;
  }, [decrypt, trigger]);

  return <span className={className}>{displayText}</span>;
};

export default DecryptText;

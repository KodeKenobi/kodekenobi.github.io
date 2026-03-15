import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

/**
 * GSAP-powered text scramble/decode effect.
 * Text "decodes" character by character from random glyphs to the final string.
 * 
 * @param text - The target text to decode to
 * @param trigger - When true, starts the scramble animation
 * @param duration - Total duration in seconds (default 1.5)
 * @param stagger - Delay between each character starting to resolve (default 0.04)
 */
export function useTextScramble(
  text: string,
  trigger: boolean,
  duration: number = 1.5,
  stagger: number = 0.04
) {
  const [display, setDisplay] = useState(text.replace(/./g, ' '));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trigger) {
      setDisplay(text.replace(/./g, ' '));
      return;
    }

    const chars = text.split('');
    const resolved = new Array(chars.length).fill(false);
    const current = new Array(chars.length).fill(' ');

    // Start cycling random characters
    intervalRef.current = setInterval(() => {
      for (let i = 0; i < chars.length; i++) {
        if (!resolved[i]) {
          current[i] = chars[i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(current.join(''));
    }, 40);

    // Schedule each character to resolve
    chars.forEach((char, i) => {
      const delay = i * stagger * 1000;
      setTimeout(() => {
        resolved[i] = true;
        current[i] = char;
        setDisplay(current.join(''));
      }, delay + duration * 300); // Small initial delay before resolving starts
    });

    // Cleanup
    const totalTime = (chars.length * stagger + duration) * 1000;
    const cleanup = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(text);
    }, totalTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(cleanup);
    };
  }, [trigger, text, duration, stagger]);

  return display;
}

/**
 * TextScramble component — renders text with a decode/scramble effect.
 */
export const TextScramble: React.FC<{
  text: string;
  trigger: boolean;
  className?: string;
  duration?: number;
  stagger?: number;
}> = ({ text, trigger, className = '', duration, stagger }) => {
  const display = useTextScramble(text, trigger, duration, stagger);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {display.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            minWidth: char === ' ' ? '0.25em' : undefined,
            opacity: char === text[i] ? 1 : 0.4,
            color: char === text[i] ? undefined : '#c9a84c',
            transition: 'opacity 0.15s, color 0.15s',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

/**
 * GSAP parallax helper — moves an element based on mouse position.
 * Attach to a container's onMouseMove.
 */
export function useMouseParallax(strength: number = 0.02) {
  const ref = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    xTo.current = gsap.quickTo(ref.current, 'x', { duration: 1.2, ease: 'power3.out' });
    yTo.current = gsap.quickTo(ref.current, 'y', { duration: 1.2, ease: 'power3.out' });
  }, []);

  const onMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!xTo.current || !yTo.current) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    xTo.current((e.clientX - cx) * strength);
    yTo.current((e.clientY - cy) * strength);
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
  };

  return { ref, onMouseMove, onMouseLeave };
}

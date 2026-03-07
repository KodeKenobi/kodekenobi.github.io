import React, { useRef, useState } from "react";

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Ripple: React.FC<RippleProps> = ({
  children,
  className = "",
  onClick,
}) => {
  const [ripples, setRipples] = useState<any[]>([]);
  const rippleContainer = useRef<HTMLDivElement>(null);

  const createRipple = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const container = rippleContainer.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple = {
      key: Date.now(),
      style: {
        left: x,
        top: y,
        width: size,
        height: size,
      },
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
    if (onClick) onClick(event);
  };

  return (
    <div
      ref={rippleContainer}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="pointer-events-none absolute rounded-full bg-blue-400/40 backdrop-blur-md animate-ripple"
          style={ripple.style}
        />
      ))}
    </div>
  );
};

export default Ripple;

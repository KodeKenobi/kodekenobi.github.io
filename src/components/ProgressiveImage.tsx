import React, { useState } from "react";

interface ProgressiveImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  placeholderSrc?: string;
  children?: React.ReactNode;
}

const defaultPlaceholder =
  "data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='600' height='400' fill='%23222'/%3E%3C/svg%3E";

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt = "",
  className = "",
  style = {},
  placeholderSrc = defaultPlaceholder,
  children,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      {/* Placeholder (blurred) */}
      <img
        src={placeholderSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 blur-md scale-105 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        draggable={false}
        aria-hidden="true"
      />
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        draggable={false}
        style={{ zIndex: 1 }}
      />
      {/* Foreground content (e.g. overlay, text) */}
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
};

export default ProgressiveImage;

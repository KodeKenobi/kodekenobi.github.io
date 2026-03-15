import React, { useRef, useCallback } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How far element follows cursor (default 0.3)
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * MagneticButton — element subtly pulls toward cursor on hover.
 * Uses GSAP quickTo for buttery smooth magnetic attraction.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.3,
  onMouseEnter,
  onMouseLeave,
  onClick,
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!ref.current) return;
    xTo.current = gsap.quickTo(ref.current, 'x', { duration: 0.4, ease: 'power3.out' });
    yTo.current = gsap.quickTo(ref.current, 'y', { duration: 0.4, ease: 'power3.out' });
    onMouseEnter?.();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    onMouseLeave?.();
  }, [onMouseLeave]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current || !xTo.current || !yTo.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    xTo.current(dx);
    yTo.current(dy);
  }, [strength]);

  return (
    <Tag
      ref={ref as any}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{ willChange: 'transform' }}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;

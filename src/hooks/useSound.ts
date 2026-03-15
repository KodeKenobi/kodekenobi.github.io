import { useSyncExternalStore, useCallback } from 'react';
import { soundEngine, type SectionId } from '../lib/SoundEngine';

/**
 * React hook for the SoundEngine singleton.
 * 
 * Usage:
 *   const { playHover, playClick, playTransition, toggleMute, isMuted } = useSound();
 */
export function useSound() {
  const isMuted = useSyncExternalStore(
    (cb) => soundEngine.subscribe(cb),
    () => soundEngine.isMuted
  );

  const playHover = useCallback(() => soundEngine.playHover(), []);
  const playClick = useCallback(() => soundEngine.playClick(), []);
  const playBounce = useCallback((volume: number = 1.0) => soundEngine.playBounce(volume), []);
  const playTransition = useCallback(
    (direction: 'up' | 'down' = 'down') => soundEngine.playTransition(direction),
    []
  );
  const toggleMute = useCallback(() => soundEngine.toggleMute(), []);
  const setSection = useCallback((section: SectionId) => soundEngine.setSection(section), []);

  return {
    isMuted,
    playHover,
    playClick,
    playBounce,
    playTransition,
    toggleMute,
    setSection,
  };
}

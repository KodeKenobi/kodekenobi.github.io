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
  const playShuffle = useCallback(() => soundEngine.playShuffle(), []);
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
    playShuffle,
    playTransition,
    toggleMute,
    setSection,
  };
}

/**
 * SoundEngine — Procedural ambient sound system using Web Audio API
 * 
 * No external audio files needed. All sounds are generated procedurally:
 * - Ambient drone: Subtle low-frequency hum that breathes life into the page
 * - Hover tick: Crisp, minimal tick on hover interactions
 * - Click: Satisfying soft snap
 * - Transition whoosh: Sweeping noise burst on section changes
 * - Section ambient: Different subtle tonal shifts per section
 */

type SectionId = 'home' | 'about' | 'skills' | 'experience' | 'projects';

interface SoundEngineState {
  isMuted: boolean;
  isInitialized: boolean;
  currentSection: SectionId;
  masterVolume: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain2: GainNode | null = null;
  private state: SoundEngineState = {
    isMuted: false, // Unmuted by default
    isInitialized: false,
    currentSection: 'home',
    masterVolume: 0.35,
  };
  private listeners: Set<() => void> = new Set();

  // Frequency map for section-specific ambient tones
  private sectionFreqs: Record<SectionId, { f1: number; f2: number; detune: number }> = {
    home: { f1: 55, f2: 82.41, detune: -5 },      // A1 + E2 — expansive, open
    about: { f1: 65.41, f2: 98, detune: 3 },       // C2 + G2 — warm, personal
    skills: { f1: 73.42, f2: 110, detune: -2 },    // D2 + A2 — focused, bright
    experience: { f1: 61.74, f2: 92.5, detune: 5 },// B1 + F#2 — reflective
    projects: { f1: 82.41, f2: 123.47, detune: -3 },// E2 + B2 — energetic
  };

  /**
   * Initialize the audio context. Must be called from a user gesture.
   */
  init(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.state.isInitialized) return;

    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.state.isMuted ? 0 : this.state.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.state.isInitialized = true;
      this.notify();
    } catch (e) {
      console.warn('[SoundEngine] Web Audio API not available:', e);
    }
  }

  /**
   * Start the ambient drone for the current section.
   */
  startAmbient(): void {
    if (!this.ctx || !this.masterGain) return;
    this.stopAmbient();

    const freqs = this.sectionFreqs[this.state.currentSection];

    // Primary oscillator — deep sine
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.connect(this.masterGain);

    this.ambientOsc = this.ctx.createOscillator();
    this.ambientOsc.type = 'sine';
    this.ambientOsc.frequency.value = freqs.f1;
    this.ambientOsc.detune.value = freqs.detune;
    this.ambientOsc.connect(this.ambientGain);
    this.ambientOsc.start();

    // Secondary oscillator — subtle harmonic
    this.ambientGain2 = this.ctx.createGain();
    this.ambientGain2.gain.value = 0;
    this.ambientGain2.connect(this.masterGain);

    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'sine';
    this.ambientOsc2.frequency.value = freqs.f2;
    this.ambientOsc2.detune.value = freqs.detune * 0.5;
    this.ambientOsc2.connect(this.ambientGain2);
    this.ambientOsc2.start();

    // Fade in slowly
    const now = this.ctx.currentTime;
    this.ambientGain.gain.setTargetAtTime(0.06, now, 2);
    this.ambientGain2.gain.setTargetAtTime(0.03, now, 2.5);
  }

  /**
   * Stop the ambient drone with a fade-out.
   */
  private stopAmbient(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, now, 0.3);
    }
    if (this.ambientGain2) {
      this.ambientGain2.gain.setTargetAtTime(0, now, 0.3);
    }

    // Schedule cleanup
    setTimeout(() => {
      try {
        this.ambientOsc?.stop();
        this.ambientOsc2?.stop();
      } catch { /* already stopped */ }
      this.ambientOsc = null;
      this.ambientOsc2 = null;
      this.ambientGain = null;
      this.ambientGain2 = null;
    }, 1000);
  }

  /**
   * Crossfade ambient to a new section.
   */
  setSection(section: SectionId): void {
    if (section === this.state.currentSection) return;
    this.state.currentSection = section;
    if (this.state.isInitialized && !this.state.isMuted) {
      this.startAmbient();
    }
    this.notify();
  }

  /**
   * Play a hover tick — tiny, crisp, satisfying.
   */
  playHover(): void {
    if (!this.ctx || !this.masterGain || this.state.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 3200;
    osc.frequency.setTargetAtTime(1800, now, 0.01);

    gain.gain.value = 0.08;
    gain.gain.setTargetAtTime(0, now + 0.02, 0.01);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Play a focus "charge" sound — rising cinematic hum.
   */
  private focusOsc: OscillatorNode | null = null;
  private focusGain: GainNode | null = null;

  playFocus(): void {
    if (!this.ctx || !this.masterGain || this.state.isMuted) return;
    if (this.focusOsc) return; // Already playing

    const now = this.ctx.currentTime;
    this.focusOsc = this.ctx.createOscillator();
    this.focusGain = this.ctx.createGain();

    this.focusOsc.type = 'sine';
    this.focusOsc.frequency.setValueAtTime(110, now);
    this.focusOsc.frequency.exponentialRampToValueAtTime(440, now + 2);

    this.focusGain.gain.setValueAtTime(0, now);
    this.focusGain.gain.linearRampToValueAtTime(0.12, now + 0.3);

    this.focusOsc.connect(this.focusGain);
    this.focusGain.connect(this.masterGain);
    this.focusOsc.start(now);
  }

  stopFocus(): void {
    if (!this.ctx || !this.focusGain || !this.focusOsc) return;
    const now = this.ctx.currentTime;
    this.focusGain.gain.setTargetAtTime(0, now, 0.1);
    const osc = this.focusOsc;
    setTimeout(() => {
      try { osc.stop(); } catch { }
    }, 500);
    this.focusOsc = null;
    this.focusGain = null;
  }

  /**
   * Play a click — soft, satisfying snap.
   */
  playClick(): void {
    if (!this.ctx || !this.masterGain || this.state.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = 800;
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Play a subtle card shuffle sound — sequence of paper-like flicks.
   */
  playShuffle(): void {
    if (!this.ctx || !this.masterGain || this.state.isMuted) return;

    const now = this.ctx.currentTime;
    const flicks = 8;
    const interval = 0.04;

    for (let i = 0; i < flicks; i++) {
      const time = now + i * interval;
      const duration = 0.06;

      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Grainy noise
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / bufferSize, 4);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 3000 + Math.random() * 2000;
      filter.Q.value = 0.7;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.02, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(time);
      noise.stop(time + duration);
    }
  }

  /**
   * Play a transition whoosh — breathy sweep between sections.
   */
  playTransition(direction: 'up' | 'down' = 'down'): void {
    if (!this.ctx || !this.masterGain || this.state.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 0.5;

    // Noise burst via buffer
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter for the "whoosh" character
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = direction === 'down' ? 2000 : 800;
    filter.frequency.exponentialRampToValueAtTime(
      direction === 'down' ? 400 : 2500,
      now + duration
    );
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;
    gain.gain.setTargetAtTime(0, now + duration * 0.3, duration * 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + duration);

    // Tonal sweep underneath
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    sweep.type = 'sine';
    sweep.frequency.value = direction === 'down' ? 600 : 200;
    sweep.frequency.exponentialRampToValueAtTime(
      direction === 'down' ? 150 : 800,
      now + duration * 0.8
    );
    sweepGain.gain.value = 0.05;
    sweepGain.gain.setTargetAtTime(0, now + duration * 0.5, 0.1);
    sweep.connect(sweepGain);
    sweepGain.connect(this.masterGain);
    sweep.start(now);
    sweep.stop(now + duration);
  }


  /**
   * Toggle mute state.
   */
  toggleMute(): void {
    if (!this.ctx || !this.masterGain) {
      // First interaction — initialize
      this.init();
      if (!this.ctx || !this.masterGain) return;
    }

    // Resume context if suspended (browser autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.state.isMuted = !this.state.isMuted;
    const now = this.ctx.currentTime;

    if (this.state.isMuted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.1);
      this.stopAmbient();
    } else {
      this.masterGain.gain.setTargetAtTime(this.state.masterVolume, now, 0.1);
      this.startAmbient();
    }

    this.notify();
  }

  /**
   * Get current mute state.
   */
  get isMuted(): boolean {
    return this.state.isMuted;
  }

  get isInitialized(): boolean {
    return this.state.isInitialized;
  }

  /**
   * Subscribe to state changes.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

// Singleton
export const soundEngine = new SoundEngine();
export type { SectionId };

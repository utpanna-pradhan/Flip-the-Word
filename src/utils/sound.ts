let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export const soundManager = {
  correct(): void {
    playTone(523.25, 0.1, 'sine', 0.2); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.2), 80); // E5
  },

  wrong(): void {
    playTone(196, 0.15, 'sawtooth', 0.15); // G3
    setTimeout(() => playTone(146.83, 0.2, 'sawtooth', 0.15), 80); // D3
  },

  tap(): void {
    playTone(800, 0.05, 'sine', 0.1);
  },

  levelComplete(): void {
    playTone(523.25, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.2), 100);
    setTimeout(() => playTone(783.99, 0.1, 'sine', 0.2), 200);
    setTimeout(() => playTone(1046.5, 0.2, 'sine', 0.2), 300); // C6
  },

  streak(): void {
    playTone(440, 0.08, 'triangle', 0.15);
    setTimeout(() => playTone(554.37, 0.08, 'triangle', 0.15), 60);
    setTimeout(() => playTone(659.25, 0.12, 'triangle', 0.15), 120);
  },
};

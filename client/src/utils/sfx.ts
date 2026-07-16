/**
 * Lightweight synthesized sound effects using Web Audio API.
 * No external audio files needed — tones are generated on the fly.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

/**
 * Resume the AudioContext after a user gesture so subsequent plays work
 * without a "user didn't interact" warning.
 */
const ensureResumed = async (ctx: AudioContext) => {
  if (ctx.state === "suspended") {
    await ctx.resume().catch(() => undefined);
  }
};

/**
 * Pleasant rising two-tone chime for correct answers.
 * ~220ms total, gentle sine wave.
 */
export const playCorrectSound = async () => {
  try {
    const ctx = getAudioContext();
    await ensureResumed(ctx);
    const now = ctx.currentTime;

    // Tone 1: C5 (523 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 523.25;
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Tone 2: E5 (659 Hz) — starts slightly after the first
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 659.25;
    gain2.gain.setValueAtTime(0.18, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.22);
  } catch {
    // Audio not available — silently ignore.
  }
};

/**
 * Short low buzz for incorrect answers.
 * ~200ms, slightly detuned triangle wave for a soft "wrong" feel.
 */
export const playIncorrectSound = async () => {
  try {
    const ctx = getAudioContext();
    await ensureResumed(ctx);
    const now = ctx.currentTime;

    // Low tone: ~195 Hz (roughly G3)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.linearRampToValueAtTime(170, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);

    // Second slightly dissonant tone for a buzzer effect
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(232, now);
    osc2.frequency.linearRampToValueAtTime(200, now + 0.2);
    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.22);
  } catch {
    // Audio not available — silently ignore.
  }
};

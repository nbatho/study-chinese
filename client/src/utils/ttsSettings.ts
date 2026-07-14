import { useSyncExternalStore } from "react";

export const TTS_SPEED_OPTIONS = [0.5, 0.75, 1] as const;
export type TtsSpeed = (typeof TTS_SPEED_OPTIONS)[number];

const STORAGE_KEY = "study_chinese_tts_speed";
const DEFAULT_SPEED: TtsSpeed = 1;

const isTtsSpeed = (value: unknown): value is TtsSpeed =>
  typeof value === "number" && (TTS_SPEED_OPTIONS as readonly number[]).includes(value);

let currentSpeed: TtsSpeed = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw === null ? NaN : Number(raw);
    return isTtsSpeed(parsed) ? parsed : DEFAULT_SPEED;
  } catch {
    return DEFAULT_SPEED;
  }
})();

const listeners = new Set<() => void>();

export const getTtsSpeed = (): TtsSpeed => currentSpeed;

export const setTtsSpeed = (speed: TtsSpeed) => {
  if (!isTtsSpeed(speed) || speed === currentSpeed) return;
  currentSpeed = speed;
  try {
    localStorage.setItem(STORAGE_KEY, String(speed));
  } catch {
    // Persistence is a convenience only.
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useTtsSpeed = (): [TtsSpeed, (speed: TtsSpeed) => void] => {
  const speed = useSyncExternalStore(subscribe, getTtsSpeed, getTtsSpeed);
  return [speed, setTtsSpeed];
};

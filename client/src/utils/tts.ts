import { getTtsSpeed } from "./ttsSettings";

let currentAudio: HTMLAudioElement | null = null;

const getAudioApiBaseUrl = () => {
  const gatewayUrl = import.meta.env.VITE_API_GATEWAY_URL;

  if (gatewayUrl) {
    return `${gatewayUrl.replace(/\/$/, "")}/api/v1`;
  }

  return `${window.location.origin}/api/v1`;
};

const speakWithBrowser = (text: string, lang: string, speed: number) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = speed;
  window.speechSynthesis.speak(utterance);
};

const speakWithEdgeAudio = async (text: string, lang: string, speed: number) => {
  const url = new URL(`${getAudioApiBaseUrl()}/audio`);
  url.searchParams.set("text", text);
  url.searchParams.set("language", lang);
  url.searchParams.set("speed", String(speed));

  currentAudio?.pause();
  currentAudio = new Audio(url.toString());
  currentAudio.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    if (!currentAudio) {
      reject(new Error("Audio player is unavailable"));
      return;
    }

    currentAudio.addEventListener("playing", () => resolve(), { once: true });
    currentAudio.addEventListener("error", () => reject(new Error("Edge TTS audio failed")), { once: true });
    currentAudio.play().catch(reject);
  });
};

interface SpeakOptions {
  /** Playback rate. Defaults to the user's persisted TTS speed preference. */
  speed?: number;
}

export async function speakChinese(text: string, lang = "zh-CN", options: SpeakOptions = {}) {
  const normalizedText = text.trim();

  if (!normalizedText) return;

  const speed = options.speed ?? getTtsSpeed();

  try {
    await speakWithEdgeAudio(normalizedText, lang, speed);
  } catch {
    speakWithBrowser(normalizedText, lang, speed);
  }
}

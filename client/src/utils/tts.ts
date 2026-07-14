let currentAudio: HTMLAudioElement | null = null;

const getAudioApiBaseUrl = () => {
  const gatewayUrl = import.meta.env.VITE_API_GATEWAY_URL;

  if (gatewayUrl) {
    return `${gatewayUrl.replace(/\/$/, "")}/api/v1`;
  }

  return `${window.location.origin}/api/v1`;
};

const speakWithBrowser = (text: string, lang: string) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
};

const speakWithEdgeAudio = async (text: string, lang: string) => {
  const url = new URL(`${getAudioApiBaseUrl()}/audio`);
  url.searchParams.set("text", text);
  url.searchParams.set("language", lang);

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

export async function speakChinese(text: string, lang = "zh-CN") {
  const normalizedText = text.trim();

  if (!normalizedText) return;

  try {
    await speakWithEdgeAudio(normalizedText, lang);
  } catch {
    speakWithBrowser(normalizedText, lang);
  }
}

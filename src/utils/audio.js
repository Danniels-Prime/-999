import { speak } from './speech';

const BASE = import.meta.env.BASE_URL;

export function playSound(slug, fallbackText, rate = 0.75, langOverride = null) {
  const audio = new Audio(`${BASE}audio/en/${slug}.mp3`);
  audio.onerror = () => speak(fallbackText, rate, langOverride);
  audio.play().catch(() => speak(fallbackText, rate, langOverride));
}

import { speak } from './speech';

const BASE = import.meta.env.BASE_URL;

export function playSound(slug, fallbackText, rate = 0.75, langOverride = null) {
  tryExt(slug, ['mp3', 'm4a'], 0);

  function tryExt(slug, exts, i) {
    if (i >= exts.length) {
      speak(fallbackText, rate, langOverride);
      return;
    }
    const audio = new Audio(`${BASE}audio/en/${slug}.${exts[i]}`);
    audio.onerror = () => tryExt(slug, exts, i + 1);
    audio.play().catch(() => tryExt(slug, exts, i + 1));
  }
}

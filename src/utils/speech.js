let _lang = 'es-ES';

export function setLang(lang) {
  if (lang === 'en') _lang = 'en-US';
  else if (lang === 'ru') _lang = 'ru-RU';
  else _lang = 'es-ES';
}

export function speak(text, rate = 0.75, langOverride = null) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langOverride || _lang;
  utterance.rate = rate;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

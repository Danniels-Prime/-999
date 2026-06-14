let _lang = 'es-ES';

export function setLang(lang) {
  _lang = lang === 'en' ? 'en-US' : 'es-ES';
}

export function speak(text, rate = 0.75) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = _lang;
  utterance.rate = rate;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function speak(text, rate = 0.75) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = rate;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

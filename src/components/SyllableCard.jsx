import { speak } from '../utils/speech';

export default function SyllableCard({ syllable, color, size = 'md' }) {
  return (
    <button
      className={`syllable-card syllable-card--${size}`}
      style={{ '--card-color': color }}
      onClick={() => speak(syllable)}
      aria-label={`Pronunciar ${syllable}`}
    >
      {syllable}
    </button>
  );
}

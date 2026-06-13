import { speak } from '../utils/speech';

const VOWEL_COLORS = ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3'];

export default function VowelRow() {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return (
    <div className="vowel-row">
      <h2 className="section-label">Las vocales</h2>
      <div className="vowel-cards">
        {vowels.map((v, i) => (
          <button
            key={v}
            className="vowel-card"
            style={{ backgroundColor: VOWEL_COLORS[i] }}
            onClick={() => speak(v)}
            aria-label={`Vocal ${v}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

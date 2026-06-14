import { speak } from '../utils/speech';
import { useLang } from '../context/LangContext';

const VOWEL_COLORS = ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3'];

export default function VowelRow() {
  const lang = useLang();
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const label = lang === 'en' ? 'The Vowels' : 'Las vocales';

  return (
    <div className="vowel-row">
      <h2 className="section-label">{label}</h2>
      <div className="vowel-cards">
        {vowels.map((v, i) => (
          <button
            key={v}
            className="vowel-card"
            style={{ backgroundColor: VOWEL_COLORS[i] }}
            onClick={() => speak(v)}
            aria-label={lang === 'en' ? `Vowel ${v}` : `Vocal ${v}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

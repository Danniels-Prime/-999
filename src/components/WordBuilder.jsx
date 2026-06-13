import { speak } from '../utils/speech';

export default function WordBuilder({ syllables, onClear }) {
  const word = syllables.join('');

  return (
    <div className="word-builder">
      <h3 className="word-builder__title">Constructor de palabras</h3>
      <div className="word-builder__syllables">
        {syllables.length === 0
          ? <span className="word-builder__placeholder">Toca una sílaba para empezar...</span>
          : syllables.map((s, i) => (
            <span key={i} className="word-builder__chip">{s}</span>
          ))
        }
      </div>
      {syllables.length > 0 && (
        <div className="word-builder__word">{word}</div>
      )}
      <div className="word-builder__actions">
        <button
          className="btn btn--primary"
          onClick={() => speak(word)}
          disabled={!word}
          aria-label="Leer en voz alta"
        >
          🔊 Leer en voz alta
        </button>
        <button
          className="btn btn--secondary"
          onClick={onClear}
          disabled={!word}
          aria-label="Borrar"
        >
          🗑 Borrar
        </button>
      </div>
    </div>
  );
}

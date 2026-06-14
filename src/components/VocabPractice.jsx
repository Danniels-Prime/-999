import { useState } from 'react';
import { speak } from '../utils/speech';

const MODES = [
  { id: 'listen', label: '🔊 Escuchar', desc: 'Escucha la palabra completa' },
  { id: 'blend', label: '🔤 Mezclar', desc: 'Toca sílaba por sílaba' },
];

export default function VocabPractice({ words, categoryName, onClose }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState('listen');

  const current = words[index];

  const handleListen = () => speak(current.word);
  const handleNext = () => setIndex(i => Math.min(i + 1, words.length - 1));
  const handlePrev = () => setIndex(i => Math.max(i - 1, 0));

  return (
    <div className="vocab-practice">
      <div className="vocab-practice__header">
        <button className="btn btn--back" onClick={onClose}>← Volver</button>
        <span className="flashcard-progress">{categoryName} · {index + 1} / {words.length}</span>
      </div>

      <div className="mode-toggle">
        {MODES.map(m => (
          <button
            key={m.id}
            className={`mode-btn ${mode === m.id ? 'mode-btn--active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flashcard">
        <div className="flashcard__word" style={{ fontSize: '2.8rem' }}>{current.word}</div>

        {mode === 'listen' ? (
          <div className="flashcard__actions">
            <button className="btn btn--listen" onClick={handleListen}>
              🔊 Escuchar
            </button>
          </div>
        ) : (
          <>
            <div className="flashcard__syllables">
              {current.syllables.map((syl, i) => (
                <button
                  key={i}
                  className="flashcard__syl-btn"
                  onClick={() => speak(syl)}
                >
                  {syl}
                </button>
              ))}
            </div>
            <button className="btn btn--listen" onClick={handleListen} style={{ marginTop: 8 }}>
              🔊 Palabra completa
            </button>
          </>
        )}
      </div>

      <div className="flashcard-nav">
        <button className="btn btn--nav" onClick={handlePrev} disabled={index === 0}>← Anterior</button>
        <button className="btn btn--nav btn--next" onClick={handleNext} disabled={index === words.length - 1}>Siguiente →</button>
      </div>
    </div>
  );
}

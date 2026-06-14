import { useState } from 'react';
import { VOCAB_CATEGORIES } from '../data/vocabulary';
import { speak } from '../utils/speech';

export default function VocabBank() {
  const [openCat, setOpenCat] = useState(0);

  return (
    <div className="vocab-bank">
      <h2 className="section-label">Vocabulario</h2>
      <p className="vocab-subtitle">Toca cualquier palabra para escucharla</p>

      {VOCAB_CATEGORIES.map((cat, i) => (
        <div key={cat.name} className="vocab-category">
          <button
            className={`vocab-cat-header ${openCat === i ? 'vocab-cat-header--open' : ''}`}
            onClick={() => setOpenCat(openCat === i ? null : i)}
          >
            <span>{cat.emoji} {cat.name}</span>
            <span className="vocab-cat-count">{cat.words.length} palabras {openCat === i ? '▲' : '▼'}</span>
          </button>

          {openCat === i && (
            <div className="vocab-words">
              {cat.words.map((w, j) => (
                <button
                  key={j}
                  className="vocab-word-btn"
                  onClick={() => speak(w.word)}
                  aria-label={`Escuchar ${w.word}`}
                >
                  <span className="vocab-word">{w.word}</span>
                  <span className="vocab-syllables">{w.syllables.join(' · ')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

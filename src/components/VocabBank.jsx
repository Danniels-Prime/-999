import { useState } from 'react';
import { VOCAB_CATEGORIES } from '../data/vocabulary';
import { speak } from '../utils/speech';
import VocabPractice from './VocabPractice';

export default function VocabBank() {
  const [openCat, setOpenCat] = useState(null);
  const [practicing, setPracticing] = useState(null); // { words, name }

  if (practicing) {
    return (
      <VocabPractice
        words={practicing.words}
        categoryName={practicing.name}
        onClose={() => setPracticing(null)}
      />
    );
  }

  return (
    <div className="vocab-bank">
      <h2 className="section-label">Vocabulario</h2>
      <p className="vocab-subtitle">Toca cualquier palabra para escucharla · o practica una a una</p>

      {VOCAB_CATEGORIES.map((cat, i) => (
        <div key={cat.name} className="vocab-category">
          <div className={`vocab-cat-header ${openCat === i ? 'vocab-cat-header--open' : ''}`}>
            <button
              className="vocab-cat-title"
              onClick={() => setOpenCat(openCat === i ? null : i)}
            >
              <span>{cat.emoji} {cat.name}</span>
              <span className="vocab-cat-count">{cat.words.length} palabras {openCat === i ? '▲' : '▼'}</span>
            </button>
            <button
              className="btn-practice-cat"
              onClick={() => setPracticing({ words: cat.words, name: cat.name })}
              aria-label={`Practicar ${cat.name}`}
            >
              ▶ Practicar
            </button>
          </div>

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

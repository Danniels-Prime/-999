import { useState } from 'react';
import { VOCAB_CATEGORIES } from '../data/vocabulary';
import { VOCAB_EN } from '../data/vocabulary_en';
import { speak } from '../utils/speech';
import VocabPractice from './VocabPractice';
import { useLang } from '../context/LangContext';

export default function VocabBank() {
  const lang = useLang();
  const [openCat, setOpenCat] = useState(null);
  const [practicing, setPracticing] = useState(null); // { words, name }

  const isEn = lang === 'en';
  const categories = isEn
    ? VOCAB_EN.map(c => ({ name: c.category, emoji: c.emoji, words: c.words }))
    : VOCAB_CATEGORIES;

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
      <h2 className="section-label">{isEn ? 'Vocabulary' : 'Vocabulario'}</h2>
      <p className="vocab-subtitle">
        {isEn
          ? 'Tap any word to hear it · or practice one by one'
          : 'Toca cualquier palabra para escucharla · o practica una a una'}
      </p>

      {categories.map((cat, i) => (
        <div key={cat.name} className="vocab-category">
          <div className={`vocab-cat-header ${openCat === i ? 'vocab-cat-header--open' : ''}`}>
            <button
              className="vocab-cat-title"
              onClick={() => setOpenCat(openCat === i ? null : i)}
            >
              <span>{cat.emoji} {cat.name}</span>
              <span className="vocab-cat-count">
                {cat.words.length} {isEn ? 'words' : 'palabras'} {openCat === i ? '▲' : '▼'}
              </span>
            </button>
            <button
              className="btn-practice-cat"
              onClick={() => setPracticing({ words: cat.words, name: cat.name })}
              aria-label={`${isEn ? 'Practice' : 'Practicar'} ${cat.name}`}
            >
              {isEn ? '▶ Practice' : '▶ Practicar'}
            </button>
          </div>

          {openCat === i && (
            <div className="vocab-words">
              {cat.words.map((w, j) => (
                <button
                  key={j}
                  className="vocab-word-btn"
                  onClick={() => speak(w.word)}
                  aria-label={`${isEn ? 'Hear' : 'Escuchar'} ${w.word}`}
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

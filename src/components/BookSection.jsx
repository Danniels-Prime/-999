import { useState } from 'react';
import { BOOKS } from '../data/books';
import { speak } from '../utils/speech';
import { syllabify } from '../utils/syllabify';

function BookShelf({ completedBooks, onSelect }) {
  return (
    <div className="book-shelf">
      <h2 className="section-label">📚 Mis Libros</h2>
      <p className="book-shelf__hint">Toca una palabra para escucharla y ver sus sílabas</p>
      <div className="book-grid">
        {BOOKS.map(book => {
          const done = completedBooks.includes(book.id);
          return (
            <button
              key={book.id}
              className={`book-card ${done ? 'book-card--done' : ''}`}
              style={{ '--book-color': book.color }}
              onClick={() => onSelect(book)}
            >
              <span className="book-card__icon">{book.icon}</span>
              {done && <span className="book-card__check">✅</span>}
              <span className="book-card__title">{book.title}</span>
              <span className="book-card__meta">
                {book.pages.length} páginas · +{book.bonusOnComplete} 🪙 al terminar
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookReader({ book, completedBooks, onEarnSoles, onCompleteBook, onBack }) {
  const [page, setPage] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [earnedPages, setEarnedPages] = useState(new Set());

  const totalPages = book.pages.length;
  const pageText = book.pages[page];
  const words = pageText.split(/\s+/).filter(Boolean);
  const isLastPage = page === totalPages - 1;

  const cleanWord = w => w.replace(/[¡¿.,!?;:'"«»()]/g, '');
  const selectedClean = selectedIdx !== null ? cleanWord(words[selectedIdx]) : null;
  const syls = selectedClean ? syllabify(selectedClean) : [];

  const handleWord = (word, idx) => {
    const clean = cleanWord(word);
    if (!clean) return;
    speak(clean);
    setSelectedIdx(idx);
  };

  const handleNext = () => {
    if (!earnedPages.has(page)) {
      setEarnedPages(prev => new Set([...prev, page]));
      onEarnSoles(book.solsPerPage);
    }
    if (isLastPage) {
      if (!completedBooks.includes(book.id)) {
        onCompleteBook(book.id, book.bonusOnComplete);
      }
      onBack();
    } else {
      setPage(p => p + 1);
      setSelectedIdx(null);
    }
  };

  const handlePrev = () => {
    if (page > 0) { setPage(p => p - 1); setSelectedIdx(null); }
  };

  return (
    <div className="book-reader">
      <div className="book-reader__header">
        <button className="btn btn--back" onClick={onBack}>← Libros</button>
        <span className="book-reader__title">{book.icon} {book.title}</span>
        <span className="book-reader__progress">{page + 1} / {totalPages}</span>
      </div>

      <div className="book-page" style={{ borderColor: book.color }}>
        <div className="book-page__text">
          {words.map((word, i) => (
            <button
              key={i}
              className={`word-btn ${selectedIdx === i ? 'word-btn--active' : ''}`}
              style={selectedIdx === i ? { background: book.color } : {}}
              onClick={() => handleWord(word, i)}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {syls.length > 0 && (
        <div className="blend-bar">
          <span className="blend-bar__label">Sílabas:</span>
          <div className="blend-bar__syls">
            {syls.map((syl, i) => (
              <button
                key={i}
                className="blend-syl-btn"
                style={{ borderColor: book.color, color: book.color }}
                onClick={() => speak(syl)}
              >
                {syl}
              </button>
            ))}
          </div>
          <button
            className="btn"
            style={{ background: book.color, color: '#fff', padding: '8px 16px', borderRadius: 50 }}
            onClick={() => speak(selectedClean)}
          >
            🔊
          </button>
        </div>
      )}

      <div className="book-reader__actions">
        <button className="btn btn--listen" onClick={() => speak(pageText)}>
          🔊 Leer página completa
        </button>
      </div>

      <div className="flashcard-nav">
        <button className="btn btn--nav" onClick={handlePrev} disabled={page === 0}>
          ← Anterior
        </button>
        <button className="btn btn--nav btn--next" onClick={handleNext}>
          {isLastPage ? '🎉 ¡Terminar libro!' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}

export default function BookSection({ completedBooks, onEarnSoles, onCompleteBook }) {
  const [selected, setSelected] = useState(null);

  if (!selected) {
    return (
      <BookShelf
        completedBooks={completedBooks}
        onSelect={setSelected}
      />
    );
  }

  return (
    <BookReader
      book={selected}
      completedBooks={completedBooks}
      onEarnSoles={onEarnSoles}
      onCompleteBook={onCompleteBook}
      onBack={() => setSelected(null)}
    />
  );
}

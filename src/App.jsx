import { useState, useEffect } from 'react';
import VowelRow from './components/VowelRow';
import SyllableGrid from './components/SyllableGrid';
import EnglishPhonicsChart from './components/EnglishPhonicsChart';
import FlashcardPractice from './components/FlashcardPractice';
import VocabBank from './components/VocabBank';
import SpanishRules from './components/SpanishRules';
import EnglishRules from './components/EnglishRules';
import Trophies from './components/Trophies';
import CelebrationModal from './components/CelebrationModal';
import BookSection from './components/BookSection';
import { useProgress } from './hooks/useProgress';
import { LangContext } from './context/LangContext';
import { setLang as setSpeechLang } from './utils/speech';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('chart');
  const [lang, setLang] = useState('es');
  const { soles, unlockedUpTo, completedLevels, trophies, completedBooks, celebration, completeLevel, earnSoles, completeBook, clearCelebration } = useProgress();

  useEffect(() => {
    setSpeechLang(lang);
  }, [lang]);

  const TABS = lang === 'es' ? [
    { id: 'chart', label: '📖 Abecedario' },
    { id: 'practice', label: '🃏 Práctica' },
    { id: 'books', label: '📚 Libros' },
    { id: 'vocab', label: '📝 Vocabulario' },
    { id: 'rules', label: '✏️ Reglas' },
    { id: 'trophies', label: '🏆 Premios' },
  ] : [
    { id: 'chart', label: '📖 Alphabet' },
    { id: 'practice', label: '🃏 Practice' },
    { id: 'books', label: '📚 Books' },
    { id: 'vocab', label: '📝 Vocabulary' },
    { id: 'rules', label: '✏️ Rules' },
    { id: 'trophies', label: '🏆 Awards' },
  ];

  return (
    <LangContext.Provider value={lang}>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">
            {lang === 'es' ? '🗣 Fonética Española' : '🗣 English Phonics'}
          </h1>
          <p className="app-subtitle">
            {lang === 'es'
              ? 'Aprende a leer en español, sílaba por sílaba'
              : 'Learn to read English, syllable by syllable'}
          </p>
          <div className="header-controls">
            <div className="header-soles">
              <span className="header-soles__icon">🪙</span>
              <span className="header-soles__value">{soles}</span>
              <span className="header-soles__label">soles</span>
            </div>
            <button
              className="lang-toggle"
              onClick={() => setLang(l => l === 'es' ? 'en' : 'es')}
            >
              {lang === 'es' ? '🇺🇸 English' : '🇪🇸 Español'}
            </button>
          </div>
        </header>

        <nav className="tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="app-main">
          {activeTab === 'chart' && (
            <div className="chart-tab">
              {lang === 'en' ? <EnglishPhonicsChart /> : <><VowelRow /><SyllableGrid /></>}
            </div>
          )}
          {activeTab === 'practice' && (
            <FlashcardPractice
              unlockedUpTo={unlockedUpTo}
              completedLevels={completedLevels}
              onLevelComplete={completeLevel}
            />
          )}
          {activeTab === 'books' && (
            <BookSection
              completedBooks={completedBooks || []}
              onEarnSoles={earnSoles}
              onCompleteBook={completeBook}
            />
          )}
          {activeTab === 'vocab' && <VocabBank />}
          {activeTab === 'rules' && (lang === 'es' ? <SpanishRules /> : <EnglishRules />)}
          {activeTab === 'trophies' && (
            <Trophies
              trophies={trophies}
              soles={soles}
              completedLevels={completedLevels}
            />
          )}
        </main>

        {celebration && (
          <CelebrationModal
            celebration={celebration}
            soles={soles}
            onClose={clearCelebration}
          />
        )}
      </div>
    </LangContext.Provider>
  );
}

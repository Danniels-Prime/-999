import { useState } from 'react';
import VowelRow from './components/VowelRow';
import SyllableGrid from './components/SyllableGrid';
import FlashcardPractice from './components/FlashcardPractice';
import VocabBank from './components/VocabBank';
import SpanishRules from './components/SpanishRules';
import Trophies from './components/Trophies';
import CelebrationModal from './components/CelebrationModal';
import BookSection from './components/BookSection';
import { useProgress } from './hooks/useProgress';
import './App.css';

const TABS = [
  { id: 'chart', label: '📖 Abecedario' },
  { id: 'practice', label: '🃏 Práctica' },
  { id: 'books', label: '📚 Libros' },
  { id: 'vocab', label: '📝 Vocabulario' },
  { id: 'rules', label: '✏️ Reglas' },
  { id: 'trophies', label: '🏆 Premios' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chart');
  const { soles, unlockedUpTo, completedLevels, trophies, completedBooks, celebration, completeLevel, earnSoles, completeBook, clearCelebration } = useProgress();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🗣 Fonética Española</h1>
        <p className="app-subtitle">Aprende a leer en español, sílaba por sílaba</p>
        <div className="header-soles">
          <span className="header-soles__icon">🪙</span>
          <span className="header-soles__value">{soles}</span>
          <span className="header-soles__label">soles</span>
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
            <VowelRow />
            <SyllableGrid />
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
        {activeTab === 'rules' && <SpanishRules />}
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
  );
}

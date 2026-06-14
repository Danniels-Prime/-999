import { useState } from 'react';
import VowelRow from './components/VowelRow';
import SyllableGrid from './components/SyllableGrid';
import FlashcardPractice from './components/FlashcardPractice';
import VocabBank from './components/VocabBank';
import './App.css';

const TABS = [
  { id: 'chart', label: '📖 Abecedario' },
  { id: 'practice', label: '🃏 Práctica' },
  { id: 'vocab', label: '📝 Vocabulario' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🗣 Fonética Española</h1>
        <p className="app-subtitle">Aprende a leer en español, sílaba por sílaba</p>
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
        {activeTab === 'practice' && <FlashcardPractice />}
        {activeTab === 'vocab' && <VocabBank />}
      </main>
    </div>
  );
}

import { useState } from 'react';
import { CONSONANTS } from '../data/phonetics';
import SyllableCard from './SyllableCard';
import WordBuilder from './WordBuilder';

const ROW_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#1DD1A1', '#48DBFB',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#01CBC6', '#EE5A24',
  '#C8D6E5', '#8395A7', '#F368E0', '#FF9F43', '#00D2D3',
  '#1ABC9C', '#E74C3C', '#9B59B6', '#3498DB', '#2ECC71',
  '#F39C12', '#D35400', '#27AE60',
];

export default function SyllableGrid() {
  const [builtWord, setBuiltWord] = useState([]);

  const addSyllable = (syl) => setBuiltWord(prev => [...prev, syl]);

  return (
    <div className="syllable-grid-section">
      <div className="syllable-grid">
        {CONSONANTS.map((row, i) => (
          <div key={row.letter} className="consonant-row">
            <span className="consonant-label">{row.letter}</span>
            <div className="syllable-row">
              {row.syllables.map(syl => (
                <button
                  key={syl}
                  className="syllable-btn"
                  style={{ backgroundColor: ROW_COLORS[i % ROW_COLORS.length] }}
                  onClick={() => addSyllable(syl)}
                  aria-label={`Sílaba ${syl}`}
                >
                  {syl}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <WordBuilder syllables={builtWord} onClear={() => setBuiltWord([])} />
    </div>
  );
}

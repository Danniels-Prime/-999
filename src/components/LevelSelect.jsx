import { TOTAL_LEVELS } from '../data/words';

export default function LevelSelect({ unlockedUpTo, onSelect }) {
  return (
    <div className="level-select">
      <h2 className="section-label">Elige tu nivel</h2>
      <div className="level-grid">
        {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
          const level = i + 1;
          const unlocked = level <= unlockedUpTo;
          return (
            <button
              key={level}
              className={`level-btn ${unlocked ? 'level-btn--unlocked' : 'level-btn--locked'}`}
              onClick={() => unlocked && onSelect(level)}
              disabled={!unlocked}
              aria-label={`Nivel ${level}${unlocked ? '' : ' (bloqueado)'}`}
            >
              {unlocked ? level : '🔒'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

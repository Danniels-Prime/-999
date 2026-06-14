const MILESTONE_LIST = [
  { lvl: 5,   icon: '🌱', prize: 'Primer Paso',       bonus: 5   },
  { lvl: 10,  icon: '🥉', prize: 'Medalla de Bronce',  bonus: 10  },
  { lvl: 15,  icon: '⭐', prize: 'Estrella Especial',  bonus: 15  },
  { lvl: 20,  icon: '🥈', prize: 'Medalla de Plata',   bonus: 20  },
  { lvl: 25,  icon: '💫', prize: 'Cuarto de Camino',   bonus: 25  },
  { lvl: 30,  icon: '🏅', prize: 'Medalla de Oro',     bonus: 30  },
  { lvl: 35,  icon: '🎯', prize: 'Tirador Experto',    bonus: 35  },
  { lvl: 40,  icon: '💜', prize: 'Cristal Violeta',    bonus: 40  },
  { lvl: 45,  icon: '🔮', prize: 'Bola de Cristal',    bonus: 45  },
  { lvl: 50,  icon: '💎', prize: 'Diamante',           bonus: 50  },
  { lvl: 55,  icon: '🌊', prize: 'Ola Poderosa',       bonus: 55  },
  { lvl: 60,  icon: '🔥', prize: 'Llama de Fuego',     bonus: 60  },
  { lvl: 65,  icon: '🦁', prize: 'León Valiente',      bonus: 65  },
  { lvl: 70,  icon: '🌟', prize: 'Superestrella',      bonus: 70  },
  { lvl: 75,  icon: '🎖', prize: 'Gran Campeón',       bonus: 75  },
  { lvl: 80,  icon: '🏆', prize: 'Gran Trofeo',        bonus: 80  },
  { lvl: 85,  icon: '🦅', prize: 'Águila Maestra',     bonus: 85  },
  { lvl: 90,  icon: '👑', prize: 'Corona de Plata',    bonus: 90  },
  { lvl: 95,  icon: '🌙', prize: 'Luna de Élite',      bonus: 95  },
  { lvl: 100, icon: '🌈', prize: 'Corona Suprema',     bonus: 500 },
];

export default function Trophies({ trophies, soles, completedLevels }) {
  const totalLevels = 100;
  const pct = Math.round((completedLevels.length / totalLevels) * 100);

  return (
    <div className="trophies-section">
      <h2 className="section-label">Mis Premios</h2>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">🪙</span>
          <span className="stat-value">{soles}</span>
          <span className="stat-label">soles</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{completedLevels.length}</span>
          <span className="stat-label">niveles</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">{trophies.length}</span>
          <span className="stat-label">trofeos</span>
        </div>
      </div>

      <div className="progress-bar-section">
        <div className="progress-bar-label">
          <span>Progreso total</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {trophies.length === 0 ? (
        <div className="trophies-empty">
          <p>🎯 Completa niveles en Práctica para ganar premios</p>
          <p style={{ fontSize: '0.85rem', color: '#b2bec3', marginTop: 8 }}>
            Cada nivel = 1 sol · Cada 5 niveles = premio especial
          </p>
        </div>
      ) : (
        <div className="trophies-grid">
          {trophies.map((t, i) => (
            <div key={i} className="trophy-card">
              <span className="trophy-icon">{t.prize.split(' ')[0]}</span>
              <span className="trophy-name">{t.prize.split(' ').slice(1).join(' ')}</span>
              <span className="trophy-level">Nivel {t.level}</span>
              <span className="trophy-bonus">+{t.bonus} 🪙</span>
            </div>
          ))}
        </div>
      )}

      <div className="milestone-preview">
        <h3 className="milestone-preview__title">Todos los premios</h3>
        <div className="milestone-list">
          {MILESTONE_LIST.map(({ lvl, icon, prize, bonus }) => {
            const done = completedLevels.includes(lvl);
            return (
              <div key={lvl} className={`milestone-item ${done ? 'milestone-item--done' : ''}`}>
                <span className="milestone-level">Niv. {lvl}</span>
                <span className="milestone-prize">{done ? '✅' : icon} {prize}</span>
                <span className="milestone-bonus">+{bonus} 🪙</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
            Cada nivel = 25 soles · Niveles especiales = premios extra
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
        <h3 className="milestone-preview__title">Próximos premios</h3>
        <div className="milestone-list">
          {[10,15,20,30,40,50,60,70,80,90,100].map(lvl => (
            <div key={lvl} className={`milestone-item ${completedLevels.includes(lvl) ? 'milestone-item--done' : ''}`}>
              <span className="milestone-level">Niv. {lvl}</span>
              <span className="milestone-prize">
                {completedLevels.includes(lvl) ? '✅' : '🔒'}{' '}
                {lvl === 10 ? '🥉' : lvl === 15 ? '⭐' : lvl === 20 ? '🥈' : lvl === 30 ? '🏅' :
                 lvl === 40 ? '💜' : lvl === 50 ? '💎' : lvl === 60 ? '🔥' : lvl === 70 ? '🌟' :
                 lvl === 80 ? '🏆' : lvl === 90 ? '👑' : '🌈'}
              </span>
              <span className="milestone-bonus">+{lvl === 10 ? 50 : lvl === 15 ? 75 : lvl === 20 ? 100 : lvl === 30 ? 150 : lvl === 40 ? 175 : lvl === 50 ? 200 : lvl === 60 ? 225 : lvl === 70 ? 250 : lvl === 80 ? 300 : lvl === 90 ? 350 : 1000} 🪙</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

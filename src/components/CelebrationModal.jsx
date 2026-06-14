import { speak } from '../utils/speech';
import { useEffect } from 'react';

export default function CelebrationModal({ celebration, onClose, soles }) {
  const isMax = celebration?.level === 100;

  useEffect(() => {
    const timer = setTimeout(() => speak(celebration?.message || '¡Felicidades!'), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${isMax ? 'modal-box--max' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-confetti">
          {['🎉','✨','🌟','🎊','⭐','💫'].map((e, i) => (
            <span key={i} className="confetti-piece" style={{ '--i': i }}>{e}</span>
          ))}
        </div>

        <div className="modal-prize-icon">{celebration?.prize?.split(' ')[0]}</div>

        <h2 className="modal-title">
          {isMax ? '¡¡ LEYENDA !!' : `¡Nivel ${celebration?.level} completado!`}
        </h2>
        <p className="modal-message">{celebration?.message}</p>

        <div className="modal-prize-name">{celebration?.prize}</div>

        <div className="modal-coins">
          <span className="modal-coins-earned">+ {celebration?.bonus} soles 🪙</span>
          <span className="modal-coins-total">Total: {soles} soles</span>
        </div>

        {isMax && (
          <p className="modal-max-msg">
            ¡Has conquistado los 100 niveles! Eres un maestro de la fonética española. 🏆
          </p>
        )}

        <button className="btn btn--primary modal-close-btn" onClick={onClose}>
          {isMax ? '👑 ¡Soy una leyenda!' : '¡Seguir adelante! →'}
        </button>
      </div>
    </div>
  );
}

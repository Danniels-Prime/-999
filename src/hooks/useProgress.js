import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fonetica_progress';

const MILESTONES = {
  5:   { prize: '🌱 Primer Paso',       bonus: 5,   message: '¡Tus primeros 5 niveles!' },
  10:  { prize: '🥉 Medalla de Bronce', bonus: 10,  message: '¡Completaste 10 niveles!' },
  15:  { prize: '⭐ Estrella Especial',  bonus: 15,  message: '¡Nivel 15 conquistado!' },
  20:  { prize: '🥈 Medalla de Plata',  bonus: 20,  message: '¡20 niveles dominados!' },
  25:  { prize: '💫 Cuarto de Camino',  bonus: 25,  message: '¡Ya llevas 25 niveles!' },
  30:  { prize: '🏅 Medalla de Oro',    bonus: 30,  message: '¡30 niveles superados!' },
  35:  { prize: '🎯 Tirador Experto',   bonus: 35,  message: '¡35 niveles, qué puntería!' },
  40:  { prize: '💜 Cristal Violeta',   bonus: 40,  message: '¡Increíble, 40 niveles!' },
  45:  { prize: '🔮 Bola de Cristal',   bonus: 45,  message: '¡45 niveles, eres mágico!' },
  50:  { prize: '💎 Diamante',          bonus: 50,  message: '¡La mitad del camino!' },
  55:  { prize: '🌊 Ola Poderosa',      bonus: 55,  message: '¡55 niveles, imparable!' },
  60:  { prize: '🔥 Llama de Fuego',    bonus: 60,  message: '¡60 niveles en llamas!' },
  65:  { prize: '🦁 León Valiente',     bonus: 65,  message: '¡65 niveles, rugiste fuerte!' },
  70:  { prize: '🌟 Superestrella',     bonus: 70,  message: '¡70 niveles, eres una estrella!' },
  75:  { prize: '🎖 Gran Campeón',      bonus: 75,  message: '¡75 niveles, tres cuartos!' },
  80:  { prize: '🏆 Gran Trofeo',       bonus: 80,  message: '¡80 niveles, campeón!' },
  85:  { prize: '🦅 Águila Maestra',    bonus: 85,  message: '¡85 niveles, vuelas alto!' },
  90:  { prize: '👑 Corona de Plata',   bonus: 90,  message: '¡Solo 10 más para la cima!' },
  95:  { prize: '🌙 Luna de Élite',     bonus: 95,  message: '¡95 niveles, casi leyenda!' },
  100: { prize: '🌈 Corona Suprema',    bonus: 500, message: '¡LEYENDA! ¡100 niveles completados!' },
};

const COINS_PER_LEVEL = 1;

const defaultState = {
  soles: 0,
  unlockedUpTo: 1,
  completedLevels: [],
  trophies: [],
  lastMilestone: null,
  completedBooks: [],
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function useProgress() {
  const [state, setState] = useState(load);
  const [celebration, setCelebration] = useState(null);

  useEffect(() => { save(state); }, [state]);

  const completeLevel = (level) => {
    setState(prev => {
      if (prev.completedLevels.includes(level)) return prev;

      const newCompleted = [...prev.completedLevels, level];
      const newUnlocked = Math.max(prev.unlockedUpTo, Math.min(level + 1, 100));
      let earnedSoles = COINS_PER_LEVEL;
      let newTrophies = [...prev.trophies];
      let milestone = null;

      if (MILESTONES[level]) {
        milestone = { level, ...MILESTONES[level] };
        earnedSoles += MILESTONES[level].bonus;
        newTrophies = [...newTrophies, { level, ...MILESTONES[level] }];
      }

      const newState = {
        ...prev,
        soles: prev.soles + earnedSoles,
        unlockedUpTo: newUnlocked,
        completedLevels: newCompleted,
        trophies: newTrophies,
        lastMilestone: milestone,
      };

      if (milestone) setTimeout(() => setCelebration(milestone), 300);

      return newState;
    });
  };

  const earnSoles = (amount) => {
    setState(prev => ({ ...prev, soles: prev.soles + amount }));
  };

  const completeBook = (bookId, bonus) => {
    setState(prev => {
      if ((prev.completedBooks || []).includes(bookId)) return prev;
      return {
        ...prev,
        soles: prev.soles + bonus,
        completedBooks: [...(prev.completedBooks || []), bookId],
      };
    });
  };

  const clearCelebration = () => {
    setCelebration(null);
    setState(prev => ({ ...prev, lastMilestone: null }));
  };

  const resetProgress = () => {
    setState(defaultState);
    save(defaultState);
  };

  return { ...state, completeLevel, earnSoles, completeBook, celebration, clearCelebration, resetProgress };
}

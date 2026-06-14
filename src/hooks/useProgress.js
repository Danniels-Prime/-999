import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fonetica_progress';

const MILESTONES = {
  10:  { prize: '🥉 Medalla de Bronce',  bonus: 50,   message: '¡Completaste 10 niveles!' },
  15:  { prize: '⭐ Estrella Especial',   bonus: 75,   message: '¡Nivel 15 conquistado!' },
  20:  { prize: '🥈 Medalla de Plata',   bonus: 100,  message: '¡20 niveles dominados!' },
  30:  { prize: '🏅 Medalla de Oro',      bonus: 150,  message: '¡30 niveles superados!' },
  40:  { prize: '💜 Cristal Violeta',    bonus: 175,  message: '¡Increíble, 40 niveles!' },
  50:  { prize: '💎 Diamante',           bonus: 200,  message: '¡La mitad del camino!' },
  60:  { prize: '🔥 Llama de Fuego',     bonus: 225,  message: '¡60 niveles en llamas!' },
  70:  { prize: '🌟 Superestrella',      bonus: 250,  message: '¡70 niveles, eres una estrella!' },
  80:  { prize: '🏆 Gran Trofeo',        bonus: 300,  message: '¡80 niveles, campeón!' },
  90:  { prize: '👑 Corona de Plata',    bonus: 350,  message: '¡Solo 10 más para la cima!' },
  100: { prize: '🌈 Corona Suprema',     bonus: 1000, message: '¡LEYENDA! ¡100 niveles completados!' },
};

const COINS_PER_LEVEL = 25;

const defaultState = {
  soles: 0,
  unlockedUpTo: 1,
  completedLevels: [],
  trophies: [],
  lastMilestone: null,
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

  const clearCelebration = () => {
    setCelebration(null);
    setState(prev => ({ ...prev, lastMilestone: null }));
  };

  const resetProgress = () => {
    setState(defaultState);
    save(defaultState);
  };

  return { ...state, completeLevel, celebration, clearCelebration, resetProgress };
}

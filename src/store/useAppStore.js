import { useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { addDays } from '../utils/dateUtils.js';

const DEFAULT_STATE = {
  golfers: [],
  holes: [],
  scores: {},
};

function newId() {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useAppStore() {
  const [state, setState] = useLocalStorage('wordle-masters-data', DEFAULT_STATE);

  const addGolfer = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState(prev => ({
      ...prev,
      golfers: [...prev.golfers, { id: newId(), name: trimmed }],
    }));
  }, [setState]);

  const updateGolfer = useCallback((id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState(prev => ({
      ...prev,
      golfers: prev.golfers.map(g => g.id === id ? { ...g, name: trimmed } : g),
    }));
  }, [setState]);

  const deleteGolfer = useCallback((id) => {
    setState(prev => {
      const scores = { ...prev.scores };
      delete scores[id];
      return {
        ...prev,
        golfers: prev.golfers.filter(g => g.id !== id),
        scores,
      };
    });
  }, [setState]);

  const setScore = useCallback((golferId, holeNumber, value) => {
    setState(prev => {
      const golferScores = { ...(prev.scores[golferId] ?? {}) };
      if (value === null || value === undefined || value === '') {
        delete golferScores[holeNumber];
      } else {
        golferScores[holeNumber] = value;
      }
      return {
        ...prev,
        scores: { ...prev.scores, [golferId]: golferScores },
      };
    });
  }, [setState]);

  const setHoleDate = useCallback((holeNumber, dateStr) => {
    setState(prev => {
      const MAX_HOLES = 30;
      // Build a full holes array up to MAX_HOLES, merging existing data
      let holes = Array.from({ length: MAX_HOLES }, (_, i) => {
        const num = i + 1;
        return prev.holes.find(h => h.number === num) ?? { number: num, date: null, autoFilled: false };
      });

      // Update the changed hole
      holes = holes.map(h =>
        h.number === holeNumber
          ? { ...h, date: dateStr, autoFilled: false }
          : h
      );

      // Find earliest anchor: hole 1 if it has a date, else the changed hole
      const anchor = holes.find(h => h.number === 1 && h.date) ?? holes.find(h => h.number === holeNumber && h.date);
      if (anchor) {
        holes = holes.map(h => {
          // Only auto-fill holes that are after the anchor and don't have a manual date
          // (or were previously auto-filled)
          if (h.number === anchor.number) return h;
          if (!h.autoFilled && h.date && h.number !== holeNumber) return h;
          const filled = addDays(anchor.date, h.number - anchor.number);
          return { ...h, date: filled, autoFilled: true };
        });
      }

      // Trim trailing holes with no data
      let lastUsed = 0;
      holes.forEach(h => { if (h.date) lastUsed = h.number; });
      const trimmed = holes.slice(0, Math.max(lastUsed, 4));

      return { ...prev, holes: trimmed };
    });
  }, [setState]);

  const clearAll = useCallback(() => {
    if (!window.confirm('Clear all golfers, holes, and scores? This cannot be undone.')) return;
    setState(DEFAULT_STATE);
  }, [setState]);

  return {
    golfers: state.golfers,
    holes: state.holes,
    scores: state.scores,
    addGolfer,
    updateGolfer,
    deleteGolfer,
    setScore,
    setHoleDate,
    clearAll,
  };
}

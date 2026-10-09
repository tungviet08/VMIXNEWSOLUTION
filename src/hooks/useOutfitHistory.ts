import { useState, useCallback, useEffect } from 'react';
import { OutfitState } from '../types';

function areOutfitsEqual(a: OutfitState, b: OutfitState): boolean {
  if (!a || !b) return false;
  if (
    a.outerId !== b.outerId ||
    a.innerId !== b.innerId ||
    a.bottomId !== b.bottomId ||
    a.headwearId !== b.headwearId ||
    a.footwearId !== b.footwearId ||
    a.accessoryId !== b.accessoryId
  ) {
    return false;
  }
  const keys: Array<keyof OutfitState['colors']> = ['outer', 'inner', 'bottom', 'headwear', 'footwear', 'accessory'];
  for (const k of keys) {
    if (a.colors[k] !== b.colors[k]) return false;
  }
  return true;
}

interface HistoryState {
  history: OutfitState[];
  currentIndex: number;
}

export function useOutfitHistory(initialOutfit: OutfitState) {
  const [state, setState] = useState<HistoryState>(() => ({
    history: [initialOutfit],
    currentIndex: 0,
  }));

  const currentOutfit = state.history[state.currentIndex] || initialOutfit;
  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  const setOutfit = useCallback((updater: OutfitState | ((prev: OutfitState) => OutfitState)) => {
    setState((prev) => {
      const current = prev.history[prev.currentIndex] || initialOutfit;
      const next = typeof updater === 'function' ? updater(current) : updater;

      if (areOutfitsEqual(current, next)) {
        return prev;
      }

      const nextHistory = prev.history.slice(0, prev.currentIndex + 1);
      if (nextHistory.length >= 50) {
        nextHistory.shift();
      }
      nextHistory.push(JSON.parse(JSON.stringify(next)));

      return {
        history: nextHistory,
        currentIndex: nextHistory.length - 1,
      };
    });
  }, [initialOutfit]);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= prev.history.length - 1) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
      };
    });
  }, []);

  // Keyboard shortcut listener (Ctrl+Z / Cmd+Z, Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isCmdOrCtrl) return;

      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.key.toLowerCase() === 'z' && e.shiftKey) ||
        e.key.toLowerCase() === 'y'
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    outfit: currentOutfit,
    setOutfit,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: state.history.length,
    currentIndex: state.currentIndex,
  };
}

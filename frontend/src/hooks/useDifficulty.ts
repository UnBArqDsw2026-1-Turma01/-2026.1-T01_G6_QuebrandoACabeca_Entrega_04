import { useCallback, useMemo } from 'react';
import { useGameContext } from '../context/GameContext';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '../utils/constants';
import type { Difficulty } from '../types';

export interface DifficultyOption {
  value: Difficulty;
  label: string;
  selected: boolean;
}

export function useDifficulty() {
  const { selectedDifficulty, setSelectedDifficulty } = useGameContext();

  /** Lista pronta para renderizar cards/radios de seleção de dificuldade. */
  const options = useMemo<DifficultyOption[]>(
    () =>
      DIFFICULTIES.map((value) => ({
        value,
        label: DIFFICULTY_LABELS[value],
        selected: value === selectedDifficulty,
      })),
    [selectedDifficulty],
  );

  const selectDifficulty = useCallback(
    (difficulty: Difficulty) => setSelectedDifficulty(difficulty),
    [setSelectedDifficulty],
  );

  return {
    selectedDifficulty,
    selectedLabel: DIFFICULTY_LABELS[selectedDifficulty],
    options,
    selectDifficulty,
  };
}
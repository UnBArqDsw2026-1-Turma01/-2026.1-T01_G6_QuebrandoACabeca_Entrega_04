import type { Difficulty, Effect } from '../types';
import { DIFFICULTY_LABELS, EFFECT_LABELS } from './constants';

/** Converte segundos em "MM:SS", ou "HH:MM:SS" se passar de 1 hora (ver time_seconds em score_router.py). */
export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Formata a pontuação com separador de milhar em pt-BR. */
export function formatScore(score: number): string {
  return score.toLocaleString('pt-BR');
}

export function formatDifficultyLabel(difficulty: Difficulty): string {
  return DIFFICULTY_LABELS[difficulty];
}

export function formatEffectLabel(effect: Effect): string {
  return EFFECT_LABELS[effect];
}

/** Progresso de peças encaixadas, ex.: "7/12 peças" (ver MoveResponse/PuzzleStateResponse). */
export function formatPiecesProgress(piecesRemaining: number, totalPieces: number): string {
  const fitted = totalPieces - piecesRemaining;
  return `${fitted}/${totalPieces} peças`;
}
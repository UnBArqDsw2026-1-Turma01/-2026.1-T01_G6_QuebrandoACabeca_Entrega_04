import { useCallback, useState } from 'react';
import * as puzzleApi from '../api/puzzleApi';
import { ApiError } from '../api/httpClient';
import { useGameContext } from '../context/GameContext';
import type { Effect } from '../types';

export function useGame() {
  const { selectedDifficulty, selectedEffect, selectedImageBase64, currentPuzzle, setCurrentPuzzle } =
    useGameContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPuzzle = useCallback(
    async (overrideEffect?: Effect) => {
      if (!selectedImageBase64) {
        const message = 'Selecione uma imagem antes de criar o puzzle.';
        setError(message);
        throw new Error(message);
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await puzzleApi.createPuzzle({
          image: selectedImageBase64,
          difficulty: selectedDifficulty,
          effect: overrideEffect ?? selectedEffect,
        });
        setCurrentPuzzle(response);
        return response;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Não foi possível criar o puzzle.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedImageBase64, selectedDifficulty, selectedEffect, setCurrentPuzzle],
  );

  const movePiece = useCallback(
    async (pieceId: number, newX: number, newY: number) => {
      if (!currentPuzzle) {
        throw new Error('Nenhum puzzle ativo.');
      }

      setError(null);
      try {
        const response = await puzzleApi.movePiece({
          puzzle_id: currentPuzzle.puzzle_id,
          piece_id: pieceId,
          new_x: newX,
          new_y: newY,
        });

        // Atualiza a peça localmente — evita um GET completo a cada movimento.
        setCurrentPuzzle({
          ...currentPuzzle,
          pieces: currentPuzzle.pieces.map((piece) =>
            piece.id === pieceId
              ? { ...piece, posicao_x: newX, posicao_y: newY, encaixada: response.encaixada }
              : piece,
          ),
        });

        return response;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Não foi possível mover a peça.');
        throw err;
      }
    },
    [currentPuzzle, setCurrentPuzzle],
  );

  /** Útil ao entrar numa partida em andamento (ex.: via link direto ou refresh da página). */
  const refreshPuzzleState = useCallback(async () => {
    if (!currentPuzzle) return null;

    setIsLoading(true);
    setError(null);
    try {
      const state = await puzzleApi.getPuzzleState(currentPuzzle.puzzle_id);
      setCurrentPuzzle({ ...state, effect_applied: currentPuzzle.effect_applied });
      return state;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar o estado do puzzle.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentPuzzle, setCurrentPuzzle]);

  const piecesRemaining = currentPuzzle ? currentPuzzle.pieces.filter((p) => !p.encaixada).length : 0;
  const isComplete = currentPuzzle !== null && piecesRemaining === 0;

  return {
    currentPuzzle,
    isLoading,
    error,
    isComplete,
    piecesRemaining,
    createPuzzle,
    movePiece,
    refreshPuzzleState,
  };
}
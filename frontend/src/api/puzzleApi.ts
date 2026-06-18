import { apiRequest } from './httpClient';
import { API_ROUTES } from '../utils/constants';
import type {
  CreatePuzzleRequest,
  CreatePuzzleResponse,
  MoveRequest,
  MoveResponse,
  PuzzleStateResponse,
} from '../types';

const BASE = API_ROUTES.PUZZLE;

/** Owner é opcional no backend (OptionalUser) — se houver token, o puzzle fica vinculado ao usuário. */
export function createPuzzle(payload: CreatePuzzleRequest): Promise<CreatePuzzleResponse> {
  return apiRequest<CreatePuzzleResponse>(`${BASE}/create`, { method: 'POST', body: payload });
}

export function movePiece(payload: MoveRequest): Promise<MoveResponse> {
  return apiRequest<MoveResponse>(`${BASE}/move`, { method: 'POST', body: payload });
}

export function getPuzzleState(puzzleId: string): Promise<PuzzleStateResponse> {
  return apiRequest<PuzzleStateResponse>(`${BASE}/${puzzleId}`, { method: 'GET' });
}

/**
 * Deleta um puzzle e todas as suas peças do banco de dados.
 * @param puzzleId - ID do puzzle a ser removido
 * @returns Promise vazia (204 No Content)
 */
export function deletePuzzle(puzzleId: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${puzzleId}`, { method: 'DELETE' });
}

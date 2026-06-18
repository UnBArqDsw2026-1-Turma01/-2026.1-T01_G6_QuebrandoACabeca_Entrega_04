import { apiRequest } from './httpClient';
import { API_ROUTES } from '../utils/constants';
import type { SubmitScoreRequest, ScoreEntry, RankingEntry, LevelProgress } from '../types';

const BASE = API_ROUTES.SCORE;

export function submitScore(payload: SubmitScoreRequest): Promise<ScoreEntry> {
  return apiRequest<ScoreEntry>(`${BASE}/submit`, { method: 'POST', body: payload });
}

export function getMyScores(): Promise<ScoreEntry[]> {
  return apiRequest<ScoreEntry[]>(`${BASE}/me`, { method: 'GET' });
}

export function getRanking(): Promise<RankingEntry[]> {
  return apiRequest<RankingEntry[]>(`${BASE}/ranking`, { method: 'GET' });
}

export function getLevelProgress(): Promise<LevelProgress[]> {
  return apiRequest<LevelProgress[]>(`${BASE}/levels/progress`, { method: 'GET' });
}
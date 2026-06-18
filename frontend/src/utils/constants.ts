import type { Difficulty, Effect } from '../types';

/**
 * Constantes globais da aplicação.
 * Valores que espelham contratos do backend (FastAPI) estão comentados com a origem.
 */

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Base URL do backend FastAPI.
 * TODO: trocar pela variável de ambiente do seu bundler, ex.:
 *   Vite              → import.meta.env.VITE_API_URL
 *   Create React App  → process.env.REACT_APP_API_URL
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ROUTES = {
  AUTH: '/auth',
  PUZZLE: '/puzzle',
  SCORE: '/score',
} as const;

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------

/** Chave usada para persistir o token de sessão no cliente (ver _SESSIONS em auth_router.py). */
export const AUTH_TOKEN_STORAGE_KEY = 'qb_auth_token';

/** Espelha as validações de RegisterRequest em auth_router.py. */
export const PASSWORD_MIN_LENGTH = 6;
export const NAME_MIN_LENGTH = 2;

// ---------------------------------------------------------------------------
// Dificuldade
// ---------------------------------------------------------------------------

/** Chaves aceitas por puzzle_router.py (_DIFFICULTY_MAP / _BUILDERS). */
export const DIFFICULTIES: Difficulty[] = ['facil', 'medio', 'dificil'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

export const DEFAULT_DIFFICULTY: Difficulty = 'facil';

// ---------------------------------------------------------------------------
// Efeito visual
// ---------------------------------------------------------------------------

/** Chaves aceitas por puzzle_router.py (_EFFECTS). Padrão no backend: "grade". */
export const EFFECTS: Effect[] = ['grade', 'jigsaw', 'qb'];

export const EFFECT_LABELS: Record<Effect, string> = {
  grade: 'Grade Quadricular',
  jigsaw: 'Jigsaw',
  qb: 'Quebrando a Cabeça',
};

export const DEFAULT_EFFECT: Effect = 'grade';

// ---------------------------------------------------------------------------
// Upload de imagem
// ---------------------------------------------------------------------------

/** Formatos aceitos pelo backend (ver docstring de CreatePuzzleRequest em puzzle_router.py). */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/**
 * Limite de tamanho de arquivo definido no frontend — o backend não impõe
 * um limite explícito, apenas valida se a string é base64 válida.
 * 10MB já é o valor usado em UploadImagem.tsx ("Máx. 10 MB").
 */
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// ---------------------------------------------------------------------------
// Ranking / Placar
// ---------------------------------------------------------------------------

/** O backend já limita a 10 resultados em /score/ranking; mantido aqui só para exibição. */
export const RANKING_DISPLAY_LIMIT = 10;
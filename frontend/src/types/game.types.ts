/**
 * Tipos do domínio do jogo: puzzle, peças, dificuldade e pontuação.
 * Espelham os schemas Pydantic de puzzle_router.py e score_router.py.
 */

// ---------------------------------------------------------------------------
// Dificuldade e efeito visual
// ---------------------------------------------------------------------------

/** Valores enviados pelo frontend. O backend também aceita "easy" | "medium" | "hard" como aliases. */
export type Difficulty = 'facil' | 'medio' | 'dificil';

export type Effect = 'grade' | 'jigsaw' | 'qb';

// ---------------------------------------------------------------------------
// Peça
// ---------------------------------------------------------------------------

export interface Piece {
  id: number;
  /** Coordenadas normalizadas (0.0 – 1.0), independentes da resolução da tela. */
  posicao_x: number;
  posicao_y: number;
  posicao_x_certa: number;
  posicao_y_certa: number;
  encaixada: boolean;
}

// ---------------------------------------------------------------------------
// Criação de puzzle
// ---------------------------------------------------------------------------

export interface CreatePuzzleRequest {
  /** Imagem codificada em base64 (JPEG/PNG/WEBP). */
  image: string;
  difficulty: Difficulty;
  /** Padrão no backend: "grade". */
  effect?: Effect;
}

export interface CreatePuzzleResponse {
  puzzle_id: string;
  difficulty: Difficulty;
  num_pieces: number;
  pieces: Piece[];
  effect_applied: string;
}

// ---------------------------------------------------------------------------
// Movimento de peça
// ---------------------------------------------------------------------------

export interface MoveRequest {
  puzzle_id: string;
  piece_id: number;
  new_x: number;
  new_y: number;
}

export interface MoveResponse {
  piece_id: number;
  encaixada: boolean;
  puzzle_completo: boolean;
  pieces_remaining: number;
}

// ---------------------------------------------------------------------------
// Estado do puzzle
// ---------------------------------------------------------------------------

export interface PuzzleStateResponse {
  puzzle_id: string;
  difficulty: Difficulty;
  num_pieces: number;
  pieces: Piece[];
  completo: boolean;
}

// ---------------------------------------------------------------------------
// Puzzle ativo (uso interno do frontend)
// ---------------------------------------------------------------------------

/**
 * Forma unificada usada por GameContext/useGame para representar o puzzle em
 * andamento. CreatePuzzleResponse não tem `completo` e PuzzleStateResponse não
 * tem `effect_applied` — aqui ambos ficam compatíveis, e a conclusão é
 * derivada de `pieces` (todas com `encaixada: true`) em vez de um campo solto.
 */
export interface ActivePuzzle {
  puzzle_id: string;
  difficulty: Difficulty;
  num_pieces: number;
  pieces: Piece[];
  effect_applied?: string;
}

// ---------------------------------------------------------------------------
// Pontuação
// ---------------------------------------------------------------------------

export interface SubmitScoreRequest {
  puzzle_id: string;
  level_id: number;          // 1 a 4
  score: number;
  time_seconds: number;
  stars: number;            // 0 a 3
  hints_used: number;
  time_limit_on: boolean;
  shuffle_on: boolean;
}

export interface ScoreEntry {
  user_id: string;
  puzzle_id: string;
  level_id: number;
  score: number;
  time_seconds: number;
  stars: number;
  hints_used: number;
  time_limit_on: boolean;
  shuffle_on: boolean;
  created_at: string;
}

export interface LevelProgress {
  level_id: number;
  best_stars: number;       // 0 a 3
  completed: boolean;
}

export interface RankingEntry {
  user_id: string;
  name: string;
  best_score: number;
}
import type { Difficulty } from '../types';
import { ACCEPTED_IMAGE_TYPES, DIFFICULTIES, MAX_IMAGE_SIZE_BYTES, NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Autenticação — espelham as constraints de RegisterRequest/LoginRequest em auth_router.py
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { valid: false, error: 'O e-mail é obrigatório.' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'E-mail inválido.' };
  }
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `A senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres.` };
  }
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (name.trim().length < NAME_MIN_LENGTH) {
    return { valid: false, error: `O nome deve ter no mínimo ${NAME_MIN_LENGTH} caracteres.` };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Jogo
// ---------------------------------------------------------------------------

/** Type guard — útil ao ler dificuldade de uma rota ou de um <select>. */
export function isValidDifficulty(value: string): value is Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(value);
}

export function validateScore(score: number): ValidationResult {
  if (!Number.isFinite(score) || score < 0) {
    return { valid: false, error: 'A pontuação não pode ser negativa.' };
  }
  return { valid: true };
}

export function validateTimeSeconds(seconds: number): ValidationResult {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return { valid: false, error: 'O tempo não pode ser negativo.' };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Upload de imagem — espelha a docstring de CreatePuzzleRequest em puzzle_router.py
// ---------------------------------------------------------------------------

export function validateImageFile(file: File): ValidationResult {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return { valid: false, error: 'Formato de imagem não suportado. Use JPEG, PNG ou WEBP.' };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const maxMb = MAX_IMAGE_SIZE_BYTES / (1024 * 1024);
    return { valid: false, error: `A imagem deve ter no máximo ${maxMb}MB.` };
  }
  return { valid: true };
}

/**
 * Checagem best-effort de base64 no cliente. O backend é a fonte de verdade
 * (puzzle_router.py usa base64.b64decode(req.image, validate=True)).
 */
export function isValidBase64(value: string): boolean {
  const cleaned = value.replace(/\s/g, '');
  if (cleaned === '') return false;
  try {
    return btoa(atob(cleaned)) === cleaned;
  } catch {
    return false;
  }
}
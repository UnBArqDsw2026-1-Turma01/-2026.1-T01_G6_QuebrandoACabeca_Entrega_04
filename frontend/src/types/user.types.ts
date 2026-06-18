/**
 * Tipos de usuário e autenticação.
 * Espelham os schemas Pydantic de auth_router.py.
 */

// ---------------------------------------------------------------------------
// Usuário
// ---------------------------------------------------------------------------

export interface UserResponse {
  user_id: string;
  name: string;
  email: string;
}

/** Resposta de /auth/register e /auth/login — inclui o token de sessão. */
export interface AuthResponse extends UserResponse {
  token: string;
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

export interface RegisterRequest {
  /** Mínimo de 2 caracteres (validado também no backend). */
  name: string;
  email: string;
  /** Mínimo de 6 caracteres (validado também no backend). */
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RecoverRequest {
  email: string;
}

// ---------------------------------------------------------------------------
// Genéricos
// ---------------------------------------------------------------------------

/** Usado por /auth/logout, /auth/recover e por session_router.py (/session/leave). */
export interface MessageResponse {
  message: string;
}
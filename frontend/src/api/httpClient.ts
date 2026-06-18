import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from '../utils/constants';

const PYDANTIC_MESSAGES: Record<string, string> = {
  'An email address must have an @-sign': '⚠ Digite um e-mail válido.',
  'value is not a valid email address':   '⚠ Digite um e-mail válido.',
  'field required':                       '⚠ Campo obrigatório.',
  'ensure this value has at least':       '⚠ Valor abaixo do mínimo permitido.',
}

/** Erro lançado quando o backend responde com status fora da faixa 2xx. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'UPDATE' |'DELETE';
  body?: unknown;
}

function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function translatePydanticMsg(msg: string): string {
  for (const [key, value] of Object.entries(PYDANTIC_MESSAGES)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return value
  }
  return '⚠ Dados inválidos. Verifique os campos e tente novamente.'
}

/**
 * Wrapper único para todas as chamadas ao backend.
 * Anexa o token (se existir) em todo request — inofensivo em rotas públicas
 * como /auth/register e /auth/login, e necessário em /auth/me, /score/*,
 * /session/* e opcionalmente em /puzzle/create (OptionalUser).
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = data && typeof data === 'object' && 'detail' in data
      ? (data as { detail: unknown }).detail
      : null;

    let message: string;
    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      const first = detail[0];
      message = typeof first?.msg === 'string'
        ? translatePydanticMsg(first.msg)  // ← substituir o String() direto
        : `Erro ${response.status} ao acessar ${path}.`;
    } else {
      message = `Erro ${response.status} ao acessar ${path}.`;
    }

    throw new ApiError(message, response.status);
  }

  return data as T;
}
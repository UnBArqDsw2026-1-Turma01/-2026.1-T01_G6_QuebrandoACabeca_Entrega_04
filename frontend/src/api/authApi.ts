import { apiRequest } from './httpClient';
import { API_ROUTES } from '../utils/constants';
import type {
  AuthResponse,
  LoginRequest,
  MessageResponse,
  RecoverRequest,
  RegisterRequest,
  UserResponse,
} from '../types';

const BASE = API_ROUTES.AUTH;

export function register(payload: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`${BASE}/register`, { method: 'POST', body: payload });
}

export function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(`${BASE}/login`, { method: 'POST', body: payload });
}

/** O token atual (lido do storage pelo httpClient) é enviado no header Authorization. */
export function logout(): Promise<MessageResponse> {
  return apiRequest<MessageResponse>(`${BASE}/logout`, { method: 'POST' });
}

export function getMe(): Promise<UserResponse> {
  return apiRequest<UserResponse>(`${BASE}/me`, { method: 'GET' });
}

export function recoverPassword(payload: RecoverRequest): Promise<MessageResponse> {
  return apiRequest<MessageResponse>(`${BASE}/recover`, { method: 'POST', body: payload });
}

export function deleteAccount(): Promise<void> {
  return apiRequest<void>(`${API_ROUTES.AUTH}/users/me`, { method: 'DELETE' });
}
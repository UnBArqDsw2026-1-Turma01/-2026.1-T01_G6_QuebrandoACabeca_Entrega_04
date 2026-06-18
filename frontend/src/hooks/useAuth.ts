import { useAuthContext } from '../context/AuthContext';

/**
 * Camada pública de autenticação para os componentes.
 * Mantida separada do AuthContext para isolar a UI da implementação interna —
 * se o mecanismo de estado mudar no futuro, os componentes não precisam saber.
 */
export function useAuth() {
  return useAuthContext();
}
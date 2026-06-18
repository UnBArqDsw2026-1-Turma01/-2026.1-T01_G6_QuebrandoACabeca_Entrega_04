import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../api/authApi';
import { ApiError } from '../api/httpClient';
import { AUTH_TOKEN_STORAGE_KEY } from '../utils/constants';
import type { UserResponse } from '../types';

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  /** true durante a checagem inicial de sessão e durante login/registro. */
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaura a sessão ao carregar a aplicação, se houver um token salvo.
  // Valida o token chamando /auth/me — se tiver expirado/sido invalidado, limpa a sessão local.
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    authApi
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistSession = useCallback((newToken: string, newUser: UserResponse) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await authApi.login({ email, password });
        persistSession(response.token, {
          user_id: response.user_id,
          name: response.name,
          email: response.email,
        });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await authApi.register({ name, email, password });
        persistSession(response.token, {
          user_id: response.user_id,
          name: response.name,
          email: response.email,
        });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Não foi possível criar a conta. Tente novamente.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Mesmo se a chamada ao backend falhar, a sessão local é limpa de qualquer forma.
    } finally {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: user !== null,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, token, isLoading, error, login, register, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook de consumo bruto do contexto — a API ergonômica para componentes fica em hooks/useAuth.ts. */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider.');
  }
  return context;
}
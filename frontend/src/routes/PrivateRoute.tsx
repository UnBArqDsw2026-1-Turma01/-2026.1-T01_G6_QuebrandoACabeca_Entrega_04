import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * Guard de rota — redireciona para /login se o usuário não estiver autenticado.
 * Enquanto o AuthContext ainda está validando o token salvo (isLoading),
 * não renderiza nada para evitar um flash de redirect incorreto.
 */
export default function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    // Tela em branco durante a checagem inicial — evita redirect prematuro.
    // Pode ser substituído por um spinner global se preferir.
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
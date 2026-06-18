import './App.css';
import { AuthProvider } from './context/AuthContext';
import { GameProvider }  from './context/GameContext';
import AppRouter         from './routes/AppRouter';

/**
 * Ponto de entrada da aplicação.
 * Responsabilidades:
 *   - Montar os providers de contexto (Auth → Game → Router)
 *   - Delegar todo o roteamento para AppRouter
 *
 * A ordem dos providers importa:
 *   AuthProvider  — mais externo, pois GameProvider e AppRouter dependem do contexto de auth
 *   GameProvider  — envolve o router para que qualquer página acesse o estado da partida
 *   AppRouter     — BrowserRouter + Routes ficam aqui dentro
 */
export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppRouter />
      </GameProvider>
    </AuthProvider>
  );
}
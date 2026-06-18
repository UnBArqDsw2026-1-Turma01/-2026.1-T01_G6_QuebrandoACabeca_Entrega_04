import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Auth
import Login         from '../pages/Login/Login/Login';
import Cadastro      from '../pages/Login/Cadastro/Cadastro';
import RecuperarSenha from '../pages/Login/RecuperarSenha/RecuperarSenha';

// Menu
import Menu          from '../pages/Menu/MenuPrincipal/Menu';
import Placar        from '../pages/Menu/Placar/Placar';
import Historico     from '../pages/Menu/Historico/Historico';
import Configuracoes from '../pages/Menu/Configuracao/Configuracao';
import Tutorial      from '../pages/Menu/Tutorial/Tutorial';

// Configuração de partida
import SelecaoNivel       from '../pages/ConfiguracaoJogo/SelecaoNivel/SelecaoNivel';
import SelecaoDificuldade from '../pages/ConfiguracaoJogo/SelecaoDificuldade/SelecaoDificuldade';
import UploadImagem       from '../pages/ConfiguracaoJogo/UploadImagem/UploadImagem';

// Jogo
import Jogo        from '../pages/Jogo/Jogo/Jogo';
import ProximoNivel from '../pages/Jogo/ProximoNivel/ProximoNivel';
import Vitoria     from '../pages/Jogo/Vitoria/Vitoria';

/**
 * Roteamento central da aplicação.
 *
 * Rotas públicas  — acessíveis sem autenticação: /login, /cadastro, /recuperar-senha
 * Rotas privadas  — protegidas por PrivateRoute: todo o resto
 *
 * PrivateRoute usa isAuthenticated + isLoading do AuthContext:
 *   - isLoading → não renderiza nada (evita flash de redirect)
 *   - !isAuthenticated → redireciona para /login
 *   - isAuthenticated → renderiza <Outlet /> (a rota filha)
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz — redireciona para login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Rotas públicas ── */}
        <Route path="/login"           element={<Login />} />
        <Route path="/cadastro"        element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* ── Rotas privadas ── */}
        <Route element={<PrivateRoute />}>

          {/* Menu */}
          <Route path="/menu"               element={<Menu />} />
          <Route path="/menu/placar"        element={<Placar />} />
          <Route path="/menu/historico"     element={<Historico />} />
          <Route path="/menu/configuracoes" element={<Configuracoes />} />
          <Route path="/menu/tutorial"      element={<Tutorial />} />

          {/* Configuração de partida */}
          <Route path="/selecao-nivel"       element={<SelecaoNivel />} />
          <Route path="/selecao-dificuldade" element={<SelecaoDificuldade />} />
          <Route path="/upload-imagem"       element={<UploadImagem />} />

          {/* Jogo */}
          <Route path="/jogo"               element={<Jogo />} />
          <Route path="/jogo/proximo-nivel" element={<ProximoNivel />} />
          <Route path="/jogo/vitoria"       element={<Vitoria />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
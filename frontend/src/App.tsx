import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login/Login/Login'
import Menu     from './pages/Menu/MenuPrincipal/Menu'
import Cadastro       from './pages/Login/Cadastro/Cadastro';
import RecuperarSenha from './pages/Login/RecuperarSenha/RecuperarSenha';
import SelecaoNivel  from  './pages/ConfiguracaoJogo/SelecaoNivel/SelecaoNivel'
import SelecaoDificuldade from './pages/ConfiguracaoJogo/SelecaoDificuldade/SelecaoDificuldade'
import UploadImagem from './pages/ConfiguracaoJogo/UploadImagem/UploadImagem'
import Pause from './pages/Jogo/Pause/Pause';
import Placar from './pages/Menu/Placar/Placar';
import Dica from './pages/Jogo/Dica/Dica';
import ProximoNivel from './pages/Jogo/ProximoNivel/ProximoNivel';
import Vitoria from './pages/Jogo/Vitoria/Vitoria';
import Historico from './pages/Menu/Historico/Historico';
import Configuracoes from './pages/Menu/Configuracao/Configuracao';
import Tutorial from './pages/Menu/Tutorial/Tutorial';
import Jogo from './pages/Jogo/Jogo/Jogo';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login e derivados */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login e derivados */}
        <Route path="/login"           element={<Login />} />
        <Route path="/cadastro"        element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* Menu e derivados */}
        <Route path="/menu"               element={<Menu />} />
        <Route path="/menu/placar"        element={<Placar />} />
        <Route path="/menu/historico"     element={<Historico />} />
        <Route path="/menu/configuracoes" element={<Configuracoes />} />
        <Route path="/menu/tutorial"      element={<Tutorial />} />

        {/* Configuração de Partida */}
        <Route path="/selecao-nivel"        element={<SelecaoNivel />} />
        <Route path="/selecao-dificuldade"  element={<SelecaoDificuldade />} />
        <Route path="/upload-imagem"        element={<UploadImagem />} />

        {/* Partida */}
        <Route path="/jogo"               element={<Jogo />} />
        <Route path="/jogo/pause"         element={<Pause />} />
        <Route path="/jogo/dica"          element={<Dica />} />
        <Route path="/jogo/proximo-nivel" element={<ProximoNivel />} />
        <Route path="/jogo/vitoria"       element={<Vitoria />} />

      </Routes>
    </BrowserRouter>
  )
}
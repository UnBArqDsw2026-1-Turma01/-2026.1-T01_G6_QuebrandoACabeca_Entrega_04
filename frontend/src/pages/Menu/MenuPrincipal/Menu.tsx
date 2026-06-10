import { useNavigate } from 'react-router-dom'
import './Menu.css'

export default function Menu() {
  const navigate = useNavigate()

  return (
    <div className="menu-page">
      <header>
        <div className="header-left">
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: 'contain' }} />
          <div className="logo">Quebrando a Cabeça</div>
        </div>
        <div className="user-info">
          <span className="badge-success">● Online</span>
          <span className="user-name">Olá, Lucas</span>
        </div>
      </header>

      <main>
        <div className="welcome">
          <h1>Menu Principal</h1>
          <p>O que deseja fazer hoje?</p>
        </div>

        <nav className="menu-list">
          <div className="menu-item" onClick={() => navigate('/selecao-nivel')}>
            <span className="label">🎮 Jogar</span>
            <span className="arrow">›</span>
          </div>

          <div className="menu-item disabled">
            <span className="label">
              🆚 Multiplayer
              <span className="badge-warn" style={{ marginLeft: 6 }}>Em breve</span>
            </span>
            <span className="arrow">›</span>
          </div>

          <div className="menu-item" onClick={() => navigate('/menu/tutorial')}>
            <span className="label">📖 Tutorial</span>
            <span className="arrow">›</span>
          </div>

          <div className="menu-item" onClick={() => navigate('/menu/placar')}>
            <span className="label">🏆 Placar de Liderança</span>
            <span className="arrow">›</span>
          </div>

          <div className="menu-item" onClick={() => navigate('/menu/historico')}>
            <span className="label">📂 Histórico</span>
            <span className="arrow">›</span>
          </div>

          <div className="menu-item" onClick={() => navigate('/menu/configuracoes')}>
            <span className="label">⚙️ Configurações</span>
            <span className="arrow">›</span>
          </div>
        </nav>

        <div className="logout-container">
          <div className="logout-btn" onClick={() => navigate('/login')}>
            <div className="logout-left">
              <div className="logout-icon">🚪</div>
              <div className="logout-text">
                <span className="logout-title">Sair da conta</span>
                <span className="logout-sub">Você será redirecionado para o login</span>
              </div>
            </div>
            <div className="logout-arrow">›</div>
          </div>
        </div>
      </main>
    </div>
  )
}

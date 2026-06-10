import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Configuracao.css'

type TabId = 'audio' | 'visual' | 'conta'

export default function Configuracoes() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('audio')

  // Estados de áudio
  const [som, setSom]       = useState(true)
  const [musica, setMusica] = useState(false)
  const [volume, setVolume] = useState(70)
  const [sfx, setSfx]       = useState(true)

  // Estados visuais
  const [temaEscuro, setTemaEscuro]       = useState(true)
  const [animacoes, setAnimacoes]         = useState(true)
  const [idioma, setIdioma]               = useState('pt')

  function handleDeleteAccount() {
    if (window.confirm('Tem certeza? Esta ação é irreversível.')) {
      navigate('/login')
    }
  }

  return (
    <div className="cfg-page">

      <header className="cfg-header">
        <span className="cfg-logo">⚙️ Configurações</span>
        <a className="cfg-back" onClick={() => navigate('/menu')}>← Menu</a>
      </header>

      <div className="cfg-layout">

        <aside className="cfg-sidebar">
          <div className={`cfg-sidebar-item ${activeTab === 'audio'  ? 'active' : ''}`} onClick={() => setActiveTab('audio')}>Áudio</div>
          <div className={`cfg-sidebar-item ${activeTab === 'visual' ? 'active' : ''}`} onClick={() => setActiveTab('visual')}>Visual</div>
          <div className={`cfg-sidebar-item ${activeTab === 'conta'  ? 'active' : ''}`} onClick={() => setActiveTab('conta')}>Conta</div>
        </aside>

        <main className="cfg-content">

          {/* ── Painel Áudio ── */}
          {activeTab === 'audio' && (
            <div className="cfg-panel">
              <div className="cfg-section-label">Áudio</div>
              <div className="cfg-group">
                <div className="cfg-row">
                  <span>🔊 Som</span>
                  <div className={`cfg-toggle ${!som ? 'off' : ''}`} onClick={() => setSom(p => !p)} />
                </div>
                <div className="cfg-row">
                  <span>🎵 Música</span>
                  <div className={`cfg-toggle ${!musica ? 'off' : ''}`} onClick={() => setMusica(p => !p)} />
                </div>
                <div className="cfg-row">
                  <span>📢 Volume</span>
                  <input type="range" className="cfg-slider" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)} />
                </div>
                <div className="cfg-row">
                  <span>🔔 Efeitos sonoros</span>
                  <div className={`cfg-toggle ${!sfx ? 'off' : ''}`} onClick={() => setSfx(p => !p)} />
                </div>
              </div>
            </div>
          )}

          {/* ── Painel Visual ── */}
          {activeTab === 'visual' && (
            <div className="cfg-panel">
              <div className="cfg-section-label">Visual</div>
              <div className="cfg-group">
                <div className="cfg-row">
                  <span>🌙 Tema escuro</span>
                  <div className={`cfg-toggle ${!temaEscuro ? 'off' : ''}`} onClick={() => setTemaEscuro(p => !p)} />
                </div>
                <div className="cfg-row">
                  <span>✨ Animações</span>
                  <div className={`cfg-toggle ${!animacoes ? 'off' : ''}`} onClick={() => setAnimacoes(p => !p)} />
                </div>
                <div className="cfg-row">
                  <span>🌐 Idioma</span>
                  <select className="cfg-select" value={idioma} onChange={e => setIdioma(e.target.value)}>
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Painel Conta ── */}
          {activeTab === 'conta' && (
            <div className="cfg-panel">
              <div className="cfg-section-label">Conta</div>
              <div className="cfg-group">
                <div className="cfg-row">
                  <span>👤 Nome de usuário</span>
                  <span className="cfg-muted">Lucas</span>
                </div>
                <div className="cfg-row">
                  <span>📧 E-mail</span>
                  <span className="cfg-muted">lucas@email.com</span>
                </div>
                <div className="cfg-row">
                  <span>🔒 Alterar senha</span>
                  <span className="cfg-link">Alterar</span>
                </div>
              </div>
              <div className="cfg-section-label">Zona de perigo</div>
              <button className="cfg-btn-danger" onClick={handleDeleteAccount}>Excluir conta</button>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

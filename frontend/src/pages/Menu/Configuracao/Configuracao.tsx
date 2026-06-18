import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteAccount } from '../../../api/authApi'
import { useAuth } from '../../../hooks/useAuth'
import './Configuracao.css'

type TabId = 'audio' | 'visual' | 'conta'

export default function Configuracoes() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('audio')
  const [showDevModal, setShowDevModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estados de áudio (mockados)
  const [som, setSom]       = useState(true)
  const [musica, setMusica] = useState(false)
  const [volume, setVolume] = useState(70)
  const [sfx, setSfx]       = useState(true)

  // Estados visuais (mockados)
  const [temaEscuro, setTemaEscuro]       = useState(true)
  const [animacoes, setAnimacoes]         = useState(true)
  const [idioma, setIdioma]               = useState('pt')

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false)
    setIsDeleting(true)
    try {
      await deleteAccount()
      await logout() // limpa estado de autenticação
      navigate('/login')
    } catch (error) {
      console.error('Erro ao deletar conta:', error)
      alert('Não foi possível deletar sua conta. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const openDevModal = () => setShowDevModal(true)
  const closeDevModal = () => setShowDevModal(false)

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

        {/* ── Painel Áudio (Em desenvolvimento) ── */}
        {activeTab === 'audio' && (
          <div className="cfg-panel">
            <div className="cfg-section-label">🔊 Áudio</div>
            <div className="cfg-group cfg-wip-group">
              <div className="cfg-wip-banner">
                <span className="cfg-wip-icon">🎧</span>
                <div className="cfg-wip-text">
                  <div className="cfg-wip-title">Configurações de áudio em desenvolvimento</div>
                  <div className="cfg-wip-desc">
                    Em breve você poderá ajustar volume, ativar/desativar música e efeitos sonoros.
                  </div>
                </div>
              </div>
              {/* Controles mockados com opacidade reduzida */}
              <div className="cfg-row">
                <span>🔊 Som</span>
                <div className={`cfg-toggle ${!som ? 'off' : ''}`} style={{ opacity: 0.4, pointerEvents: 'none' }} />
              </div>
              <div className="cfg-row">
                <span>🎵 Música</span>
                <div className={`cfg-toggle ${!musica ? 'off' : ''}`} style={{ opacity: 0.4, pointerEvents: 'none' }} />
              </div>
              <div className="cfg-row">
                <span>📢 Volume</span>
                <input type="range" className="cfg-slider" min="0" max="100" value={volume} onChange={() => {}} style={{ opacity: 0.4, pointerEvents: 'none' }} />
              </div>
              <div className="cfg-row">
                <span>🔔 Efeitos sonoros</span>
                <div className={`cfg-toggle ${!sfx ? 'off' : ''}`} style={{ opacity: 0.4, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Painel Visual (Em desenvolvimento) ── */}
        {activeTab === 'visual' && (
          <div className="cfg-panel">
            <div className="cfg-section-label">🎨 Visual</div>
            <div className="cfg-group cfg-wip-group">
              <div className="cfg-wip-banner">
                <span className="cfg-wip-icon">🖌️</span>
                <div className="cfg-wip-text">
                  <div className="cfg-wip-title">Configurações visuais em desenvolvimento</div>
                  <div className="cfg-wip-desc">
                    Em breve você poderá alternar tema claro/escuro, animações e idioma.
                  </div>
                </div>
              </div>
              <div className="cfg-row">
                <span>🌙 Tema escuro</span>
                <div className={`cfg-toggle ${!temaEscuro ? 'off' : ''}`} style={{ opacity: 0.4, pointerEvents: 'none' }} />
              </div>
              <div className="cfg-row">
                <span>✨ Animações</span>
                <div className={`cfg-toggle ${!animacoes ? 'off' : ''}`} style={{ opacity: 0.4, pointerEvents: 'none' }} />
              </div>
              <div className="cfg-row">
                <span>🌐 Idioma</span>
                <select className="cfg-select" value={idioma} onChange={() => {}} style={{ opacity: 0.4, pointerEvents: 'none' }}>
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
              <div className="cfg-section-label">👤 Conta</div>
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
                  <span className="cfg-link" onClick={openDevModal}>Alterar</span>
                </div>
              </div>
              <div className="cfg-section-label">🚨 Zona de perigo</div>
              <button className="cfg-btn-danger" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
                {isDeleting ? 'Deletando...' : 'Excluir conta'}
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ── Modal de "Em desenvolvimento" ── */}
      {showDevModal && (
        <div className="cfg-modal-overlay" onClick={closeDevModal}>
          <div className="cfg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cfg-modal-icon">🚧</div>
            <div className="cfg-modal-title">Em desenvolvimento</div>
            <div className="cfg-modal-desc">
              Esta funcionalidade estará disponível em breve.
            </div>
            <button className="cfg-modal-btn" onClick={closeDevModal}>Entendido</button>
          </div>
        </div>
      )}

      {/* ── Modal de confirmação para excluir conta ── */}
      {showDeleteConfirm && (
        <div className="cfg-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="cfg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cfg-modal-icon" style={{ fontSize: 48 }}>⚠️</div>
            <div className="cfg-modal-title">Excluir conta</div>
            <div className="cfg-modal-desc">
              Tem certeza que deseja excluir sua conta permanentemente?<br />
              <strong>Todos os seus dados serão perdidos</strong> e esta ação não pode ser desfeita.
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="cfg-modal-btn cfg-modal-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
              <button className="cfg-modal-btn cfg-modal-btn-danger" onClick={handleDeleteAccount}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecuperarSenha.css'

export default function RecuperarSenha() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [emailErro, setEmailErro] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleRecuperar() {
    if (!email) {
      setEmailErro(true)
      return
    }
    setEmailErro(false)
    setIsLoading(true)

    // Simula um pequeno carregamento para dar feedback visual
    await new Promise(resolve => setTimeout(resolve, 800))

    setIsLoading(false)
    setShowModal(true) // Abre o popup de "Em desenvolvimento"
  }

  const handleCloseModal = () => {
    setShowModal(false)
    // Opcional: limpar o campo ou redirecionar
    // navigate('/login')
  }

  return (
    <div className="recuperar-page">
      <div className="card">
        <div className="header">
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: 'contain' }} />
          <span className="logo">Quebrando a Cabeça</span>
          <span className="back" onClick={() => navigate('/login')}>← Voltar</span>
        </div>

        <div className="icon">🔑</div>
        <div className="title">Recuperar Senha</div>
        <div className="sub">
          Digite seu e-mail para receber um link de recuperação.
        </div>

        <input
          className={`field ${emailErro ? 'error' : ''}`}
          type="email"
          placeholder="📧  Seu e-mail"
          value={email}
          onChange={e => { setEmail(e.target.value); setEmailErro(false) }}
          disabled={isLoading}
        />

        <button
          className="btn btn-warn"
          onClick={handleRecuperar}
          disabled={isLoading}
        >
          {isLoading ? 'Enviando…' : 'Enviar link'}
        </button>
      </div>

      {/* ── Modal de "Em Desenvolvimento" ── */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🚧</div>
            <h2 className="modal-title">Funcionalidade em Desenvolvimento</h2>
            <p className="modal-text">
              A recuperação de senha ainda está sendo implementada.
              <br />
              Em breve você poderá redefinir sua senha por e-mail.
            </p>
            <p className="modal-subtext">
              Agradecemos a compreensão! 🙏
            </p>
            <button className="modal-btn" onClick={handleCloseModal}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
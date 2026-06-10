import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecuperarSenha.css'

export default function RecuperarSenha() {
  const navigate = useNavigate()
  const [email, setEmail]     = useState('')
  const [emailErro, setEmailErro] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function handleRecuperar() {
    if (!email) {
      setEmailErro(true)
      return
    }
    setEmailErro(false)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="recuperar-page">
        <div className="card">
          <div className="header">
            <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: 'contain' }} />
            <span className="logo">Quebrando a Cabeça</span>
            <span />
          </div>
          <div className="icon sent-icon">📬</div>
          <div className="title">E-mail enviado!</div>
          <div className="sub">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            Voltar ao Login
          </button>
        </div>
      </div>
    )
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
        />

        <button className="btn btn-warn" onClick={handleRecuperar}>
          Enviar link
        </button>

      </div>
    </div>
  )
}

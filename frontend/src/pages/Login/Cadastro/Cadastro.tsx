import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome]           = useState('')
  const [email, setEmail]         = useState('')
  const [senha, setSenha]         = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro]           = useState('')
  const [sucesso, setSucesso]     = useState(false)
  const [confirmarErro, setConfirmarErro] = useState(false)

  function handleCadastro() {
    if (!nome || !email || !senha || !confirmar) {
      setErro('⚠ Preencha todos os campos.')
      return
    }
    if (senha !== confirmar) {
      setErro('⚠ As senhas não coincidem.')
      setConfirmarErro(true)
      return
    }
    setErro('')
    setConfirmarErro(false)
    setSucesso(true)
  }

  if (sucesso) {
    return (
      <div className="cadastro-page">
        <div className="card">
          <div className="success-view">
            <div className="success-icon">✅</div>
            <div className="title">Conta criada!</div>
            <div className="sub">Seu cadastro foi realizado com sucesso.</div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Ir para o Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cadastro-page">
      <div className="card">

        <div className="header">
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: 'contain' }} />
          <span className="logo">Quebrando a Cabeça</span>
          <span className="back" onClick={() => navigate('/login')}>← Voltar</span>
        </div>

        <div className="title">Criar conta</div>

        <input
          className="field"
          type="text"
          placeholder="👤  Nome de usuário"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          className="field"
          type="email"
          placeholder="📧  E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="field"
          type="password"
          placeholder="🔒  Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <input
          className={`field ${confirmarErro ? 'error' : ''}`}
          type="password"
          placeholder="🔒  Confirmar senha"
          value={confirmar}
          onChange={e => { setConfirmar(e.target.value); setConfirmarErro(false) }}
        />

        {erro && <span className="error-msg">{erro}</span>}

        <button className="btn btn-success" onClick={handleCadastro}>
          Criar conta
        </button>

      </div>
    </div>
  )
}

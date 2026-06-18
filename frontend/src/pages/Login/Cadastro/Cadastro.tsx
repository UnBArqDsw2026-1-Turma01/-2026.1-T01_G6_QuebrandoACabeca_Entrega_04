import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from '../../../utils/constants'
import './Cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const [nome, setNome]           = useState('')
  const [email, setEmail]         = useState('')
  const [senha, setSenha]         = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro]           = useState('')
  const [confirmarErro, setConfirmarErro] = useState(false)
  const [sucesso, setSucesso]     = useState(false)

  async function handleCadastro() {
    // Validações locais — espelham RegisterRequest do backend
    if (!nome || !email || !senha || !confirmar) {
      setErro('⚠ Preencha todos os campos.')
      return
    }
    if (nome.length < NAME_MIN_LENGTH) {
      setErro(`⚠ O nome deve ter ao menos ${NAME_MIN_LENGTH} caracteres.`)
      return
    }
    if (senha.length < PASSWORD_MIN_LENGTH) {
      setErro(`⚠ A senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres.`)
      return
    }
    if (senha !== confirmar) {
      setErro('⚠ As senhas não coincidem.')
      setConfirmarErro(true)
      return
    }

    setErro('')
    setConfirmarErro(false)

    try {
      await register(nome, email, senha)
      setSucesso(true)
    } catch (err: unknown) {
      // Mensagem de erro já formatada pelo AuthContext (vem do backend via ApiError)
      if (err instanceof Error) {
        setErro(err.message)
      } else {
        setErro('Não foi possível criar a conta. Tente novamente.')
      }
    }
  }

  if (sucesso) {
    return (
      <div className="cadastro-page">
        <div className="card">
          <div className="success-view">
            <div className="success-icon">✅</div>
            <div className="title">Conta criada!</div>
            <div className="sub">Seu cadastro foi realizado com sucesso.</div>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Ir para o Menu
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
          disabled={isLoading}
        />
        <input
          className="field"
          type="email"
          placeholder="📧  E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <input
          className="field"
          type="password"
          placeholder="🔒  Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          disabled={isLoading}
        />
        <input
          className={`field ${confirmarErro ? 'error' : ''}`}
          type="password"
          placeholder="🔒  Confirmar senha"
          value={confirmar}
          onChange={e => { setConfirmar(e.target.value); setConfirmarErro(false) }}
          disabled={isLoading}
        />

        {erro && <span className="error-msg">{erro}</span>}

        <button
          className="btn btn-success"
          onClick={handleCadastro}
          disabled={isLoading}
        >
          {isLoading ? 'Criando conta…' : 'Criar conta'}
        </button>

      </div>
    </div>
  )
}
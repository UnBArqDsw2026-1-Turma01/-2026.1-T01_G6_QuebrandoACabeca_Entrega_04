import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated } = useAuth()

  const [email, setEmail]         = useState('')
  const [senha, setSenha]         = useState('')
  const [erro, setErro]           = useState('')
  const [senhaErro, setSenhaErro] = useState(false)

  // Se já estiver autenticado (sessão restaurada), vai direto pro menu
  useEffect(() => {
    if (isAuthenticated) navigate('/menu', { replace: true })
  }, [isAuthenticated, navigate])

  // Limpa os campos ao abrir a página
  useEffect(() => {
    setEmail('')
    setSenha('')
    setErro('')
    setSenhaErro(false)
  }, [])

  async function handleLogin() {
    if (!email || !senha) {
      setErro('⚠ Preencha todos os campos.')
      setSenhaErro(true)
      return
    }
    setErro('')
    setSenhaErro(false)

    try {
      await login(email, senha)
      navigate('/menu', { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message)
      } else {
        setErro('Não foi possível entrar. Tente novamente.')
      }
      setSenhaErro(true)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) handleLogin()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [email, senha, isLoading])

  return (
    <div className="login-page">
      <div className="card">

        <div className="logo">
          <img
            src="/assets/icone.png"
            alt="ícone quebra-cabeça"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
          />
          Quebrando a Cabeça
        </div>

        <div className="badge">v1.0</div>

        <div>
          <div className="title">Bem-vindo!</div>
          <div className="sub">Faça login para continuar</div>
        </div>

        {erro && <div className="error-panel">{erro}</div>}

        <input
          className={`field ${senhaErro ? 'error' : ''}`}
          type="email"
          placeholder="📧  E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="off"
        />
        <input
          className={`field ${senhaErro ? 'error' : ''}`}
          type="password"
          placeholder="🔒  Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          disabled={isLoading}
          autoComplete="new-password"
        />

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Entrando…' : 'Entrar'}
        </button>

        <div className="divider" />

        <div className="links">
          <span className="link" onClick={() => navigate('/cadastro')}>
            Novo por aqui? Cadastre-se
          </span>
          <span className="link" onClick={() => navigate('/recuperar-senha')}>
            Esqueci minha senha
          </span>
        </div>

      </div>
    </div>
  )
}
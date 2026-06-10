import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro]   = useState('')
  const [senhaErro, setSenhaErro] = useState(false)

  // 🔥 FORÇA LIMPEZA DOS CAMPOS AO ABRIR A PÁGINA
  useEffect(() => {
    setEmail('')
    setSenha('')
    setErro('')
    setSenhaErro(false)
  }, [])

  function handleLogin() {
    if (!email || !senha) {
      setErro('⚠ Preencha todos os campos.')
      setSenhaErro(true)
      return
    }
    setErro('')
    setSenhaErro(false)
    navigate('/menu')
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [email, senha])

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
          autoComplete="off"
        />
        <input
          className={`field ${senhaErro ? 'error' : ''}`}
          type="password"
          placeholder="🔒  Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          autoComplete="new-password"
        />

        <button className="btn btn-primary" onClick={handleLogin}>
          Entrar
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
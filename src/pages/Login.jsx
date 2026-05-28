import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Accessibility, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAccessibility } from '../context/AccessibilityContext'
import Wordmark from '../components/Wordmark'

export default function Login() {
  const { login } = useAuth()
  const { setPanelOpen } = useAccessibility()
  const navigate = useNavigate()
  const [username, setUsername] = useState('ana.martins')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Credenciais inválidas. Verifique usuário e senha ou contate o administrador.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pf" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <button
        type="button"
        className="pf-btn pf-btn-ghost pf-login-a11y"
        onClick={() => setPanelOpen(true)}
        aria-label="Abrir configurações de acessibilidade"
      >
        <Accessibility size={18} /> Acessibilidade
      </button>
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Wordmark size="xl" />
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>Sistema de gestão · Loja Centro</p>
        </div>

        <form className="pf-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSubmit}>
          <div className="pf-field">
            <label className="pf-label">Usuário</label>
            <input className="pf-input pf-input-lg" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div className="pf-field">
            <label className="pf-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                className="pf-input pf-input-lg"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert-box">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <button type="submit" className="pf-btn pf-btn-primary pf-btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Acesso controlado pelo administrador.<br />
          Esqueceu a senha? Procure o gerente.
        </p>
      </div>
    </div>
  )
}

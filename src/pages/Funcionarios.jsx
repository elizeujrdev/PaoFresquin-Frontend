import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { useReloadOnFocus } from '../hooks/useReloadOnFocus'

export default function Funcionarios() {
  const [lista, setLista] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/funcionarios/')
      setLista(extractList(data))
    } catch (e) {
      setError(getApiError(e))
    }
  }, [])

  useReloadOnFocus(load)

  return (
    <>
      <div className="page-header">
        <h1 className="pf-h1">Funcionários</h1>
        <Link to="/funcionarios/novo" className="pf-btn pf-btn-accent"><Plus size={16} /> Novo funcionário</Link>
      </div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <div className="grid-3">
        {lista.map((f) => (
          <Link key={f.id} to={`/funcionarios/${f.id}`} className="pf-card" style={{ padding: 24, textDecoration: 'none' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-ink)', fontWeight: 600, marginBottom: 12,
            }}>
              {f.iniciais}
            </div>
            <strong>{f.nome}</strong>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>{f.cargo_label || f.cargo}</p>
            {f.em_ferias_ate && <span className="pf-pill accent" style={{ marginTop: 8 }}>Em férias até {f.em_ferias_ate}</span>}
          </Link>
        ))}
      </div>
    </>
  )
}

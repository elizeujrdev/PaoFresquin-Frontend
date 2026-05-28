import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { useReloadOnFocus } from '../hooks/useReloadOnFocus'
import { formatMoney } from '../utils/format'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/clientes/')
      setClientes(extractList(data))
    } catch (e) {
      setError(getApiError(e))
    }
  }, [])

  useReloadOnFocus(load)

  return (
    <>
      <div className="page-header">
        <h1 className="pf-h1">Clientes</h1>
        <Link to="/clientes/novo" className="pf-btn pf-btn-accent"><Plus size={16} /> Novo cliente</Link>
      </div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <div className="pf-card">
        <div className="table-scroll">
        <table className="pf-table">
          <thead>
            <tr><th>Nome</th><th>CPF</th><th>Fiado em aberto</th><th>Serasa</th><th></th></tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td className="mono">{c.cpf}</td>
                <td className="mono">{formatMoney(c.saldo_devedor)}</td>
                <td>
                  {c.negativado
                    ? <span className="pf-pill danger">Negativado</span>
                    : <span className="pf-pill success">OK</span>}
                </td>
                <td><Link to={`/clientes/${c.id}`}>Ver / editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}

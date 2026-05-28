import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { useReloadOnFocus } from '../hooks/useReloadOnFocus'
import { formatMoney } from '../utils/format'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/produtos/')
      setProdutos(extractList(data))
    } catch (e) {
      setError(getApiError(e))
    }
  }, [])

  useReloadOnFocus(load)

  return (
    <>
      <div className="page-header">
        <h1 className="pf-h1">Produtos</h1>
        <Link to="/produtos/novo" className="pf-btn pf-btn-accent"><Plus size={16} /> Novo produto</Link>
      </div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <div className="pf-card">
        <div className="table-scroll">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.nome}
                  {p.estoque_baixo && <span className="pf-pill danger" style={{ marginLeft: 8 }}>baixo</span>}
                </td>
                <td>{p.categoria_nome}</td>
                <td className="mono">{formatMoney(p.preco_venda)}</td>
                <td className="mono">
                  {p.estoque_atual} {p.unidade === 'PESO' ? 'kg' : 'un'}
                </td>
                <td><Link to={`/produtos/${p.id}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}

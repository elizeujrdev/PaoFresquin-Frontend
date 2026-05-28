import { useCallback, useEffect, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { formatDateTime, formatIsoDateBr, formatMoney } from '../utils/format'
import { downloadCsv, fileTimestamp } from '../utils/export'

const TAB_LABELS = {
  vendas: 'Vendas',
  inadimplencia: 'Inadimplência',
  estoque: 'Estoque',
}

export default function Relatorios() {
  const [tab, setTab] = useState('vendas')
  const [data, setData] = useState(null)
  const [inadimplencia, setInadimplencia] = useState([])
  const [estoque, setEstoque] = useState([])
  const [produtos, setProdutos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [filtros, setFiltros] = useState({ data_inicio: '', data_fim: '', produto: '', funcionario: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/produtos/').then((r) => setProdutos(extractList(r.data)))
    api.get('/funcionarios/').then((r) => setFuncionarios(extractList(r.data)))
  }, [])

  const loadVendas = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filtros.data_inicio) params.data_inicio = filtros.data_inicio
      if (filtros.data_fim) params.data_fim = filtros.data_fim
      if (filtros.produto) params.produto = filtros.produto
      if (filtros.funcionario) params.funcionario = filtros.funcionario
      const { data: res } = await api.get('/relatorios/vendas/', { params })
      setData(res)
    } catch (e) {
      setError(getApiError(e))
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    if (tab === 'vendas') loadVendas()
    else if (tab === 'inadimplencia') {
      api.get('/relatorios/inadimplencia/')
        .then((r) => setInadimplencia(extractList(r.data)))
        .catch((e) => setError(getApiError(e)))
    } else if (tab === 'estoque') {
      api.get('/relatorios/estoque/')
        .then((r) => setEstoque(extractList(r.data)))
        .catch((e) => setError(getApiError(e)))
    }
  }, [tab, loadVendas])

  const maxBar = Math.max(...(data?.vendas_por_dia?.valores || [1]), 1)

  const badgeVariacao = (pct) => {
    if (pct == null || pct === 0) return null
    const positivo = pct > 0
    return (
      <span className={`pf-pill ${positivo ? 'success' : 'danger'}`}>
        {positivo ? '+' : ''}{pct}% vs. período anterior
      </span>
    )
  }

  const periodoLabel = () => {
    if (tab === 'vendas') {
      const ini = filtros.data_inicio || data?.periodo?.inicio
      const fim = filtros.data_fim || data?.periodo?.fim
      if (ini && fim) return `${formatIsoDateBr(ini)} a ${formatIsoDateBr(fim)}`
      if (ini) return `A partir de ${formatIsoDateBr(ini)}`
      if (fim) return `Até ${formatIsoDateBr(fim)}`
      return 'Período padrão (últimos 7 dias)'
    }
    return formatDateTime(new Date())
  }

  const buildCsvRows = () => {
    const ts = fileTimestamp()
    if (tab === 'vendas') {
      if (!data) return null
      const rows = [
        ['Relatório', 'Vendas'],
        ['Gerado em', formatDateTime(new Date())],
        ['Período', periodoLabel()],
        ['Total de vendas', data.total_vendas_periodo],
        [],
        ['Indicador', 'Valor'],
        ['Total vendido', formatMoney(data.total_vendido)],
        ['Ticket médio', formatMoney(data.ticket_medio)],
        ['Vendas fiado', formatMoney(data.vendas_fiado)],
        ['% fiado', `${data.pct_fiado}%`],
        ['Em aberto', formatMoney(data.em_aberto)],
        ['Clientes em aberto', data.clientes_em_aberto],
        ['Variação %', data.variacao_pct != null ? `${data.variacao_pct}%` : ''],
      ]
      if (data.vendas_por_dia?.labels?.length) {
        rows.push([], ['Vendas por dia'], ['Dia', 'Valor (R$)'])
        data.vendas_por_dia.labels.forEach((label, i) => {
          rows.push([label, data.vendas_por_dia.valores[i]])
        })
      }
      if (data.mais_vendidos?.length) {
        rows.push([], ['Mais vendidos'], ['Produto', 'Quantidade', 'Unidade', '% do top'])
        data.mais_vendidos.forEach((p) => {
          rows.push([p.nome, p.quantidade, p.unidade, p.percentual])
        })
      }
      return { filename: `relatorio-vendas_${ts}.csv`, rows }
    }

    if (tab === 'inadimplencia') {
      const rows = [
        ['Relatório', 'Inadimplência'],
        ['Gerado em', formatDateTime(new Date())],
        [],
        ['Cliente', 'Venda', 'Total', 'Compra', 'Última notificação'],
      ]
      inadimplencia.forEach((row) => {
        rows.push([
          row.cliente,
          `#${row.numero}`,
          formatMoney(row.total),
          row.data_compra,
          row.ultima_notificacao || '',
        ])
      })
      return { filename: `relatorio-inadimplencia_${ts}.csv`, rows }
    }

    if (tab === 'estoque') {
      const rows = [
        ['Relatório', 'Estoque'],
        ['Gerado em', formatDateTime(new Date())],
        [],
        ['Produto', 'Categoria', 'Disponível', 'Mínimo', 'Unidade', 'Status'],
      ]
      estoque.forEach((p) => {
        const disp = p.unidade === 'PESO' ? `${p.estoque_atual} kg` : `${p.estoque_atual} un`
        rows.push([
          p.nome,
          p.categoria,
          disp,
          p.estoque_minimo,
          p.unidade === 'PESO' ? 'kg' : 'un',
          p.estoque_baixo ? 'Baixo' : 'OK',
        ])
      })
      return { filename: `relatorio-estoque_${ts}.csv`, rows }
    }

    return null
  }

  const handleExportCsv = () => {
    if (tab === 'vendas' && !data) {
      setError('Aguarde o carregamento do relatório de vendas.')
      return
    }
    if (tab === 'inadimplencia' && inadimplencia.length === 0) {
      setError('Nenhum fiado em aberto para exportar.')
      return
    }
    const built = buildCsvRows()
    if (!built) return
    setError('')
    downloadCsv(built.filename, built.rows)
  }

  const handlePrint = () => {
    if (tab === 'vendas' && !data) {
      setError('Aguarde o carregamento do relatório de vendas.')
      return
    }
    setError('')
    window.print()
  }

  return (
    <>
      <div className="page-header no-print">
        <div>
          <h1 className="pf-h1">Relatórios</h1>
          {data?.tempo_carregamento != null && tab === 'vendas' && (
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>
              Carregado em {data.tempo_carregamento}s · meta &lt; 2s {data.tempo_carregamento < 2 ? '✓' : ''}
            </p>
          )}
        </div>
        <div className="page-header-actions">
          <button type="button" className="pf-btn pf-btn-ghost" onClick={handleExportCsv}>
            <Download size={16} /> Exportar CSV
          </button>
          <button type="button" className="pf-btn pf-btn-ghost" onClick={handlePrint}>
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      <nav className="tabs no-print">
        {[
          ['vendas', 'Vendas'],
          ['inadimplencia', 'Inadimplência'],
          ['estoque', 'Estoque'],
        ].map(([id, label]) => (
          <button key={id} type="button" className={`tab${tab === id ? ' active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      {error && <p className="no-print" style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>}
      {loading && tab === 'vendas' && <p className="no-print" style={{ color: 'var(--muted)', marginBottom: 16 }}>Carregando…</p>}

      <div id="relatorio-print-area" className="relatorio-print-area">
        <div className="relatorio-print-header print-only">
          <h1>Relatórios — {TAB_LABELS[tab]}</h1>
          <p>{periodoLabel()}</p>
          <p>Impresso em {formatDateTime(new Date())}</p>
        </div>

      {tab === 'vendas' && (
        <>
          <div className="no-print relatorio-filtros">
            <input
              className="pf-input"
              type="date"
              value={filtros.data_inicio}
              onChange={(e) => setFiltros((f) => ({ ...f, data_inicio: e.target.value }))}
            />
            <input
              className="pf-input"
              type="date"
              value={filtros.data_fim}
              onChange={(e) => setFiltros((f) => ({ ...f, data_fim: e.target.value }))}
            />
            <select className="pf-select" value={filtros.produto} onChange={(e) => setFiltros((f) => ({ ...f, produto: e.target.value }))}>
              <option value="">Todos os produtos</option>
              {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select className="pf-select" value={filtros.funcionario} onChange={(e) => setFiltros((f) => ({ ...f, funcionario: e.target.value }))}>
              <option value="">Todos os funcionários</option>
              {funcionarios.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
            {data && (
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>
                {data.total_vendas_periodo} vendas no período
              </span>
            )}
          </div>

          {data && (
            <>
              <div className="stats-grid">
                <div className="pf-card" style={{ padding: 20 }}>
                  <p className="pf-label">Total vendido</p>
                  <p className="mono" style={{ fontSize: 24, fontWeight: 500, margin: '8px 0' }}>{formatMoney(data.total_vendido)}</p>
                  {badgeVariacao(data.variacao_pct)}
                </div>
                <div className="pf-card" style={{ padding: 20 }}>
                  <p className="pf-label">Ticket médio</p>
                  <p className="mono" style={{ fontSize: 24, fontWeight: 500, margin: '8px 0' }}>{formatMoney(data.ticket_medio)}</p>
                  {data.variacao_ticket != null && (
                    <span className="pf-pill muted">
                      {Number(data.variacao_ticket) >= 0 ? '+' : ''}{formatMoney(data.variacao_ticket)} vs. anterior
                    </span>
                  )}
                </div>
                <div className="pf-card" style={{ padding: 20 }}>
                  <p className="pf-label">Vendas fiado</p>
                  <p className="mono" style={{ fontSize: 24, fontWeight: 500, margin: '8px 0' }}>{formatMoney(data.vendas_fiado)}</p>
                  <span className="pf-pill muted">{data.pct_fiado}% do total</span>
                </div>
                <div className="pf-card" style={{ padding: 20 }}>
                  <p className="pf-label">Em aberto</p>
                  <p className="mono" style={{ fontSize: 24, fontWeight: 500, margin: '8px 0' }}>{formatMoney(data.em_aberto)}</p>
                  <span className="pf-pill danger">{data.clientes_em_aberto} clientes</span>
                </div>
              </div>

              {data.vendas_por_dia?.valores?.length > 0 ? (
                <div className="grid-2-1">
                  <div className="pf-card" style={{ padding: 24 }}>
                    <h2 className="pf-h2">Vendas por dia</h2>
                    <div className="chart-bar">
                      {data.vendas_por_dia.valores.map((v, i) => (
                        <div key={i} className="chart-bar-item">
                          <div
                            className={`chart-bar-fill${i === data.vendas_por_dia.valores.length - 1 ? ' highlight' : ''}`}
                            style={{ height: `${(v / maxBar) * 160}px` }}
                          />
                          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{data.vendas_por_dia.labels[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pf-card" style={{ padding: 24 }}>
                    <h2 className="pf-h2">Mais vendidos</h2>
                    {data.mais_vendidos?.length ? data.mais_vendidos.map((p) => (
                      <div key={p.nome} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                          <span>{p.nome}</span>
                          <span className="mono">{p.quantidade} {p.unidade}</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--bg-soft)', borderRadius: 3 }}>
                          <div style={{ width: `${p.percentual}%`, height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                        </div>
                      </div>
                    )) : <p style={{ color: 'var(--muted)' }}>Sem vendas no período.</p>}
                  </div>
                </div>
              ) : (
                <div className="pf-card" style={{ padding: 24 }}>
                  <p style={{ color: 'var(--muted)' }}>Nenhuma venda no período selecionado.</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === 'inadimplencia' && (
        <div className="pf-card" style={{ padding: 24 }}>
          {inadimplencia.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Nenhum fiado em aberto no momento.</p>
          ) : (
            <div className="table-scroll">
              <table className="pf-table">
                <thead>
                  <tr><th>Cliente</th><th>Venda</th><th>Total</th><th>Compra</th><th>Última notif.</th></tr>
                </thead>
                <tbody>
                  {inadimplencia.map((row) => (
                    <tr key={row.venda_id}>
                      <td>{row.cliente}</td>
                      <td>#{row.numero}</td>
                      <td className="mono">{formatMoney(row.total)}</td>
                      <td>{row.data_compra}</td>
                      <td>{row.ultima_notificacao || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'estoque' && (
        <div className="pf-card" style={{ padding: 24 }}>
          <div className="table-scroll">
            <table className="pf-table">
              <thead>
                <tr><th>Produto</th><th>Categoria</th><th>Disponível</th><th>Mínimo</th><th>Status</th></tr>
              </thead>
              <tbody>
                {estoque.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.categoria}</td>
                    <td className="mono">{p.estoque_atual} {p.unidade === 'PESO' ? 'kg' : 'un'}</td>
                    <td className="mono">{p.estoque_minimo}</td>
                    <td>
                      {p.estoque_baixo
                        ? <span className="pf-pill danger">Baixo</span>
                        : <span className="pf-pill success">OK</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

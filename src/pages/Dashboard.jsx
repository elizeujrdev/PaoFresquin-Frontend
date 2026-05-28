import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, Users, Briefcase, Package, LineChart, Camera, AlertTriangle,
} from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { useAuth } from '../context/AuthContext'
import { formatMoney, greetingName } from '../utils/format'

const TILES = [
  { to: '/pdv', title: 'Registrar Venda', sub: 'Abrir o PDV e iniciar uma nova venda', icon: ShoppingCart, accent: true },
  { to: '/clientes', title: 'Clientes', sub: 'Cadastrar, consultar fiado e histórico', icon: Users },
  { to: '/funcionarios', title: 'Funcionários', sub: 'Ponto, atestados e licenças', icon: Briefcase },
  { to: '/produtos', title: 'Produtos', sub: 'Cadastro, preços e códigos de barras', icon: Package },
  { to: '/relatorios', title: 'Relatórios', sub: 'Vendas por período e inadimplência', icon: LineChart },
  { to: '/cameras', title: 'Câmeras', sub: 'Monitorar loja e cozinha em tempo real', icon: Camera },
]

const PAY_LABELS = {
  DINHEIRO: 'Dinheiro', PIX: 'Pix', DEBITO: 'Débito', CREDITO: 'Crédito', FIADO: 'Fiado',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [dash, setDash] = useState(null)
  const [vendas, setVendas] = useState([])
  const [avisos, setAvisos] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [d, v, a] = await Promise.all([
        api.get('/dashboard/'),
        api.get('/vendas/recentes/'),
        api.get('/avisos/'),
      ])
      setDash(d.data)
      setVendas(extractList(v.data))
      setAvisos(extractList(a.data))
    } catch (e) {
      setError(getApiError(e))
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [load])

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="pf-h1">{greetingName(user?.nome || user?.first_name)}</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 15 }}>
            Hoje · {dash?.vendas_hoje ?? '—'} vendas · <span className="mono">{formatMoney(dash?.total_hoje)}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="pf-pill success">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
            Câmeras online
          </span>
          {(dash?.fiados_vencidos ?? 0) > 0 && (
            <span className="pf-pill accent">
              <AlertTriangle size={13} /> {dash.fiados_vencidos} fiados vencidos
            </span>
          )}
        </div>
      </div>

      {error && <p style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</p>}

      <div className="grid-3" style={{ marginBottom: 28 }}>
        {TILES.map(({ to, title, sub, icon: Icon, accent }) => (
          <Link key={to} to={to} className="pf-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16, textDecoration: 'none' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 10,
              background: accent ? 'var(--accent-soft)' : 'var(--bg-soft)',
              color: accent ? 'var(--accent-ink)' : 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>{sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2-1 desktop-only">
        <div className="pf-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="pf-h2">Últimas vendas</h2>
            <Link to="/relatorios" className="pf-btn pf-btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }}>Ver todas</Link>
          </div>
          {vendas.length === 0 && <p style={{ color: 'var(--muted)' }}>Nenhuma venda registrada hoje.</p>}
          {vendas.map((v) => (
            <div key={v.id} style={{
              display: 'grid', gridTemplateColumns: '70px 60px 1fr 100px 100px',
              padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, alignItems: 'center',
            }}>
              <span className="mono" style={{ color: 'var(--muted)' }}>#{v.numero}</span>
              <span className="mono" style={{ color: 'var(--muted)' }}>{v.hora}</span>
              <span>{v.cliente_nome}</span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{PAY_LABELS[v.forma_pagamento] || v.forma_pagamento}</span>
              <span className="mono" style={{ textAlign: 'right', fontWeight: 500 }}>{formatMoney(v.total)}</span>
            </div>
          ))}
        </div>

        <div className="pf-card" style={{ padding: 24 }}>
          <h2 className="pf-h2" style={{ marginBottom: 14 }}>Avisos</h2>
          {avisos.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Nenhum aviso no momento.</p>}
          {avisos.map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '12px 0',
              borderBottom: i < avisos.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', marginTop: 7, flexShrink: 0,
                background: a.tipo === 'danger' ? 'var(--danger)' : a.tipo === 'warning' ? 'var(--accent)' : 'var(--muted-2)',
              }} />
              <div style={{ fontSize: 14 }}>
                <div>{a.titulo}</div>
                {a.subtitulo && <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{a.subtitulo}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(dash?.fiados_vencidos ?? 0) > 0 && (
        <Link to="/relatorios" className="pf-card mobile-only" style={{
          marginTop: 16, padding: 16, display: 'flex', gap: 12, textDecoration: 'none', borderLeft: '3px solid var(--danger)',
        }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <div>
            <div style={{ color: 'var(--danger)', fontWeight: 600 }}>{dash.fiados_vencidos} fiados vencidos</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {formatMoney(dash.fiado_aberto)} em aberto · ver detalhes
            </div>
          </div>
        </Link>
      )}
    </>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X, AlertTriangle } from 'lucide-react'
import api from '../api/client'
import { getApiError } from '../api/helpers'
import { useConfirm } from '../context/ConfirmContext'
import { formatDateLong, formatMoney } from '../utils/format'

export default function ClienteForm() {
  const { confirm } = useConfirm()
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'novo'
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '', endereco: '' })
  const [serasa, setSerasa] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  const loadCliente = useCallback(async () => {
    if (isNew) return
    setLoading(true)
    try {
      const { data } = await api.get(`/clientes/${id}/`)
      setCliente(data)
      setForm({
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone || '',
        email: data.email || '',
        endereco: data.endereco || '',
      })
      setSerasa({
        negativado: data.negativado,
        score: data.score_serasa,
        restricoes: data.restricoes_serasa,
        consultado_em: data.ultima_consulta_serasa,
      })
    } catch (e) {
      setError(getApiError(e))
    } finally {
      setLoading(false)
    }
  }, [id, isNew])

  useEffect(() => {
    loadCliente()
  }, [loadCliente])

  const consultarSerasa = async (cpf) => {
    const limpo = cpf.replace(/\D/g, '')
    if (limpo.length < 11) return
    try {
      const { data } = await api.get(`/clientes/consulta-serasa/${encodeURIComponent(cpf)}/`)
      setSerasa(data)
    } catch (e) {
      setError(getApiError(e))
    }
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    setError('')
    if (!form.nome.trim() || !form.cpf.trim()) {
      setError('Nome e CPF são obrigatórios.')
      return
    }
    if (isNew && serasa?.negativado) {
      setError('Cadastro bloqueado: CPF negativado no Serasa.')
      return
    }
    setSaving(true)
    try {
      if (isNew) {
        await api.post('/clientes/', form)
      } else {
        await api.patch(`/clientes/${id}/`, form)
      }
      navigate('/clientes')
    } catch (e) {
      setError(getApiError(e))
    } finally {
      setSaving(false)
    }
  }

  const confirmSave = async () => {
    const nome = form.nome.trim() || 'este cliente'
    const ok = await confirm({
      title: isNew ? 'Cadastrar cliente?' : 'Salvar alterações?',
      message: isNew
        ? `O cliente "${nome}" será cadastrado.`
        : `Os dados de "${nome}" serão atualizados.`,
      confirmLabel: isNew ? 'Cadastrar' : 'Salvar',
    })
    if (ok) await save()
  }

  const reconsultar = async () => {
    const ok = await confirm({
      title: 'Reconsultar Serasa?',
      message: 'Será feita uma nova consulta de crédito para este CPF.',
      confirmLabel: 'Consultar',
    })
    if (!ok) return
    if (!isNew) {
      const { data } = await api.post(`/clientes/${id}/reconsultar_serasa/`)
      setCliente(data)
      setSerasa({
        negativado: data.negativado,
        score: data.score_serasa,
        restricoes: data.restricoes_serasa,
        consultado_em: data.ultima_consulta_serasa,
      })
    } else {
      await consultarSerasa(form.cpf)
    }
  }

  const bloqueadoNovo = isNew && serasa?.negativado
  const negativado = serasa?.negativado || cliente?.negativado

  if (loading) return <p>Carregando cliente…</p>

  return (
    <>
      <Link to="/clientes" className="pf-btn pf-btn-ghost" style={{ marginBottom: 8 }}><ArrowLeft size={16} /> Voltar</Link>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Clientes · {isNew ? 'Novo' : form.nome}</p>
      <div className="page-header">
        <div>
          <h1 className="pf-h1">{form.nome || 'Novo cliente'}</h1>
          {cliente?.cpf && (
            <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>
              {cliente.cpf}
              {cliente.cliente_desde && ` · cliente desde ${String(cliente.cliente_desde).slice(0, 7)}`}
            </p>
          )}
        </div>
        <div className="page-header-actions">
          <Link to="/clientes" className="pf-btn pf-btn-ghost"><X size={16} /> Cancelar</Link>
          <button type="button" className="pf-btn pf-btn-accent" data-pf-save onClick={confirmSave} disabled={saving || bloqueadoNovo}>
            {bloqueadoNovo ? 'Salvamento bloqueado' : saving ? 'Salvando…' : 'Salvar cliente'}
          </button>
        </div>
      </div>

      {negativado && (
        <div className="serasa-banner">
          <div>
            <strong style={{ color: 'var(--danger)', display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertTriangle size={18} /> Nome negativado na consulta Serasa
            </strong>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-2)' }}>
              Score {serasa?.score ?? cliente?.score_serasa ?? '—'}/1000 · {serasa?.restricoes ?? cliente?.restricoes_serasa ?? 0} restrições.
              {isNew ? ' Cadastro de fiado bloqueado.' : ' Cliente mantido no sistema; fiado bloqueado.'}
            </p>
          </div>
          <button type="button" className="pf-btn pf-btn-ghost" onClick={reconsultar}>Reconsultar Serasa</button>
        </div>
      )}

      {error && <div className="alert-box" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="grid-2-1">
        <div className="pf-card" style={{ padding: 28 }}>
          <h2 className="pf-h2" style={{ marginBottom: 20 }}>Dados pessoais</h2>
          {[
            ['nome', 'Nome completo'],
            ['cpf', 'CPF'],
            ['telefone', 'Telefone'],
            ['email', 'E-mail'],
            ['endereco', 'Endereço'],
          ].map(([field, label]) => (
            <div key={field} className="pf-field" style={{ marginBottom: 16 }}>
              <label className="pf-label">{label}</label>
              <input
                className="pf-input"
                value={form[field]}
                onChange={(e) => {
                  set(field, e.target.value)
                  if (field === 'cpf') consultarSerasa(e.target.value)
                }}
                onBlur={field === 'cpf' ? () => consultarSerasa(form.cpf) : undefined}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="pf-card" style={{ padding: 20 }}>
            <h3 className="pf-h3">Crédito · Serasa</h3>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <span className={`pf-pill ${negativado ? 'danger' : 'success'}`}>{negativado ? 'Negativado' : 'Regular'}</span>
              <span>Score: <strong>{serasa?.score ?? cliente?.score_serasa ?? '—'}</strong> / 1000</span>
              <span>Restrições: {serasa?.restricoes ?? cliente?.restricoes_serasa ?? 0} ativas</span>
            </div>
          </div>
          {cliente?.historico_fiado?.length > 0 && (
            <div className="pf-card" style={{ padding: 20 }}>
              <h3 className="pf-h3">Histórico de fiado</h3>
              {cliente.historico_fiado.map((h) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span>{formatDateLong(h.criado_em)} · {h.descricao}</span>
                  <span>
                    <span className="mono">{formatMoney(h.total)}</span>{' '}
                    <span className={`pf-pill ${h.status_label === 'pago' ? 'success' : 'danger'}`}>{h.status_label}</span>
                  </span>
                </div>
              ))}
              <p style={{ marginTop: 12, color: 'var(--danger)', fontWeight: 600 }}>
                Total em aberto: {formatMoney(cliente.saldo_devedor)}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

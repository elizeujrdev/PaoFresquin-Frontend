import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2, X, Check, Clock, Paperclip } from 'lucide-react'
import api from '../api/client'
import { getApiError } from '../api/helpers'
import { useConfirm } from '../context/ConfirmContext'

const emptyForm = {
  nome: '',
  cargo: 'ATENDENTE',
  telefone: '',
  endereco: '',
  contato_emergencia: '',
  data_admissao: new Date().toISOString().slice(0, 10),
}

export default function FuncionarioForm() {
  const { confirm } = useConfirm()
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'novo'
  const [f, setF] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [ausencia, setAusencia] = useState({ titulo: '', tipo: 'ATESTADO', data_inicio: '', data_fim: '' })

  const load = useCallback(async () => {
    if (isNew) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get(`/funcionarios/${id}/`)
      setF(data)
      setForm({
        nome: data.nome,
        cargo: data.cargo,
        telefone: data.telefone || '',
        endereco: data.endereco || '',
        contato_emergencia: data.contato_emergencia || '',
        data_admissao: data.data_admissao,
      })
    } catch (e) {
      setError(getApiError(e))
    } finally {
      setLoading(false)
    }
  }, [id, isNew])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    setError('')
    if (!form.nome.trim()) {
      setError('Nome é obrigatório.')
      return
    }
    setSaving(true)
    try {
      if (isNew) {
        const { data } = await api.post('/funcionarios/', form)
        navigate(`/funcionarios/${data.id}`)
      } else {
        const { data } = await api.patch(`/funcionarios/${id}/`, form)
        setF(data)
      }
    } catch (e) {
      setError(getApiError(e))
    } finally {
      setSaving(false)
    }
  }

  const confirmSave = async () => {
    const nome = form.nome.trim() || 'este funcionário'
    const ok = await confirm({
      title: isNew ? 'Cadastrar funcionário?' : 'Salvar alterações?',
      message: isNew
        ? `O funcionário "${nome}" será cadastrado.`
        : `Os dados de "${nome}" serão atualizados.`,
      confirmLabel: isNew ? 'Cadastrar' : 'Salvar',
    })
    if (ok) await save()
  }

  const desligar = async () => {
    const ok = await confirm({
      title: 'Desligar funcionário?',
      message: `Confirma o desligamento de "${form.nome}"? O registro permanece no histórico.`,
      confirmLabel: 'Desligar',
      variant: 'danger',
    })
    if (!ok) return
    try {
      await api.post(`/funcionarios/${id}/desligar/`)
      navigate('/funcionarios')
    } catch (e) {
      setError(getApiError(e))
    }
  }

  const anexarAusencia = async () => {
    if (!ausencia.titulo || !ausencia.data_inicio || !ausencia.data_fim) {
      setError('Preencha título e datas da ausência.')
      return
    }
    const ok = await confirm({
      title: 'Registrar ausência?',
      message: `Será registrado "${ausencia.titulo}" de ${ausencia.data_inicio} a ${ausencia.data_fim}.`,
      confirmLabel: 'Registrar',
    })
    if (!ok) return
    try {
      await api.post(`/funcionarios/${id}/ausencias/`, ausencia)
      await load()
      setAusencia({ titulo: '', tipo: 'ATESTADO', data_inicio: '', data_fim: '' })
    } catch (e) {
      setError(getApiError(e))
    }
  }

  if (loading) return <p>Carregando…</p>

  const anos = f?.data_admissao
    ? new Date().getFullYear() - new Date(f.data_admissao).getFullYear()
    : 0

  return (
    <>
      <Link to="/funcionarios" className="pf-btn pf-btn-ghost"><ArrowLeft size={16} /> Voltar</Link>
      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '8px 0' }}>
        Funcionários · {isNew ? 'Novo' : f?.nome}
      </p>
      <div className="page-header" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600, color: 'var(--accent-ink)',
          }}>
            {f?.iniciais || form.nome.slice(0, 2).toUpperCase() || '??'}
          </div>
          <div>
            <h1 className="pf-h1">{form.nome || 'Novo funcionário'}</h1>
            {f && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span className="pf-pill accent">{f.cargo_label || f.cargo}</span>
                {f.em_ferias_ate && <span className="pf-pill muted">Em férias até {f.em_ferias_ate}</span>}
                <span className="pf-pill muted"><Clock size={12} /> {anos} anos na casa</span>
              </div>
            )}
          </div>
        </div>
        <div className="page-header-actions">
          {!isNew && (
            <button type="button" className="pf-btn pf-btn-danger" onClick={desligar}>
              <Trash2 size={16} /> Desligar
            </button>
          )}
          <Link to="/funcionarios" className="pf-btn pf-btn-ghost"><X size={16} /> Cancelar</Link>
          <button type="button" className="pf-btn pf-btn-accent" data-pf-save onClick={confirmSave} disabled={saving}>
            <Check size={16} /> {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {error && <div className="alert-box" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="grid-2-1">
        <div className="pf-card" style={{ padding: 28 }}>
          <h2 className="pf-h2" style={{ marginBottom: 20 }}>Dados cadastrais</h2>
          {[
            ['nome', 'Nome completo', 'text'],
            ['cargo', 'Cargo', 'select'],
            ['telefone', 'Telefone', 'text'],
            ['data_admissao', 'Data de admissão', 'date'],
            ['endereco', 'Endereço', 'text'],
            ['contato_emergencia', 'Contato de emergência', 'text'],
          ].map(([key, label, type]) => (
            <div key={key} className="pf-field" style={{ marginBottom: 16 }}>
              <label className="pf-label">{label}</label>
              {type === 'select' ? (
                <select className="pf-select" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })}>
                  <option value="PADEIRO">Padeiro</option>
                  <option value="ATENDENTE">Atendente</option>
                  <option value="GERENTE">Gerente</option>
                </select>
              ) : (
                <input
                  className="pf-input"
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        {!isNew && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="pf-card" style={{ padding: 20 }}>
              <h2 className="pf-h2">Registros de ponto</h2>
              <div className="table-scroll" style={{ marginTop: 12 }}>
              <table className="pf-table">
                <thead>
                  <tr><th>Dia</th><th>Entrada</th><th>Saída</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {(f?.pontos_resumo || []).map((p, i) => (
                    <tr key={i}>
                      <td>{p.data}</td>
                      <td>{p.entrada}</td>
                      <td>{p.saida}</td>
                      <td style={p.obs ? { color: 'var(--accent)' } : undefined}>{p.obs || p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="pf-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 className="pf-h2">Atestados & ausências</h2>
              </div>
              {f?.ausencias?.map((a) => (
                <p key={a.id} style={{ fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <strong>{a.titulo}</strong> ({a.data_inicio} a {a.data_fim})
                  {a.nome_arquivo && <> · {a.nome_arquivo}</>}
                </p>
              ))}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="pf-input" placeholder="Título" value={ausencia.titulo} onChange={(e) => setAusencia({ ...ausencia, titulo: e.target.value })} />
                <div className="form-grid-2" style={{ gap: 8 }}>
                  <input className="pf-input" type="date" value={ausencia.data_inicio} onChange={(e) => setAusencia({ ...ausencia, data_inicio: e.target.value })} />
                  <input className="pf-input" type="date" value={ausencia.data_fim} onChange={(e) => setAusencia({ ...ausencia, data_fim: e.target.value })} />
                </div>
                <button type="button" className="pf-btn pf-btn-ghost" onClick={anexarAusencia}>
                  <Paperclip size={16} /> Anexar registro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

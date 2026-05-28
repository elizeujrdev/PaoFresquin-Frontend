import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2, X, Check, Barcode } from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { useConfirm } from '../context/ConfirmContext'
import { formatMoney, parseDecimal } from '../utils/format'

const emptyForm = {
  nome: '', codigo_barras: '', categoria: '', preco_venda: '', unidade: 'PESO',
  descricao: '', estoque_atual: '', estoque_minimo: '',
}

export default function ProdutoForm() {
  const { confirm } = useConfirm()
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'novo'
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadProduto = useCallback(async () => {
    if (isNew) return
    setLoading(true)
    try {
      const { data: p } = await api.get(`/produtos/${id}/`)
      setForm({
        nome: p.nome,
        codigo_barras: p.codigo_barras || '',
        categoria: String(p.categoria),
        preco_venda: String(p.preco_venda),
        unidade: p.unidade,
        descricao: p.descricao || '',
        estoque_atual: String(p.estoque_atual),
        estoque_minimo: String(p.estoque_minimo),
      })
    } catch (e) {
      setError(getApiError(e, 'Produto não encontrado.'))
    } finally {
      setLoading(false)
    }
  }, [id, isNew])

  useEffect(() => {
    api.get('/produtos/categorias/').then((r) => setCategorias(extractList(r.data)))
    loadProduto()
  }, [loadProduto])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const buildPayload = () => {
    const preco = parseDecimal(form.preco_venda)
    const estoque = parseDecimal(form.estoque_atual)
    const minimo = parseDecimal(form.estoque_minimo)
    if (preco == null || preco < 0) throw new Error('Informe um preço válido (ex.: 0,75 ou 6.50).')
    if (!form.nome.trim()) throw new Error('Informe o nome do produto.')
    if (!form.categoria) throw new Error('Selecione uma categoria.')
    return {
      nome: form.nome.trim(),
      codigo_barras: form.codigo_barras.trim() || null,
      categoria: Number(form.categoria),
      preco_venda: preco,
      unidade: form.unidade,
      descricao: form.descricao,
      estoque_atual: estoque ?? 0,
      estoque_minimo: minimo ?? 0,
    }
  }

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      const payload = buildPayload()
      if (isNew) await api.post('/produtos/', payload)
      else await api.patch(`/produtos/${id}/`, payload)
      navigate('/produtos')
    } catch (e) {
      setError(e.message || getApiError(e))
    } finally {
      setSaving(false)
    }
  }

  const confirmSave = async () => {
    const nome = form.nome.trim() || 'este produto'
    const ok = await confirm({
      title: isNew ? 'Cadastrar produto?' : 'Salvar alterações?',
      message: isNew
        ? `O produto "${nome}" será cadastrado no sistema.`
        : `As alterações em "${nome}" serão gravadas.`,
      confirmLabel: isNew ? 'Cadastrar' : 'Salvar',
    })
    if (ok) await save()
  }

  const excluir = async () => {
    const ok = await confirm({
      title: 'Desativar produto?',
      message: 'O produto não aparecerá mais no PDV. Esta ação pode ser revertida pelo administrador.',
      confirmLabel: 'Desativar',
      variant: 'danger',
    })
    if (!ok) return
    setSaving(true)
    try {
      await api.delete(`/produtos/${id}/`)
      navigate('/produtos')
    } catch (e) {
      setError(getApiError(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Carregando produto…</p>

  const precoLabel = form.unidade === 'PESO' ? '/ kg' : ''

  return (
    <>
      <Link to="/produtos" className="pf-btn pf-btn-ghost" style={{ marginBottom: 8 }}><ArrowLeft size={16} /> Voltar</Link>
      <div className="page-header">
        <h1 className="pf-h1">{isNew ? 'Cadastro de produto' : form.nome}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {!isNew && (
            <button type="button" className="pf-btn pf-btn-danger" onClick={excluir} disabled={saving}>
              <Trash2 size={16} /> Excluir
            </button>
          )}
          <Link to="/produtos" className="pf-btn pf-btn-ghost"><X size={16} /> Cancelar</Link>
          <button type="button" className="pf-btn pf-btn-accent" data-pf-save onClick={confirmSave} disabled={saving}>
            <Check size={16} /> {saving ? 'Salvando…' : 'Salvar produto'}
          </button>
        </div>
      </div>
      {error && <div className="alert-box" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="grid-2-1">
        <div className="pf-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 className="pf-h2">Informações básicas</h2>
          <div className="pf-field">
            <label className="pf-label">Nome do produto</label>
            <input className="pf-input pf-input-lg" value={form.nome} onChange={(e) => set('nome', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="pf-field">
              <label className="pf-label">Código de barras</label>
              <div style={{ position: 'relative' }}>
                <Barcode size={18} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--muted)' }} />
                <input className="pf-input mono" style={{ paddingLeft: 38 }} value={form.codigo_barras} onChange={(e) => set('codigo_barras', e.target.value)} />
              </div>
            </div>
            <div className="pf-field">
              <label className="pf-label">Categoria</label>
              <select className="pf-select" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
                <option value="">Selecione</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="pf-field">
              <label className="pf-label">Preço unitário</label>
              <input className="pf-input mono" value={form.preco_venda} onChange={(e) => set('preco_venda', e.target.value)} />
            </div>
            <div className="pf-field">
              <label className="pf-label">Unidade de medida</label>
              <div style={{ display: 'flex' }}>
                {['PESO', 'UNIDADE'].map((u) => (
                  <button key={u} type="button" onClick={() => set('unidade', u)} style={{
                    flex: 1, padding: 12, border: '1px solid var(--border)', cursor: 'pointer',
                    background: form.unidade === u ? 'var(--ink)' : 'var(--surface)',
                    color: form.unidade === u ? '#fff' : 'var(--ink)', fontFamily: 'inherit', fontSize: 14,
                  }}>
                    {u === 'PESO' ? 'Peso (kg)' : 'Unidade'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pf-field">
            <label className="pf-label">Descrição (opcional)</label>
            <textarea className="pf-textarea" rows={3} value={form.descricao} onChange={(e) => set('descricao', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="pf-card" style={{ padding: 20 }}>
            <p className="pf-eyebrow">Pré-visualização</p>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: 20, marginTop: 12 }}>
              <strong>{form.nome || 'Produto'}</strong>
              <p className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>{form.codigo_barras}</p>
              <p className="mono" style={{ fontSize: 28, margin: '8px 0 0' }}>{formatMoney(form.preco_venda || 0)}{precoLabel}</p>
            </div>
          </div>
          <div className="pf-card" style={{ padding: 20 }}>
            <p className="pf-eyebrow">Estoque</p>
            <div className="pf-field" style={{ marginTop: 12 }}>
              <label className="pf-label">Disponível hoje</label>
              <input className="pf-input" value={form.estoque_atual} onChange={(e) => set('estoque_atual', e.target.value)} />
            </div>
            <div className="pf-field">
              <label className="pf-label">Mínimo</label>
              <input className="pf-input" value={form.estoque_minimo} onChange={(e) => set('estoque_minimo', e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Barcode, Search, Trash2, X, ArrowRight, Shield, Receipt, Plus, Minus, CheckCircle2 } from 'lucide-react'
import api from '../api/client'
import { extractList, getApiError } from '../api/helpers'
import { useAuth } from '../context/AuthContext'
import { useConfirm } from '../context/ConfirmContext'
import { formatMoney, formatQty, parseDecimal } from '../utils/format'

const PAYMENTS = [
  { id: 'DINHEIRO', label: 'Dinheiro' },
  { id: 'PIX', label: 'Pix' },
  { id: 'DEBITO', label: 'Débito' },
  { id: 'CREDITO', label: 'Crédito' },
]

function calcSubtotal(qtd, preco) {
  return (Number(qtd) * Number(preco)).toFixed(2)
}

function defaultQty(unidade) {
  return unidade === 'PESO' ? 0.42 : 1
}

function PdvQtyControls({ item, idx, updateQty, setQtyInput }) {
  return (
    <div className="pdv-qty-controls">
      <button type="button" className="pf-btn pf-btn-ghost" style={{ padding: 4 }} onClick={() => updateQty(idx, -1)} aria-label="Menos">
        <Minus size={14} />
      </button>
      <input
        className="pf-input mono"
        value={item.unidade === 'PESO' ? String(item.quantidade).replace('.', ',') : item.quantidade}
        onChange={(e) => setQtyInput(idx, e.target.value)}
        aria-label={`Quantidade de ${item.nome}`}
      />
      <button type="button" className="pf-btn pf-btn-ghost" style={{ padding: 4 }} onClick={() => updateQty(idx, 1)} aria-label="Mais">
        <Plus size={14} />
      </button>
    </div>
  )
}

export default function Pdv() {
  const { user } = useAuth()
  const { confirm } = useConfirm()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [numeroVenda, setNumeroVenda] = useState(null)
  const [barcode, setBarcode] = useState('')
  const [catalogo, setCatalogo] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [itens, setItens] = useState([])
  const [pagamento, setPagamento] = useState('PIX')
  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [funcionarios, setFuncionarios] = useState([])
  const [funcionarioId, setFuncionarioId] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [concluida, setConcluida] = useState(null)

  const refreshNumero = useCallback(() => {
    api.get('/vendas/proxima/').then((r) => setNumeroVenda(r.data.numero)).catch(() => {})
  }, [])

  useEffect(() => {
    refreshNumero()
    api.get('/produtos/', { params: { pdv: 1 } }).then((r) => setCatalogo(extractList(r.data)))
    api.get('/clientes/').then((r) => setClientes(extractList(r.data)))
    api.get('/funcionarios/').then((r) => {
      const list = extractList(r.data).filter((f) => f.ativo !== false)
      setFuncionarios(list)
      const mine = list.find((f) => f.usuario === user?.id)
      setFuncionarioId(String((mine || list[0])?.id || ''))
    })
    inputRef.current?.focus()
  }, [user, refreshNumero])

  const total = itens.reduce((s, i) => s + Number(i.subtotal), 0)

  const appendProduto = useCallback((p, qtdExtra) => {
    const qtd = qtdExtra ?? defaultQty(p.unidade)
    const preco = Number(p.preco_venda)
    const estoque = Number(p.estoque_atual)
    if (estoque <= 0) {
      setMsg(`Sem estoque para ${p.nome}.`)
      return false
    }
    setItens((prev) => {
      const idx = prev.findIndex((i) => i.produto_id === p.id)
      if (idx >= 0) {
        const next = [...prev]
        const novaQtd = Number(next[idx].quantidade) + Number(qtd)
        if (novaQtd > estoque + 1e-9) {
          setMsg(`Estoque insuficiente para ${p.nome} (disp. ${formatQty(estoque, p.unidade)}).`)
          return prev
        }
        next[idx] = {
          ...next[idx],
          quantidade: novaQtd,
          subtotal: calcSubtotal(novaQtd, preco),
        }
        return next
      }
      if (qtd > estoque + 1e-9) {
        setMsg(`Estoque insuficiente para ${p.nome} (disp. ${formatQty(estoque, p.unidade)}).`)
        return prev
      }
      return [
        ...prev,
        {
          produto_id: p.id,
          nome: p.nome,
          unidade: p.unidade,
          estoque_atual: estoque,
          quantidade: qtd,
          preco_unitario: preco,
          subtotal: calcSubtotal(qtd, preco),
        },
      ]
    })
    setBarcode('')
    setShowPicker(false)
    setMsg('')
    return true
  }, [])

  const addProduto = useCallback(
    async (termo) => {
      const q = termo.trim()
      if (!q) return
      try {
        const { data: p } = await api.get(`/produtos/por-codigo/${encodeURIComponent(q)}/`)
        appendProduto(p)
        return
      } catch {
        /* tenta catálogo local */
      }
      const term = q.toLowerCase()
      const local = catalogo.filter(
        (p) =>
          p.codigo_barras?.includes(q) ||
          p.nome.toLowerCase().includes(term) ||
          p.codigo_barras === q,
      )
      if (local.length === 1) {
        appendProduto(local[0])
        return
      }
      if (local.length > 1) {
        setShowPicker(true)
        setBarcode(q)
        setMsg('Vários produtos encontrados — escolha na lista.')
        return
      }
      setMsg('Produto não encontrado. Use o código de barras ou busque pelo nome.')
    },
    [appendProduto, catalogo],
  )

  const sugestoes = useMemo(() => {
    const q = barcode.trim().toLowerCase()
    if (!q) return catalogo.slice(0, 12)
    return catalogo.filter(
      (p) => p.nome.toLowerCase().includes(q) || (p.codigo_barras && p.codigo_barras.includes(barcode.trim())),
    )
  }, [barcode, catalogo])

  const updateQty = (idx, delta) => {
    setItens((prev) => {
      const next = [...prev]
      const item = { ...next[idx] }
      const step = item.unidade === 'PESO' ? 0.1 : 1
      const nova = Math.max(0, Number(item.quantidade) + delta * step)
      if (nova <= 0) return prev.filter((_, i) => i !== idx)
      if (nova > Number(item.estoque_atual) + 1e-9) {
        setMsg(`Estoque máximo: ${formatQty(item.estoque_atual, item.unidade)}`)
        return prev
      }
      item.quantidade = item.unidade === 'PESO' ? Number(nova.toFixed(3)) : nova
      item.subtotal = calcSubtotal(item.quantidade, item.preco_unitario)
      next[idx] = item
      setMsg('')
      return next
    })
  }

  const setQtyInput = (idx, raw) => {
    const n = parseDecimal(raw)
    if (n == null || n <= 0) return
    setItens((prev) => {
      const next = [...prev]
      const item = { ...next[idx] }
      if (n > Number(item.estoque_atual) + 1e-9) {
        setMsg(`Estoque máximo: ${formatQty(item.estoque_atual, item.unidade)}`)
        return prev
      }
      item.quantidade = item.unidade === 'PESO' ? Number(n.toFixed(3)) : n
      item.subtotal = calcSubtotal(item.quantidade, item.preco_unitario)
      next[idx] = item
      setMsg('')
      return next
    })
  }

  const removeItem = async (idx) => {
    const item = itens[idx]
    if (!item) return
    const ok = await confirm({
      title: 'Remover item?',
      message: `Remover "${item.nome}" da venda atual?`,
      confirmLabel: 'Remover',
      variant: 'danger',
    })
    if (ok) setItens((prev) => prev.filter((_, i) => i !== idx))
  }

  const resetVenda = () => {
    setItens([])
    setPagamento('PIX')
    setClienteId('')
    setConcluida(null)
    setMsg('')
    refreshNumero()
    inputRef.current?.focus()
  }

  const cancelar = async () => {
    if (itens.length) {
      const ok = await confirm({
        title: 'Cancelar venda?',
        message: 'Todos os itens desta venda serão descartados.',
        confirmLabel: 'Descartar',
        variant: 'danger',
      })
      if (!ok) return
    }
    resetVenda()
    navigate('/')
  }

  const confirmFinalizar = async () => {
    const ok = await confirm({
      title: 'Finalizar venda?',
      message: `${itens.length} item(ns) · total ${formatMoney(total)} · pagamento ${pagamento}.`,
      confirmLabel: 'Finalizar',
    })
    if (ok) await finalizar()
  }

  const finalizar = async () => {
    if (!itens.length) {
      setMsg('Adicione pelo menos um produto.')
      return
    }
    if (!funcionarioId) {
      setMsg('Selecione o funcionário responsável.')
      return
    }
    if (pagamento === 'FIADO' && !clienteId) {
      setMsg('Selecione um cliente para venda fiado.')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      const { data } = await api.post('/vendas/', {
        itens: itens.map((i) => ({
          produto_id: i.produto_id,
          quantidade: i.quantidade,
          preco_unitario: i.preco_unitario,
        })),
        forma_pagamento: pagamento,
        cliente_id: pagamento === 'FIADO' ? Number(clienteId) : null,
        funcionario_id: Number(funcionarioId),
      })
      setConcluida({ id: data.id, numero: data.numero, total: data.total })
      setNumeroVenda(data.numero)
      setItens([])
      api.get('/produtos/', { params: { pdv: 1 } }).then((r) => setCatalogo(extractList(r.data)))
    } catch (e) {
      setMsg(getApiError(e, 'Erro ao finalizar venda.'))
    } finally {
      setLoading(false)
    }
  }

  const emitirNota = async () => {
    const id = concluida?.id
    if (!id) {
      setMsg('Finalize a venda antes de emitir a nota.')
      return
    }
    const ok = await confirm({
      title: 'Emitir nota fiscal?',
      message: `Registrar nota para a venda #${concluida.numero}?`,
      confirmLabel: 'Emitir',
    })
    if (!ok) return
    try {
      await api.post(`/vendas/${id}/emitir_nota/`)
      setMsg('Nota registrada no sistema.')
      setConcluida((c) => (c ? { ...c, nota: true } : c))
    } catch (e) {
      setMsg(getApiError(e))
    }
  }

  if (concluida) {
    return (
      <div className="pf-card" style={{ padding: '32px 20px', maxWidth: 520, margin: '24px auto', textAlign: 'center', width: '100%' }}>
        <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: 16 }} />
        <h1 className="pf-h1">Venda #{concluida.numero} registrada</h1>
        <p className="mono" style={{ fontSize: 28, margin: '16px 0 24px' }}>{formatMoney(concluida.total)}</p>
        {msg && <p style={{ color: concluida.nota ? 'var(--success)' : 'var(--danger)', marginBottom: 16 }}>{msg}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button type="button" className="pf-btn pf-btn-accent pf-btn-lg" style={{ justifyContent: 'center' }} onClick={resetVenda}>
            Nova venda
          </button>
          <button type="button" className="pf-btn pf-btn-ghost" style={{ justifyContent: 'center' }} onClick={emitirNota} disabled={concluida.nota}>
            <Receipt size={16} /> {concluida.nota ? 'Nota emitida' : 'Emitir nota'}
          </button>
          <button type="button" className="pf-btn pf-btn-ghost" style={{ justifyContent: 'center' }} onClick={() => navigate('/')}>
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`pdv-page${itens.length ? ' pdv-has-items' : ''}`}>
      <div className="page-header">
        <div>
          <h1 className="pf-h1">Venda #{numeroVenda ?? '…'}</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>
            {itens.length} itens · {user?.nome || 'Atendente'}
          </p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="pf-btn pf-btn-ghost" onClick={cancelar} aria-label="Cancelar venda">
            <X size={16} /> <span className="pdv-cancel-label">Cancelar venda</span>
          </button>
        </div>
      </div>

      <div className="pdv-layout">
        <div className="pf-card pdv-card pdv-main">
          <div className="pdv-toolbar">
            <div className="pdv-toolbar-input">
              <Barcode size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                ref={inputRef}
                className="pf-input pf-input-lg"
                style={{ paddingLeft: 40, width: '100%' }}
                placeholder="Código de barras ou nome do produto..."
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value)
                  setShowPicker(true)
                }}
                onFocus={() => setShowPicker(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addProduto(barcode)
                  }
                }}
              />
            </div>
            <div className="pdv-toolbar-actions">
              <button type="button" className="pf-btn pf-btn-ghost" onClick={() => addProduto(barcode)}>
                <Search size={16} /> Buscar
              </button>
              <button type="button" className="pf-btn pf-btn-ghost" onClick={() => setShowPicker((v) => !v)} title="Ver catálogo">
                <Plus size={16} /> Catálogo
              </button>
            </div>
          </div>

          {showPicker && sugestoes.length > 0 && (
            <div className="pf-card pdv-picker">
              {sugestoes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="pdv-picker-item"
                  onClick={() => appendProduto(p)}
                >
                  <span className="pdv-picker-item-info">
                    <strong>{p.nome}</strong>
                    <span className="pdv-picker-item-meta">
                      {p.codigo_barras} · est. {formatQty(p.estoque_atual, p.unidade)}
                    </span>
                  </span>
                  <span className="mono pdv-picker-item-price">
                    {formatMoney(p.preco_venda)}{p.unidade === 'PESO' ? '/kg' : ''}
                  </span>
                </button>
              ))}
            </div>
          )}

          {msg && <p style={{ color: 'var(--danger)', fontSize: 14, marginBottom: 12 }}>{msg}</p>}

          {!itens.length ? (
            <p style={{ color: 'var(--muted)', padding: '24px 0', textAlign: 'center' }}>
              Escaneie o código, digite o nome ou escolha no catálogo.
            </p>
          ) : (
            <>
              <div className="pdv-items-mobile">
                {itens.map((item, idx) => (
                  <div className="pdv-item-row" key={`${item.produto_id}-${idx}`}>
                    <div className="pdv-item-row-top">
                      <span className="pdv-item-name">{item.nome}</span>
                      <span className="pdv-item-total mono">{formatMoney(item.subtotal)}</span>
                    </div>
                    <div className="pdv-item-row-bottom">
                      <span className="pdv-item-meta mono">
                        {formatQty(item.quantidade, item.unidade)} × {formatMoney(item.preco_unitario)}
                        {item.unidade === 'PESO' ? '/kg' : ''}
                      </span>
                      <div className="pdv-item-actions">
                        <PdvQtyControls item={item} idx={idx} updateQty={updateQty} setQtyInput={setQtyInput} />
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          aria-label={`Remover ${item.nome}`}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pdv-items-desktop table-scroll">
                <table className="pf-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Produto</th>
                      <th>Qtd</th>
                      <th>Unitário</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((item, idx) => (
                      <tr key={`${item.produto_id}-${idx}`}>
                        <td>{idx + 1}</td>
                        <td>{item.nome}</td>
                        <td>
                          <PdvQtyControls item={item} idx={idx} updateQty={updateQty} setQtyInput={setQtyInput} />
                        </td>
                        <td className="mono">
                          {formatMoney(item.preco_unitario)}
                          {item.unidade === 'PESO' ? ' / kg' : ''}
                        </td>
                        <td className="mono">{formatMoney(item.subtotal)}</td>
                        <td>
                          <button type="button" onClick={() => removeItem(idx)} aria-label={`Remover ${item.nome}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="pf-card pdv-card pdv-sidebar">
          <h2 className="pf-h2" style={{ marginBottom: 16 }}>Total da venda</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 }}>
            <span>Itens ({itens.length})</span>
            <span className="mono">{formatMoney(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: 'var(--muted)' }}>
            <span>Desconto</span>
            <span className="mono">- 0,00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 22, fontWeight: 500 }}>
            <span>Total</span>
            <span className="mono">{formatMoney(total)}</span>
          </div>

          <p className="pf-label" style={{ marginBottom: 8 }}>Forma de pagamento</p>
          <div className="payment-grid" style={{ marginBottom: 12 }}>
            {PAYMENTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`payment-btn${pagamento === p.id ? ' active' : ''}`}
                onClick={() => setPagamento(p.id)}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              className={`payment-btn fiado${pagamento === 'FIADO' ? ' active' : ''}`}
              onClick={() => setPagamento('FIADO')}
            >
              Fiado
            </button>
          </div>

          {pagamento === 'FIADO' && (
            <select className="pf-select" style={{ marginBottom: 12 }} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              <option value="">Selecione o cliente</option>
              {clientes.filter((c) => c.pode_salvar_fiado !== false && !c.negativado).map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          )}

          <label className="pf-label">Funcionário responsável</label>
          <select
            className="pf-select"
            value={funcionarioId}
            onChange={(e) => setFuncionarioId(e.target.value)}
            style={{ marginBottom: 16 }}
            required
          >
            {funcionarios.length === 0 && <option value="">Nenhum funcionário</option>}
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>{f.nome} · {f.cargo_label || f.cargo}</option>
            ))}
          </select>

          <p style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 8, marginBottom: 16 }}>
            <Shield size={16} /> Pagamento integral obrigatório — sem parcelamento.
          </p>

          <button
            type="button"
            className="pf-btn pf-btn-accent pf-btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={confirmFinalizar}
            disabled={loading || !itens.length || !funcionarioId}
            data-pf-save
          >
            {loading ? 'Salvando…' : <>Finalizar venda <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  )
}

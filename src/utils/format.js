/** Converte "0,75" ou "1.234,56" para número (API Django). */
export function parseDecimal(value) {
  if (value === '' || value == null) return null
  if (typeof value === 'number') return value
  const s = String(value).trim().replace(/\s/g, '')
  if (!s) return null
  const normalized = s.includes(',')
    ? s.replace(/\./g, '').replace(',', '.')
    : s
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

export function formatMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return 'R$ 0,00'
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
}

export function formatQty(qty, unidade) {
  const n = Number(qty)
  if (unidade === 'PESO') return `${n.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`
  return `${n} un`
}

export function greetingName(name) {
  const h = new Date().getHours()
  const g = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const first = name?.split(' ')[0] || ''
  return `${g}, ${first}.`
}

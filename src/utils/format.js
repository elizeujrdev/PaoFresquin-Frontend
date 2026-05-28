import { formatDate, formatDateTime, hourInBrazil } from './datetime'

export {
  formatDate,
  formatDateLong,
  formatDateTime,
  formatIsoDateBr,
  formatTime,
  todayIsoInBrazil,
} from './datetime'

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

export function formatQty(qty, unidade) {
  const n = Number(qty)
  if (unidade === 'PESO') return `${n.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`
  return `${n} un`
}

export function greetingName(name) {
  const h = hourInBrazil()
  const g = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const first = name?.split(' ')[0] || ''
  return `${g}, ${first}.`
}

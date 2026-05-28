/** Fuso horário oficial da aplicação (Brasil). */
export const TZ_BR = 'America/Sao_Paulo'

const fmtDate = {
  timeZone: TZ_BR,
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
}

const fmtDateLong = {
  timeZone: TZ_BR,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}

const fmtDateTime = {
  timeZone: TZ_BR,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Hoje no Brasil como YYYY-MM-DD (inputs type="date"). */
export function todayIsoInBrazil() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ_BR }).format(new Date())
}

export function hourInBrazil() {
  return Number(
    new Intl.DateTimeFormat('pt-BR', {
      timeZone: TZ_BR,
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
  )
}

/** ISO YYYY-MM-DD → DD/MM/YYYY (sem conversão de fuso). */
export function formatIsoDateBr(iso) {
  if (!iso) return ''
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  return formatDate(iso)
}

export function formatDate(value) {
  const d = toDate(value)
  if (!d) return ''
  return d.toLocaleDateString('pt-BR', fmtDate)
}

export function formatDateLong(value) {
  const d = toDate(value)
  if (!d) return ''
  return d.toLocaleDateString('pt-BR', fmtDateLong)
}

export function formatDateTime(value) {
  const d = toDate(value)
  if (!d) return ''
  return d.toLocaleString('pt-BR', fmtDateTime)
}

export function formatTime(value) {
  const d = toDate(value)
  if (!d) return ''
  return d.toLocaleTimeString('pt-BR', { timeZone: TZ_BR, hour: '2-digit', minute: '2-digit' })
}

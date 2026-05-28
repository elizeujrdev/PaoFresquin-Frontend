/** Escapa célula para CSV (separador ; — padrão Excel pt-BR). */
export function escapeCsvCell(value) {
  const s = String(value ?? '')
  if (/[",;\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

/** Baixa um arquivo CSV a partir de linhas (array de arrays). */
export function downloadCsv(filename, rows) {
  const bom = '\uFEFF'
  const body = rows.map((row) => row.map(escapeCsvCell).join(';')).join('\r\n')
  const blob = new Blob([bom + body], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** Data/hora para nome de arquivo: 2026-05-22_14-30 */
export function fileTimestamp() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}_${get('hour')}-${get('minute')}`
}

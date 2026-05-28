/** Resposta DRF: lista direta ou paginada. */
export function extractList(data) {
  if (Array.isArray(data)) return data
  if (data?.results) return data.results
  return []
}

/** Mensagem legível a partir de erro Axios/DRF. */
export function getApiError(error, fallback = 'Não foi possível concluir a operação.') {
  const d = error?.response?.data
  if (!d) return error?.message || fallback
  if (typeof d === 'string') return d
  if (d.detail) return String(d.detail)
  if (d.non_field_errors?.[0]) return d.non_field_errors[0]
  const first = Object.entries(d).find(([, v]) => v != null)
  if (first) {
    const [, val] = first
    return Array.isArray(val) ? val[0] : String(val)
  }
  return fallback
}

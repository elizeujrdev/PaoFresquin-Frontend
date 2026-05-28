import { useCallback, useEffect } from 'react'

/** Recarrega dados da API ao montar e ao voltar para a aba. */
export function useReloadOnFocus(loadFn) {
  const load = useCallback(() => {
    loadFn()
  }, [loadFn])

  useEffect(() => {
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])
}

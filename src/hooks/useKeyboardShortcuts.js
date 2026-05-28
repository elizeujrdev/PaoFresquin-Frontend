import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccessibility } from '../context/AccessibilityContext'

const ROUTES = ['/', '/pdv', '/clientes', '/funcionarios', '/produtos', '/relatorios', '/cameras']

function isTypingTarget(el) {
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

export default function useKeyboardShortcuts({ enabled = true } = {}) {
  const navigate = useNavigate()
  const { setPanelOpen, setShortcutsOpen } = useAccessibility()

  useEffect(() => {
    if (!enabled) return undefined

    const onKeyDown = (e) => {
      if (isTypingTarget(e.target)) return

      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setShortcutsOpen(true)
        return
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key
        if (key === 'a' || key === 'A') {
          e.preventDefault()
          setPanelOpen(true)
          return
        }
        const num = parseInt(key, 10)
        if (num >= 1 && num <= 7) {
          e.preventDefault()
          navigate(ROUTES[num - 1])
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        const saveBtn = document.querySelector('[data-pf-save]')
        if (saveBtn && !saveBtn.disabled) {
          e.preventDefault()
          saveBtn.click()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, navigate, setPanelOpen, setShortcutsOpen])
}

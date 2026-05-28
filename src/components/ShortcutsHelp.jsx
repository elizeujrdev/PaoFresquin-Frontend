import { useEffect, useRef } from 'react'
import { Keyboard, X } from 'lucide-react'
import { useAccessibility } from '../context/AccessibilityContext'

const SHORTCUTS = [
  { keys: ['Alt', '1'], desc: 'Ir para Início' },
  { keys: ['Alt', '2'], desc: 'Abrir PDV (vendas)' },
  { keys: ['Alt', '3'], desc: 'Clientes' },
  { keys: ['Alt', '4'], desc: 'Funcionários' },
  { keys: ['Alt', '5'], desc: 'Produtos' },
  { keys: ['Alt', '6'], desc: 'Relatórios' },
  { keys: ['Alt', '7'], desc: 'Câmeras' },
  { keys: ['Alt', 'A'], desc: 'Painel de acessibilidade' },
  { keys: ['?'], desc: 'Esta lista de atalhos' },
  { keys: ['Ctrl', 'S'], desc: 'Salvar (em formulários)' },
  { keys: ['Esc'], desc: 'Fechar painéis e diálogos' },
]

export default function ShortcutsHelp() {
  const { shortcutsOpen, setShortcutsOpen } = useAccessibility()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!shortcutsOpen) return undefined
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setShortcutsOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [shortcutsOpen, setShortcutsOpen])

  if (!shortcutsOpen) return null

  return (
    <div className="pf-overlay" role="presentation" onClick={() => setShortcutsOpen(false)}>
      <div
        className="pf-modal pf-shortcuts-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-shortcuts-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pf-modal-header">
          <h2 id="pf-shortcuts-title" className="pf-h2" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Keyboard size={22} aria-hidden="true" />
            Atalhos de teclado
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="pf-btn pf-btn-ghost"
            onClick={() => setShortcutsOpen(false)}
            aria-label="Fechar lista de atalhos"
          >
            <X size={18} />
          </button>
        </div>
        <p className="pf-a11y-intro">Atalhos não funcionam enquanto você digita em um campo de texto.</p>
        <table className="pf-shortcuts-table">
          <caption className="sr-only">Atalhos disponíveis no sistema</caption>
          <tbody>
            {SHORTCUTS.map(({ keys, desc }) => (
              <tr key={desc}>
                <th scope="row">
                  <span className="pf-kbd-group">
                    {keys.map((k) => <kbd key={k} className="pf-kbd">{k}</kbd>)}
                  </span>
                </th>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pf-modal-actions">
          <button type="button" className="pf-btn pf-btn-accent" onClick={() => setShortcutsOpen(false)}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  )
}

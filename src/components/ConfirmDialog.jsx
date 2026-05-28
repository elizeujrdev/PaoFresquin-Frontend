import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'accent',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement
    cancelRef.current?.focus()

    const trap = (e) => {
      if (e.key !== 'Tab' || !dialogRef.current) return
      const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter(
        (el) => !el.disabled && el.offsetParent !== null,
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', trap)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', trap)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, onCancel])

  if (!open) return null

  const confirmClass = variant === 'danger' ? 'pf-btn-danger' : 'pf-btn-accent'

  return (
    <div className="pf-overlay" role="presentation" onClick={onCancel}>
      <div
        ref={dialogRef}
        className={`pf-modal pf-confirm-dialog${variant === 'danger' ? ' danger' : ''}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="pf-confirm-title"
        aria-describedby="pf-confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pf-confirm-icon" aria-hidden="true">
          <AlertTriangle size={22} />
        </div>
        <h2 id="pf-confirm-title" className="pf-h2 pf-confirm-title">{title}</h2>
        <p id="pf-confirm-desc" className="pf-confirm-message">{message}</p>
        <div className="pf-modal-actions">
          <button ref={cancelRef} type="button" className="pf-btn pf-btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`pf-btn ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

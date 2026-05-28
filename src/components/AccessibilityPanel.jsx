import { useEffect, useRef } from 'react'
import { Accessibility, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { COLOR_BLIND_MODES, useAccessibility } from '../context/AccessibilityContext'

const FONT_STEPS = [85, 100, 115, 130]
const COLOR_BLIND_KEYS = Object.keys(COLOR_BLIND_MODES)

export default function AccessibilityPanel() {
  const { settings, update, reset, panelOpen, setPanelOpen } = useAccessibility()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!panelOpen) return undefined
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') setPanelOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [panelOpen, setPanelOpen])

  if (!panelOpen) return null

  const stepFont = (delta) => {
    const idx = FONT_STEPS.indexOf(settings.fontScale)
    const next = FONT_STEPS[Math.min(FONT_STEPS.length - 1, Math.max(0, idx + delta))]
    update({ fontScale: next })
  }

  return (
    <div className="pf-overlay" role="presentation" onClick={() => setPanelOpen(false)}>
      <div
        className="pf-modal pf-a11y-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-a11y-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pf-modal-header">
          <h2 id="pf-a11y-title" className="pf-h2" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Accessibility size={22} aria-hidden="true" />
            Acessibilidade
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="pf-btn pf-btn-ghost"
            onClick={() => setPanelOpen(false)}
            aria-label="Fechar painel de acessibilidade"
          >
            <X size={18} />
          </button>
        </div>

        <p className="pf-a11y-intro">
          Ajustes salvos neste navegador. Use <kbd>Alt</kbd>+<kbd>A</kbd> para abrir este painel a qualquer momento.
        </p>

        <section className="pf-a11y-section" aria-labelledby="pf-a11y-font">
          <h3 id="pf-a11y-font" className="pf-a11y-label">Tamanho da fonte</h3>
          <div className="pf-a11y-font-control">
            <button type="button" className="pf-btn pf-btn-ghost" onClick={() => stepFont(-1)} disabled={settings.fontScale === FONT_STEPS[0]} aria-label="Diminuir fonte">
              <Minus size={18} />
            </button>
            <span className="pf-a11y-font-value" aria-live="polite">{settings.fontScale}%</span>
            <button type="button" className="pf-btn pf-btn-ghost" onClick={() => stepFont(1)} disabled={settings.fontScale === FONT_STEPS[FONT_STEPS.length - 1]} aria-label="Aumentar fonte">
              <Plus size={18} />
            </button>
          </div>
          <div className="pf-a11y-font-steps" role="group" aria-label="Níveis de fonte">
            {FONT_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                className={`pf-a11y-step${settings.fontScale === step ? ' active' : ''}`}
                onClick={() => update({ fontScale: step })}
                aria-pressed={settings.fontScale === step}
              >
                {step}%
              </button>
            ))}
          </div>
        </section>

        <section className="pf-a11y-section" aria-labelledby="pf-a11y-colorblind">
          <h3 id="pf-a11y-colorblind" className="pf-a11y-label">Daltonismo (cores)</h3>
          <p className="pf-a11y-hint">
            Troca vermelho/verde (ou azul/amarelo) por combinações distinguíveis e adiciona símbolos nos status.
          </p>
          <div className="pf-a11y-cb-options" role="radiogroup" aria-labelledby="pf-a11y-colorblind">
            {COLOR_BLIND_KEYS.map((mode) => (
              <label key={mode} className={`pf-a11y-cb-option${settings.colorBlindMode === mode ? ' active' : ''}`}>
                <input
                  type="radio"
                  name="colorBlindMode"
                  value={mode}
                  checked={settings.colorBlindMode === mode}
                  onChange={() => update({ colorBlindMode: mode })}
                />
                <span>{COLOR_BLIND_MODES[mode]}</span>
              </label>
            ))}
          </div>
          {settings.colorBlindMode !== 'off' && (
            <div className="pf-a11y-cb-preview" aria-label="Pré-visualização das cores de status">
              <span className="pf-pill danger">Alerta</span>
              <span className="pf-pill success">OK</span>
              <span className="pf-pill accent">Destaque</span>
            </div>
          )}
        </section>

        <section className="pf-a11y-section" aria-labelledby="pf-a11y-display">
          <h3 id="pf-a11y-display" className="pf-a11y-label">Exibição</h3>
          <label className="pf-a11y-toggle">
            <input type="checkbox" checked={settings.highContrast} onChange={(e) => update({ highContrast: e.target.checked })} />
            <span>Alto contraste</span>
          </label>
          <label className="pf-a11y-toggle">
            <input type="checkbox" checked={settings.reducedMotion} onChange={(e) => update({ reducedMotion: e.target.checked })} />
            <span>Reduzir animações</span>
          </label>
          <label className="pf-a11y-toggle">
            <input type="checkbox" checked={settings.largeTargets} onChange={(e) => update({ largeTargets: e.target.checked })} />
            <span>Botões e toques maiores</span>
          </label>
        </section>

        <div className="pf-modal-actions" style={{ marginTop: 8 }}>
          <button type="button" className="pf-btn pf-btn-ghost" onClick={reset}>
            <RotateCcw size={16} /> Restaurar padrão
          </button>
          <button type="button" className="pf-btn pf-btn-accent" onClick={() => setPanelOpen(false)}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

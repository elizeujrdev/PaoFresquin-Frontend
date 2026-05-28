import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'pf_a11y'

/** off | deuteranopia | protanopia | tritanopia */
export const COLOR_BLIND_MODES = {
  off: 'Padrão (sem ajuste)',
  deuteranopia: 'Vermelho–verde (deuteranopia)',
  protanopia: 'Vermelho–verde (protanopia)',
  tritanopia: 'Azul–amarelo (tritanopia)',
}

const DEFAULTS = {
  fontScale: 100,
  highContrast: false,
  reducedMotion: false,
  largeTargets: false,
  colorBlindMode: 'off',
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

function applySettingsToDom(settings) {
  const root = document.documentElement
  const scale = settings.fontScale / 100
  root.dataset.fontScale = String(settings.fontScale)
  root.style.setProperty('--pf-font-scale', String(scale))
  root.toggleAttribute('data-high-contrast', settings.highContrast)
  root.toggleAttribute('data-reduced-motion', settings.reducedMotion)
  root.toggleAttribute('data-large-targets', settings.largeTargets)
  if (settings.colorBlindMode && settings.colorBlindMode !== 'off') {
    root.dataset.colorBlind = settings.colorBlindMode
  } else {
    delete root.dataset.colorBlind
  }
}

const AccessibilityContext = createContext(null)

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const initial = loadSettings()
    applySettingsToDom(initial)
    return initial
  })
  const [panelOpen, setPanelOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useLayoutEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applySettingsToDom(settings)
  }, [settings])

  const update = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }))
  }, [])

  const reset = useCallback(() => setSettings({ ...DEFAULTS }), [])

  const value = useMemo(() => ({
    settings,
    update,
    reset,
    panelOpen,
    setPanelOpen,
    shortcutsOpen,
    setShortcutsOpen,
  }), [settings, update, reset, panelOpen, shortcutsOpen])

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)
  if (!ctx) throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider')
  return ctx
}

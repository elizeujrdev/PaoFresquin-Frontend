import { Outlet } from 'react-router-dom'
import { Accessibility } from 'lucide-react'
import TopBar from './TopBar'
import MobileNav from './MobileNav'
import Wordmark from './Wordmark'
import UserMenu from './UserMenu'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { useAccessibility } from '../context/AccessibilityContext'

export default function Layout() {
  const { setPanelOpen } = useAccessibility()
  useKeyboardShortcuts()

  return (
    <div className="app-layout pf">
      <a href="#conteudo-principal" className="pf-skip-link">
        Pular para o conteúdo principal
      </a>
      <header className="pf-mobile-header mobile-only">
        <Wordmark />
        <div className="page-header-actions" style={{ margin: 0 }}>
          <button
            type="button"
            className="pf-btn pf-btn-ghost"
            style={{ padding: '8px 10px' }}
            onClick={() => setPanelOpen(true)}
            aria-label="Abrir configurações de acessibilidade"
          >
            <Accessibility size={20} strokeWidth={1.5} />
          </button>
          <UserMenu />
        </div>
      </header>
      <TopBar />
      <main id="conteudo-principal" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <MobileNav />
      <button
        type="button"
        className="pf-a11y-fab desktop-only"
        onClick={() => setPanelOpen(true)}
        aria-label="Abrir configurações de acessibilidade"
        title="Acessibilidade (Alt+A)"
      >
        <Accessibility size={22} strokeWidth={1.5} />
      </button>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { Accessibility, Keyboard, LogOut } from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import { useAccessibility } from '../context/AccessibilityContext'



export default function UserMenu() {

  const { user, logout } = useAuth()

  const { setPanelOpen, setShortcutsOpen } = useAccessibility()

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const ref = useRef(null)

  const iniciais = user?.iniciais || 'AM'



  useEffect(() => {

    if (!open) return

    const close = (e) => {

      if (ref.current && !ref.current.contains(e.target)) setOpen(false)

    }

    const onKey = (e) => {

      if (e.key === 'Escape') setOpen(false)

    }

    document.addEventListener('mousedown', close)

    document.addEventListener('keydown', onKey)

    return () => {

      document.removeEventListener('mousedown', close)

      document.removeEventListener('keydown', onKey)

    }

  }, [open])



  const handleLogout = async () => {

    setOpen(false)

    logout()

    navigate('/login', { replace: true })

  }



  return (

    <div className="pf-user-menu" ref={ref}>

      <button

        type="button"

        className="pf-topbar-avatar pf-user-menu-trigger"

        onClick={() => setOpen((v) => !v)}

        aria-expanded={open}

        aria-haspopup="menu"

        aria-label="Menu da conta"

      >

        {iniciais}

      </button>

      {open && (

        <div className="pf-user-menu-dropdown" role="menu">

          <div className="pf-user-menu-info">

            <strong>{user?.nome || 'Usuário'}</strong>

            <span>{user?.loja || 'Loja Centro'}</span>

          </div>

          <button

            type="button"

            className="pf-user-menu-item"

            role="menuitem"

            onClick={() => { setOpen(false); setPanelOpen(true) }}

          >

            <Accessibility size={16} strokeWidth={1.5} />

            Acessibilidade

          </button>

          <button

            type="button"

            className="pf-user-menu-item"

            role="menuitem"

            onClick={() => { setOpen(false); setShortcutsOpen(true) }}

          >

            <Keyboard size={16} strokeWidth={1.5} />

            Atalhos de teclado

          </button>

          <button type="button" className="pf-user-menu-item" role="menuitem" onClick={handleLogout}>

            <LogOut size={16} strokeWidth={1.5} />

            Sair

          </button>

        </div>

      )}

    </div>

  )

}


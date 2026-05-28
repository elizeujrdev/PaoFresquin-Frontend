import { NavLink } from 'react-router-dom'
import {
  Home, ShoppingCart, Users, Briefcase, Package, LineChart, Camera,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/format'
import Wordmark from './Wordmark'
import UserMenu from './UserMenu'

const NAV = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/pdv', label: 'Registrar Venda', icon: ShoppingCart },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/funcionarios', label: 'Funcionários', icon: Briefcase },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/relatorios', label: 'Relatórios', icon: LineChart },
  { to: '/cameras', label: 'Câmeras', icon: Camera },
]

export default function TopBar() {
  const { user } = useAuth()

  return (
    <header className="pf-topbar desktop-only">
      <div className="pf-topbar-row pf-topbar-row--main">
        <Wordmark />
        <div className="pf-spacer" />
        <div className="pf-topbar-user">
          <span className="pf-topbar-user-meta">
            {user?.loja || 'Loja Centro'} · <span className="mono">{formatDate(new Date())}</span>
          </span>
          <UserMenu />
        </div>
      </div>

      <div className="pf-topbar-row pf-topbar-row--nav">
        <nav className="pf-nav" aria-label="Menu principal" role="navigation">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `pf-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

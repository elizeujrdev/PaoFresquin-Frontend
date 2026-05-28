import { NavLink } from 'react-router-dom'
import { Home, ShoppingCart, Users, Camera } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/pdv', label: 'Venda', icon: ShoppingCart },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/cameras', label: 'Câmeras', icon: Camera },
]

export default function MobileNav() {
  return (
    <nav className="mobile-nav-bar mobile-only">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `mobile-nav-btn${isActive ? ' active' : ''}`}>
          <Icon size={22} strokeWidth={1.5} />
          <span>{label}</span>
          <span className="nav-dot" />
        </NavLink>
      ))}
    </nav>
  )
}

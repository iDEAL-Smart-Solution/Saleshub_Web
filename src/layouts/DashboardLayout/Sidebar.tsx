import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, UserSquare2,
  ShoppingCart, Target, BarChart2, DollarSign,
  Bell, User, ChevronRight, X, ShieldCheck, Briefcase,
} from 'lucide-react'
import logo from '@/assets/LOGO.png'
import { ROLES, type Role } from '@/constants/roles'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  // ── Dashboard (role-specific, resolved dynamically) ──────────────────────
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    to: 'ROLE_HOME',
    roles: [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.DISTRIBUTOR, ROLES.MARKETER],
  },

  // ── Dev ──────────────────────────────────────────────────────────────────
  { label: 'Admins',    icon: <ShieldCheck size={18} />,  to: '/dev/admins',        roles: [ROLES.DEV] },

  // ── Admin / Dev ──────────────────────────────────────────────────────────
  { label: 'Users',     icon: <Users size={18} />,        to: '/admin/users',       roles: [ROLES.DEV, ROLES.ADMIN] },
  { label: 'Products',  icon: <Package size={18} />,      to: '/admin/products',    roles: [ROLES.DEV, ROLES.ADMIN] },
  { label: 'Customers', icon: <UserSquare2 size={18} />,  to: '/admin/customers',   roles: [ROLES.DEV, ROLES.ADMIN] },
  { label: 'Sales',     icon: <ShoppingCart size={18} />, to: '/admin/sales',       roles: [ROLES.DEV, ROLES.ADMIN] },
  { label: 'KPI',       icon: <Target size={18} />,       to: '/admin/kpi',         roles: [ROLES.DEV, ROLES.ADMIN] },
  { label: 'Performance', icon: <BarChart2 size={18} />,  to: '/marketing-lead/performance', roles: [ROLES.DEV, ROLES.ADMIN] },
  { label: 'Commissions', icon: <DollarSign size={18} />, to: '/admin/commissions', roles: [ROLES.DEV, ROLES.ADMIN] },

  // ── Marketing Lead ────────────────────────────────────────────────────────
  { label: 'Marketers',    icon: <Users size={18} />,        to: '/marketing-lead/marketers',   roles: [ROLES.MARKETING_LEAD] },
  { label: 'Customers',    icon: <UserSquare2 size={18} />,  to: '/marketing-lead/customers',   roles: [ROLES.MARKETING_LEAD] },
  { label: 'Sales',        icon: <ShoppingCart size={18} />, to: '/marketing-lead/sales',       roles: [ROLES.MARKETING_LEAD] },
  { label: 'Performance',  icon: <BarChart2 size={18} />,    to: '/marketing-lead/performance', roles: [ROLES.MARKETING_LEAD] },
  { label: 'Commissions',  icon: <DollarSign size={18} />,   to: '/marketing-lead/commissions', roles: [ROLES.MARKETING_LEAD] },

  // ── Distributor ───────────────────────────────────────────────────────────
  { label: 'My Marketers', icon: <Users size={18} />,        to: '/distributor/marketers',   roles: [ROLES.DISTRIBUTOR] },
  { label: 'Team Sales',   icon: <ShoppingCart size={18} />, to: '/distributor/sales',       roles: [ROLES.DISTRIBUTOR] },
  { label: 'Commissions',  icon: <DollarSign size={18} />,   to: '/distributor/commissions', roles: [ROLES.DISTRIBUTOR] },

  // ── Marketer ──────────────────────────────────────────────────────────────
  { label: 'My Sales',        icon: <ShoppingCart size={18} />, to: '/marketer/sales',        roles: [ROLES.MARKETER] },
  { label: 'My KPI',          icon: <Target size={18} />,       to: '/marketer/kpi',          roles: [ROLES.MARKETER] },
  { label: 'My Performance',  icon: <BarChart2 size={18} />,    to: '/marketer/performance',  roles: [ROLES.MARKETER] },
  { label: 'My Commissions',  icon: <DollarSign size={18} />,   to: '/marketer/commissions',  roles: [ROLES.MARKETER] },

  // ── Shared ────────────────────────────────────────────────────────────────
  {
    label: 'Notifications',
    icon: <Bell size={18} />,
    to: '/notifications',
    roles: [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.DISTRIBUTOR, ROLES.MARKETER],
  },
  {
    label: 'Profile',
    icon: <User size={18} />,
    to: '/profile',
    roles: [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD, ROLES.DISTRIBUTOR, ROLES.MARKETER],
  },
]

function getRoleHome(role?: Role): string {
  switch (role) {
    case ROLES.DEV:            return '/dev/dashboard'
    case ROLES.ADMIN:          return '/admin/dashboard'
    case ROLES.MARKETING_LEAD: return '/marketing-lead/dashboard'
    case ROLES.DISTRIBUTOR:    return '/distributor/dashboard'
    case ROLES.MARKETER:       return '/marketer/dashboard'
    default:                   return '/dashboard'
  }
}

interface SidebarProps {
  isOpen:    boolean
  onClose:   () => void
  userRole?: Role
}

export default function Sidebar({ isOpen, onClose, userRole }: SidebarProps) {
  const location = useLocation()
  const roleHome = getRoleHome(userRole)

  const visibleItems = userRole
    ? NAV_ITEMS.filter((item) => item.roles.includes(userRole))
    : NAV_ITEMS

  const resolvedItems = visibleItems.map((item) => ({
    ...item,
    to: item.to === 'ROLE_HOME' ? roleHome : item.to,
  }))

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={[
          'fixed top-0 left-0 z-40 h-full w-64 bg-[#1565C0] flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="iDEAL SalesHub" className="w-9 h-9 object-contain" />
            <div className="leading-tight">
              <span className="block text-white text-sm font-bold tracking-wide">iDEAL</span>
              <span className="block text-[#BBDEFB] text-xs">SalesHub</span>
            </div>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Close navigation"
            className="lg:hidden p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        {userRole && (
          <div className="px-5 py-2 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#BBDEFB]">
              <Briefcase size={11} />
              {userRole}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Sidebar navigation">
          <ul role="list" className="flex flex-col gap-0.5">
            {resolvedItems.map((item) => {
              const isActive =
                item.to === roleHome
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to)

              return (
                <li key={item.to + item.label}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={[
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-white text-[#1565C0]'
                        : 'text-[#BBDEFB] hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight size={14} className="shrink-0 opacity-60" />}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">v1.0.0 · iDEAL SalesHub</p>
        </div>
      </aside>
    </>
  )
}

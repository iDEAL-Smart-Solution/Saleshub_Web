import { Menu, Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { UserAuthInfo } from '@/types'

interface HeaderProps {
  onMenuToggle: () => void
  user?: UserAuthInfo | null
  onLogout?: () => void
  notificationCount?: number
}

export default function Header({
  onMenuToggle,
  user,
  onLogout,
  notificationCount = 0,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '??'
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest'

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#EEEEEE] flex items-center px-4 gap-4 shadow-sm">
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
        aria-controls="sidebar"
        className="lg:hidden p-2 rounded-lg text-[#757575] hover:bg-[#F5F5F5] transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* Notifications */}
      <Link
        to="/notifications"
        aria-label={notificationCount > 0 ? `${notificationCount} unread notifications` : 'Notifications'}
        className="relative p-2 rounded-lg text-[#757575] hover:bg-[#F5F5F5] transition-colors"
      >
        <Bell size={20} />
        {notificationCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full
              bg-[#D32F2F] text-white text-[10px] font-bold flex items-center justify-center"
          >
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}
      </Link>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setProfileOpen((v) => !v)}
          aria-expanded={profileOpen}
          aria-haspopup="true"
          aria-label="User menu"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-[#1565C0] text-white text-xs font-bold
              flex items-center justify-center shrink-0"
          >
            {initials}
          </span>
          <span className="hidden sm:block text-sm font-medium text-[#212121] max-w-[120px] truncate">
            {fullName}
          </span>
          <ChevronDown
            size={14}
            className={`text-[#757575] transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {profileOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#EEEEEE] shadow-lg py-1 z-50"
          >
            <div className="px-4 py-3 border-b border-[#EEEEEE]">
              <p className="text-sm font-semibold text-[#212121] truncate">{fullName}</p>
              <p className="text-xs text-[#757575] truncate">{user?.email ?? ''}</p>
              {user?.roles[0] && (
                <span className="mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5
                  rounded bg-[#E3F2FD] text-[#1565C0]">
                  {user.roles[0]}
                </span>
              )}
            </div>

            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#424242]
                hover:bg-[#F5F5F5] transition-colors"
            >
              <User size={15} />
              My Profile
            </Link>

            <div className="border-t border-[#EEEEEE] mt-1 pt-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => { setProfileOpen(false); onLogout?.() }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#D32F2F]
                  hover:bg-[#FFEBEE] transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

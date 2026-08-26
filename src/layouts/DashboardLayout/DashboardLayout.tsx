import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/features/auth'
import { useNotifications } from '@/features/notifications'
import { useEffect } from 'react'
import type { Role } from '@/constants/roles'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuth()
  const { unreadCount, fetchUnreadCount } = useNotifications()

  useEffect(() => { void fetchUnreadCount() }, [fetchUnreadCount])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user?.roles[0] as Role | undefined}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          user={user}
          onLogout={logout}
          notificationCount={unreadCount}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

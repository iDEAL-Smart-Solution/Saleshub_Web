import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { getRoleHomePath } from '@/features/auth/utils/roleRedirect'
import { LoadingState } from '@/components/feedback'

/**
 * Wraps public-only routes (login, register).
 * Authenticated users are sent to their role dashboard instead.
 */
export default function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitializing = useAuthStore((s) => s.isInitializing)
  const user = useAuthStore((s) => s.user)

  if (isInitializing) {
    return <LoadingState fullPage message="Loading…" />
  }

  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.roles[0])} replace />
  }

  return <Outlet />
}

import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { getRoleHomePath } from '@/features/auth/utils/roleRedirect'
import { LoadingState } from '@/components/feedback'

/**
 * Generic fallback dashboard route (/dashboard).
 *
 * Under normal operation authenticated users are redirected straight to their
 * role-specific dashboard on login, so this route should rarely be reached.
 * When it is, we redirect the user to their correct dashboard rather than
 * showing a misleading placeholder with fake statistics.
 */
export default function DashboardPage() {
  const user          = useAuthStore((s) => s.user)
  const isInitializing = useAuthStore((s) => s.isInitializing)

  if (isInitializing) {
    return <LoadingState fullPage message="Loading dashboard…" />
  }

  if (user?.roles[0]) {
    return <Navigate to={getRoleHomePath(user.roles[0])} replace />
  }

  // Authenticated but no role — shouldn't happen, but don't show fake data
  return <Navigate to="/login" replace />
}

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { hasAnyRole } from '@/features/auth/utils/roleRedirect'
import { getRoleHomePath } from '@/features/auth/utils/roleRedirect'
import type { Role } from '@/constants/roles'

interface RoleRouteProps {
  /** Roles that are permitted to access this route tree. */
  allowedRoles: Role[]
}

/**
 * Sits inside a ProtectedRoute (auth is already confirmed).
 * Checks the user's role against allowedRoles.
 * - Allowed: render <Outlet />
 * - Not allowed: redirect to /403 (user is authenticated but forbidden)
 */
export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasAnyRole(user.roles, allowedRoles)) {
    // Send them to their own dashboard if they accidentally hit another role's area
    const home = getRoleHomePath(user.roles[0])
    return <Navigate to="/403" state={{ home }} replace />
  }

  return <Outlet />
}

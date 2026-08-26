import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LoadingState } from '@/components/feedback'

/**
 * Wraps routes that require authentication.
 * - While auth is initializing: show a full-page loader.
 * - If unauthenticated: redirect to /login, preserving the intended URL.
 * - If authenticated: render child routes via <Outlet />.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInitializing = useAuthStore((s) => s.isInitializing)
  const location = useLocation()

  if (isInitializing) {
    return <LoadingState fullPage message="Restoring session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

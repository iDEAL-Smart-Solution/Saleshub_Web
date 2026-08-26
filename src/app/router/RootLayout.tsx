import { Outlet } from 'react-router-dom'
import { useInitializeAuth } from '@/features/auth'
import { useAuthStore } from '@/stores/authStore'
import { LoadingState } from '@/components/feedback'

/**
 * Top-level layout that initializes auth before rendering any child routes.
 * Prevents the login page from flashing when a user has a valid session.
 */
export default function RootLayout() {
  useInitializeAuth()
  const isInitializing = useAuthStore((s) => s.isInitializing)

  if (isInitializing) {
    return <LoadingState fullPage message="Loading iDEAL SalesHub…" />
  }

  return <Outlet />
}

import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'

/**
 * Root provider tree.
 * Session initialization runs inside the router via AuthInitLayout
 * so it has access to React Router context.
 */
export default function AppProviders() {
  return <RouterProvider router={router} />
}

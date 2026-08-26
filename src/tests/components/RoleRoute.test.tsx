import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import RoleRoute from '@/features/auth/components/RoleRoute'
import { ROLES } from '@/constants/roles'
import type { UserAuthInfo } from '@/types'

function makeUser(role: string): UserAuthInfo {
  return { id: 'u1', firstName: 'A', lastName: 'B', email: 'a@b.com', roles: [role as never] }
}

function renderWithRouter(user: UserAuthInfo | null, allowedRoles: typeof ROLES[keyof typeof ROLES][]) {
  if (user) {
    useAuthStore.getState().setAuth(user, 'tok', 'ref', '2099-01-01T00:00:00Z')
  }
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route element={<RoleRoute allowedRoles={allowedRoles} />}>
          <Route path="/admin" element={<div>Admin area</div>} />
        </Route>
        <Route path="/403" element={<div>Forbidden</div>} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RoleRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().setInitializing(false)
  })

  it('renders content for allowed role', () => {
    renderWithRouter(makeUser(ROLES.ADMIN), [ROLES.DEV, ROLES.ADMIN])
    expect(screen.getByText('Admin area')).toBeDefined()
  })

  it('redirects to /403 for disallowed role', () => {
    renderWithRouter(makeUser(ROLES.MARKETER), [ROLES.DEV, ROLES.ADMIN])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })

  it('Dev can access admin area', () => {
    renderWithRouter(makeUser(ROLES.DEV), [ROLES.DEV, ROLES.ADMIN])
    expect(screen.getByText('Admin area')).toBeDefined()
  })

  it('redirects to /login when no user', () => {
    renderWithRouter(null, [ROLES.ADMIN])
    expect(screen.getByText('Login')).toBeDefined()
  })
})

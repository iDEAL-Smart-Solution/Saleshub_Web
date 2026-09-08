/**
 * Phase 7 — Route guard tests for Distributor role.
 * Verifies that:
 *  - Distributor reaches their own routes.
 *  - Distributor is blocked from Admin/Marketing Lead routes.
 *  - Marketing Lead cannot access Distributor routes.
 *  - Marketer cannot access Distributor routes.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import RoleRoute from '@/features/auth/components/RoleRoute'
import { ROLES } from '@/constants/roles'
import type { UserAuthInfo } from '@/types'

function makeUser(role: string): UserAuthInfo {
  return { id: 'u1', firstName: 'Test', lastName: 'User', email: 't@t.com', roles: [role as never] }
}

function renderWithRole(userRole: string, allowedRoles: string[]) {
  const user = makeUser(userRole)
  useAuthStore.getState().setAuth(user, 'tok', 'ref', '2099-01-01T00:00:00Z')

  return render(
    <MemoryRouter initialEntries={['/target']}>
      <Routes>
        <Route element={<RoleRoute allowedRoles={allowedRoles as never} />}>
          <Route path="/target" element={<div>Protected area</div>} />
        </Route>
        <Route path="/403" element={<div>Forbidden</div>} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Distributor route access', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().setInitializing(false)
  })

  it('Distributor can access Distributor-only routes', () => {
    renderWithRole(ROLES.DISTRIBUTOR, [ROLES.DISTRIBUTOR])
    expect(screen.getByText('Protected area')).toBeDefined()
  })

  it('Distributor is blocked from Admin/Dev routes', () => {
    renderWithRole(ROLES.DISTRIBUTOR, [ROLES.DEV, ROLES.ADMIN])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })

  it('Distributor is blocked from MarketingLead routes', () => {
    renderWithRole(ROLES.DISTRIBUTOR, [ROLES.DEV, ROLES.ADMIN, ROLES.MARKETING_LEAD])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })

  it('Distributor is blocked from Marketer-only routes', () => {
    renderWithRole(ROLES.DISTRIBUTOR, [ROLES.MARKETER])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })

  it('MarketingLead cannot access Distributor-only routes', () => {
    renderWithRole(ROLES.MARKETING_LEAD, [ROLES.DISTRIBUTOR])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })

  it('Marketer cannot access Distributor-only routes', () => {
    renderWithRole(ROLES.MARKETER, [ROLES.DISTRIBUTOR])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })

  it('Admin cannot access Distributor-only routes', () => {
    renderWithRole(ROLES.ADMIN, [ROLES.DISTRIBUTOR])
    expect(screen.getByText('Forbidden')).toBeDefined()
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { ROLES } from '@/constants/roles'
import type { UserAuthInfo } from '@/types'

const mockUser: UserAuthInfo = {
  id: 'u1', firstName: 'Jane', lastName: 'Doe',
  email: 'jane@ideal.com', roles: [ROLES.ADMIN],
}

function renderWithRouter(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    // Set initializing to false so redirects happen immediately
    useAuthStore.getState().setInitializing(false)
  })

  it('redirects unauthenticated user to /login', () => {
    renderWithRouter('/dashboard')
    expect(screen.getByText('Login page')).toBeDefined()
  })

  it('renders protected content for authenticated user', () => {
    useAuthStore.getState().setAuth(mockUser, 'token', 'refresh', '2099-01-01T00:00:00Z')
    renderWithRouter('/dashboard')
    expect(screen.getByText('Dashboard content')).toBeDefined()
  })

  it('shows loader while isInitializing is true', () => {
    useAuthStore.getState().setInitializing(true)
    renderWithRouter('/dashboard')
    // LoadingState outer div + Spinner inner span both carry status-like roles;
    // use getAllByRole to handle the composite structure
    const statusEls = screen.getAllByRole('status')
    expect(statusEls.length).toBeGreaterThan(0)
  })
})

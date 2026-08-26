import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import { useAuthStore } from '@/stores/authStore'

vi.mock('@/services/api/auth.service', () => ({
  loginApi: vi.fn(),
  logoutApi: vi.fn(),
  registerMarketerApi: vi.fn(),
  changePasswordApi: vi.fn(),
  refreshTokenApi: vi.fn(),
}))

import * as authService from '@/services/api/auth.service'

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/marketer/dashboard" element={<div>Marketer Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

// Helper: find password input by its id attribute
function getPasswordInput() {
  return document.getElementById('password') as HTMLInputElement
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().setInitializing(false)
    vi.clearAllMocks()
  })

  it('renders email and password fields', () => {
    renderLoginPage()
    expect(screen.getByLabelText(/email address/i)).toBeDefined()
    expect(getPasswordInput()).toBeTruthy()
  })

  it('renders sign in button', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
  })

  it('shows validation error for empty email', async () => {
    renderLoginPage()
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/email is required/i)).toBeDefined()
  })

  it('shows validation error for invalid email', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/email address/i), 'notanemail')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByText(/valid email/i)).toBeDefined()
  })

  it('calls loginApi with correct credentials on submit', async () => {
    const mockLoginApi = vi.mocked(authService.loginApi)
    mockLoginApi.mockResolvedValue({
      accessToken: 'tok',
      refreshToken: 'ref',
      accessTokenExpiry: '2099-01-01T00:00:00Z',
      user: { id: 'u1', firstName: 'A', lastName: 'B', email: 'a@b.com', roles: ['Admin' as never] },
    })

    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/email address/i), 'admin@ideal.com')
    await userEvent.type(getPasswordInput(), 'Password1!')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(mockLoginApi).toHaveBeenCalledWith({
      email: 'admin@ideal.com',
      password: 'Password1!',
    })
  })

  it('shows backend error message on login failure', async () => {
    const mockLoginApi = vi.mocked(authService.loginApi)
    mockLoginApi.mockRejectedValue({ message: 'Invalid email or password', statusCode: 401 })

    renderLoginPage()
    await userEvent.type(screen.getByLabelText(/email address/i), 'bad@ideal.com')
    await userEvent.type(getPasswordInput(), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email or password/i)).toBeDefined()
  })

  it('has show/hide password toggle', async () => {
    renderLoginPage()
    const pwInput = getPasswordInput()
    expect(pwInput.getAttribute('type')).toBe('password')
    await userEvent.click(screen.getByLabelText(/show password/i))
    expect(pwInput.getAttribute('type')).toBe('text')
  })
})

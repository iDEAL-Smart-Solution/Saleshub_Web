import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/auth/RegisterPage'

vi.mock('@/services/api/auth.service', () => ({
  loginApi: vi.fn(),
  logoutApi: vi.fn(),
  registerMarketerApi: vi.fn(),
  changePasswordApi: vi.fn(),
  refreshTokenApi: vi.fn(),
}))

import * as authService from '@/services/api/auth.service'

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pending-approval" element={<div>Pending approval</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

// Helpers — query by input id directly to avoid label-text ambiguity
function getPasswordInput()        { return document.getElementById('password')        as HTMLInputElement }
function getConfirmPasswordInput() { return document.getElementById('confirm-password') as HTMLInputElement }

describe('RegisterPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders required fields', () => {
    renderRegisterPage()
    expect(screen.getByLabelText(/first name/i)).toBeDefined()
    expect(screen.getByLabelText(/last name/i)).toBeDefined()
    expect(screen.getByLabelText(/email address/i)).toBeDefined()
    expect(getPasswordInput()).toBeTruthy()
    expect(getConfirmPasswordInput()).toBeTruthy()
  })

  it('shows required field errors on empty submit', async () => {
    renderRegisterPage()
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))
    // Multiple "Required" errors expected
    const errors = await screen.findAllByText(/required/i)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('shows error when passwords do not match', async () => {
    renderRegisterPage()
    await userEvent.type(getPasswordInput(), 'ValidPass1!')
    await userEvent.type(getConfirmPasswordInput(), 'DifferentPass1!')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText(/do not match/i)).toBeDefined()
  })

  it('does NOT contain a role selector', () => {
    renderRegisterPage()
    expect(screen.queryByLabelText(/role/i)).toBeNull()
  })

  it('navigates to /pending-approval on success', async () => {
    vi.mocked(authService.registerMarketerApi).mockResolvedValue({
      message: 'Registration successful.',
    })

    renderRegisterPage()
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane')
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith')
    await userEvent.type(screen.getByLabelText(/email address/i), 'jane@ideal.com')
    await userEvent.type(getPasswordInput(), 'ValidPass1!')
    await userEvent.type(getConfirmPasswordInput(), 'ValidPass1!')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/pending approval/i)).toBeDefined()
  })

  it('shows backend error on registration failure', async () => {
    vi.mocked(authService.registerMarketerApi).mockRejectedValue({
      message: 'Email already exists',
      statusCode: 400,
    })

    renderRegisterPage()
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane')
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith')
    await userEvent.type(screen.getByLabelText(/email address/i), 'jane@ideal.com')
    await userEvent.type(getPasswordInput(), 'ValidPass1!')
    await userEvent.type(getConfirmPasswordInput(), 'ValidPass1!')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/email already exists/i)).toBeDefined()
  })
})

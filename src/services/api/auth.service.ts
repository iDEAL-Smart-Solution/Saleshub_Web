import { apiClient } from './client'
import { normalizeApiError } from './errorHandler'
import type {
  AuthResponse,
  LoginRequest,
  RegisterMarketerRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
} from '@/types'

/**
 * POST /api/auth/login
 * Returns AuthResponse with accessToken, refreshToken, accessTokenExpiry, user.
 */
export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>('/auth/login', data)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/auth/register
 * Registers a marketer. Account starts as inactive (pending approval).
 * Returns { message } — does NOT return tokens.
 */
export async function registerMarketerApi(data: RegisterMarketerRequest): Promise<{ message: string }> {
  try {
    const res = await apiClient.post<{ message: string }>('/auth/register', data)
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/auth/refresh
 * Submits both the expired access token and the refresh token.
 * Returns a new AuthResponse.
 */
export async function refreshTokenApi(data: RefreshTokenRequest): Promise<AuthResponse> {
  // Use a plain axios call to bypass the interceptor and avoid infinite loops.
  // The interceptor calls this function — we must not re-trigger it.
  try {
    const res = await apiClient.post<AuthResponse>('/auth/refresh', data, {
      // Signal to the interceptor to skip the refresh-retry logic
      headers: { 'X-Skip-Refresh': 'true' },
    })
    return res.data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

/**
 * POST /api/auth/logout
 * Backend expects the raw refresh token as a JSON string in the request body.
 * Revokes the refresh token server-side.
 */
export async function logoutApi(refreshToken: string): Promise<void> {
  try {
    await apiClient.post('/auth/logout', JSON.stringify(refreshToken), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    // Swallow — we still clear client state on logout regardless
  }
}

/**
 * POST /api/auth/change-password
 * Requires active JWT in Authorization header.
 */
export async function changePasswordApi(data: ChangePasswordRequest): Promise<void> {
  try {
    await apiClient.post('/auth/change-password', data)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

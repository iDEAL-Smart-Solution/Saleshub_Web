import { create } from 'zustand'
import type { UserAuthInfo } from '@/types'

/**
 * Refresh token storage key.
 *
 * ⚠️ Security trade-off:
 * The backend returns refresh tokens in the response body (no HttpOnly cookie support).
 * We store the refresh token in sessionStorage (not localStorage) which:
 *   - Clears when the browser tab/session closes
 *   - Is still accessible to JavaScript on this origin
 *   - Is a reasonable compromise given the current backend design
 * In a future backend iteration, move refresh tokens to HttpOnly cookies.
 */
const RT_KEY = 'ideal_rt'

function loadRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(RT_KEY)
  } catch {
    return null
  }
}

function saveRefreshToken(token: string | null) {
  try {
    if (token) {
      sessionStorage.setItem(RT_KEY, token)
    } else {
      sessionStorage.removeItem(RT_KEY)
    }
  } catch {
    // Silently ignore — storage might be unavailable
  }
}

// ── Store interface ──────────────────────────────────────────────────────────
interface AuthStore {
  user: UserAuthInfo | null
  accessToken: string | null
  refreshToken: string | null          // loaded from sessionStorage on init
  accessTokenExpiry: string | null     // ISO datetime
  isAuthenticated: boolean
  isInitializing: boolean
  error: string | null

  // Actions
  setAuth: (user: UserAuthInfo, accessToken: string, refreshToken: string, expiry: string) => void
  setTokens: (accessToken: string, refreshToken: string, expiry: string) => void
  setUser: (user: UserAuthInfo | null) => void
  setInitializing: (v: boolean) => void
  setError: (error: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  accessToken: null,
  refreshToken: loadRefreshToken(),   // restore from sessionStorage on app start
  accessTokenExpiry: null,
  isAuthenticated: false,
  isInitializing: true,                // true until initializeAuth completes
  error: null,

  setAuth: (user, accessToken, refreshToken, accessTokenExpiry) => {
    saveRefreshToken(refreshToken)
    // Also persist last access token for session restore on page refresh
    try { sessionStorage.setItem('ideal_at', accessToken) } catch { /* ignore */ }
    set({
      user,
      accessToken,
      refreshToken,
      accessTokenExpiry,
      isAuthenticated: true,
      error: null,
    })
  },

  setTokens: (accessToken, refreshToken, accessTokenExpiry) => {
    saveRefreshToken(refreshToken)
    try { sessionStorage.setItem('ideal_at', accessToken) } catch { /* ignore */ }
    set({ accessToken, refreshToken, accessTokenExpiry })
  },

  setUser: (user) => set({ user, isAuthenticated: user !== null }),

  setInitializing: (isInitializing) => set({ isInitializing }),

  setError: (error) => set({ error }),

  clearAuth: () => {
    saveRefreshToken(null)
    try { sessionStorage.removeItem('ideal_at') } catch { /* ignore */ }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiry: null,
      isAuthenticated: false,
      error: null,
    })
  },
}))

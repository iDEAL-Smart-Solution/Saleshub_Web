import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { refreshTokenApi } from '@/services/api/auth.service'

/**
 * Called once on application startup.
 *
 * Strategy:
 *   1. Check if a refresh token exists in sessionStorage.
 *   2. If yes: we do NOT have a valid access token in memory (page was refreshed).
 *      Attempt a silent token refresh using the stored refresh token.
 *      We need a dummy/empty access token string — the backend validates the access token
 *      principal even when expired, so we send an empty string to let it fail gracefully.
 *      Actually: RefreshTokenRequest requires both access and refresh token.
 *      We store the last access token in sessionStorage alongside the refresh token
 *      so we can provide it for the refresh call.
 *   3. If refresh succeeds: restore auth state.
 *   4. If refresh fails or no token: clear state.
 *   5. Always set isInitializing = false when done.
 */
export function useInitializeAuth() {
  const store = useAuthStore()

  useEffect(() => {
    let cancelled = false

    async function init() {
      const refreshToken = store.refreshToken
      const lastAccessToken = sessionStorage.getItem('ideal_at')

      if (!refreshToken || !lastAccessToken) {
        if (!cancelled) {
          store.clearAuth()
          store.setInitializing(false)
        }
        return
      }

      try {
        const res = await refreshTokenApi({
          accessToken: lastAccessToken,
          refreshToken,
        })
        if (!cancelled) {
          store.setAuth(res.user, res.accessToken, res.refreshToken, res.accessTokenExpiry)
          // Update persisted access token
          sessionStorage.setItem('ideal_at', res.accessToken)
        }
      } catch {
        if (!cancelled) {
          store.clearAuth()
          sessionStorage.removeItem('ideal_at')
        }
      } finally {
        if (!cancelled) {
          store.setInitializing(false)
        }
      }
    }

    void init()

    return () => {
      cancelled = true
    }
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

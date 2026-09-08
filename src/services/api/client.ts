import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) ||
  'https://saleshub.api.idealsmartsolutions.com/api'

/**
 * Central Axios instance for all API communication.
 *
 * Token strategy:
 *   - Access token: in-memory only (authStore Zustand state).
 *   - Refresh token: sessionStorage under key 'ideal_rt'.
 *     ⚠️ Security note: The backend does not support HttpOnly cookies for refresh tokens.
 *        sessionStorage is cleared when the tab closes, limiting exposure compared to localStorage.
 *        In a future backend iteration, HttpOnly cookie support should be added.
 *
 * Refresh loop prevention:
 *   - isRefreshing flag queues concurrent 401 requests.
 *   - Requests with X-Skip-Refresh header bypass retry (the refresh call itself).
 *   - _retry flag on the original request prevents double-retry.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Refresh-loop guard ───────────────────────────────────────────────────────
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeToRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function notifyRefreshSubscribers(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

/**
 * Lazily resolves the authStore to avoid circular dependency at module load time.
 * The store module imports nothing from this file, so the lazy approach is safe.
 */
async function getAuthStore() {
  const { useAuthStore } = await import('@/stores/authStore')
  return useAuthStore
}

async function getRefreshTokenApi() {
  const { refreshTokenApi } = await import('./auth.service')
  return refreshTokenApi
}

// ── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const useAuthStore = await getAuthStore()
    const token = useAuthStore.getState().accessToken
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status: number | undefined = error.response?.status
    const skipRefresh = originalRequest?.headers?.['X-Skip-Refresh'] === 'true'

    if (status === 401 && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true

      const useAuthStore = await getAuthStore()
      const { accessToken, refreshToken } = useAuthStore.getState()

      if (!refreshToken) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Queue concurrent 401s while refresh is in flight
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeToRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const refreshTokenApi = await getRefreshTokenApi()
        const authResponse = await refreshTokenApi({
          accessToken: accessToken ?? '',
          refreshToken,
        })

        useAuthStore.getState().setTokens(
          authResponse.accessToken,
          authResponse.refreshToken,
          authResponse.accessTokenExpiry,
        )

        notifyRefreshSubscribers(authResponse.accessToken)

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${authResponse.accessToken}`
        }
        return apiClient(originalRequest)
      } catch {
        const useAuthStore2 = await getAuthStore()
        useAuthStore2.getState().clearAuth()
        refreshSubscribers = []
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // 403 — authenticated but forbidden; do not log out
    // Caller handles navigation

    return Promise.reject(error)
  },
)

export default apiClient

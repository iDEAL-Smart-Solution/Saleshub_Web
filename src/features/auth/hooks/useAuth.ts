import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { loginApi, logoutApi, registerMarketerApi, changePasswordApi } from '@/services/api/auth.service'
import { getRoleHomePath } from '@/features/auth/utils/roleRedirect'
import type { LoginRequest, RegisterMarketerRequest, ChangePasswordRequest } from '@/types'
import type { ApiError } from '@/types'

export function useAuth() {
  const store = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(
    async (data: LoginRequest): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await loginApi(data)
        store.setAuth(res.user, res.accessToken, res.refreshToken, res.accessTokenExpiry)
        const role = res.user.roles[0]
        navigate(getRoleHomePath(role), { replace: true })
        return true
      } catch (err) {
        const apiErr = err as ApiError
        setError(apiErr.message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [store, navigate],
  )

  const logout = useCallback(async () => {
    const rt = store.refreshToken
    store.clearAuth()
    navigate('/login', { replace: true })
    // Fire-and-forget server-side revocation
    if (rt) {
      await logoutApi(rt).catch(() => {
        // Network failure on logout is acceptable — client is already cleared
      })
    }
  }, [store, navigate])

  const register = useCallback(
    async (data: RegisterMarketerRequest): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        await registerMarketerApi(data)
        return true
      } catch (err) {
        const apiErr = err as ApiError
        setError(apiErr.message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const changePassword = useCallback(
    async (data: ChangePasswordRequest): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        await changePasswordApi(data)
        return true
      } catch (err) {
        const apiErr = err as ApiError
        setError(apiErr.message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isInitializing: store.isInitializing,
    isLoading,
    error,
    login,
    logout,
    register,
    changePassword,
    clearError: () => setError(null),
  }
}

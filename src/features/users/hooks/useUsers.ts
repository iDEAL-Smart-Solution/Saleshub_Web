import { useCallback } from 'react'
import { useUserStore } from '@/stores/userStore'
import {
  getAllUsersApi,
  getPendingMarketersApi,
  getUserByIdApi,
  createUserApi,
  approveMarketerApi,
  activateUserApi,
  deactivateUserApi,
  changeUserRoleApi,
} from '@/services/api/user.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { CreateUserRequest, ChangeUserRoleRequest } from '@/types'

export function useUsers() {
  const store = useUserStore()

  // Callbacks read actions via `useUserStore.getState()` with `[]` deps so their
  // identity stays stable across renders. (Depending on the subscribed `store` object
  // gives every callback a new identity per store update → infinite loop when used in
  // a `useEffect` dep array.)

  const fetchAllUsers = useCallback(async () => {
    const s = useUserStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      const users = await getAllUsersApi()
      s.setUsers(users)
    } catch (err) {
      s.setError(normalizeApiError(err).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchPendingMarketers = useCallback(async () => {
    const s = useUserStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      const users = await getPendingMarketersApi()
      s.setPendingMarketers(users)
    } catch (err) {
      s.setError(normalizeApiError(err).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchUserById = useCallback(async (id: string) => {
    const s = useUserStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      const user = await getUserByIdApi(id)
      s.setSelectedUser(user)
    } catch (err) {
      s.setError(normalizeApiError(err).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const createUser = useCallback(
    async (data: CreateUserRequest): Promise<boolean> => {
      const s = useUserStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await createUserApi(data)
        await fetchAllUsers()
        return true
      } catch (err) {
        s.setError(normalizeApiError(err).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [fetchAllUsers],
  )

  const approveMarketer = useCallback(
    async (id: string): Promise<boolean> => {
      const s = useUserStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await approveMarketerApi(id)
        s.removeUserFromList(id)
        await fetchAllUsers()
        return true
      } catch (err) {
        s.setError(normalizeApiError(err).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [fetchAllUsers],
  )

  const activateUser = useCallback(
    async (id: string): Promise<boolean> => {
      const s = useUserStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await activateUserApi(id)
        await fetchAllUsers()
        return true
      } catch (err) {
        s.setError(normalizeApiError(err).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [fetchAllUsers],
  )

  const deactivateUser = useCallback(
    async (id: string): Promise<boolean> => {
      const s = useUserStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await deactivateUserApi(id)
        await fetchAllUsers()
        return true
      } catch (err) {
        s.setError(normalizeApiError(err).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [fetchAllUsers],
  )

  const changeUserRole = useCallback(
    async (id: string, data: ChangeUserRoleRequest): Promise<boolean> => {
      const s = useUserStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await changeUserRoleApi(id, data)
        await fetchAllUsers()
        return true
      } catch (err) {
        s.setError(normalizeApiError(err).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [fetchAllUsers],
  )

  return {
    users: store.users,
    pendingMarketers: store.pendingMarketers,
    selectedUser: store.selectedUser,
    isLoading: store.isLoading,
    isActionLoading: store.isActionLoading,
    error: store.error,
    fetchAllUsers,
    fetchPendingMarketers,
    fetchUserById,
    createUser,
    approveMarketer,
    activateUser,
    deactivateUser,
    changeUserRole,
    clearError: () => useUserStore.getState().setError(null),
  }
}

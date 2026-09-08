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
  getActiveDistributorsApi,
  reassignDistributorApi,
} from '@/services/api/user.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { CreateUserRequest, ChangeUserRoleRequest, AssignDistributorRequest } from '@/types'

export function useUsers() {
  const store = useUserStore()

  const fetchAllUsers = useCallback(async () => {
    const s = useUserStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setUsers(await getAllUsersApi()) }
    catch (err) { s.setError(normalizeApiError(err).message) }
    finally { s.setLoading(false) }
  }, [])

  const fetchPendingMarketers = useCallback(async () => {
    const s = useUserStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setPendingMarketers(await getPendingMarketersApi()) }
    catch (err) { s.setError(normalizeApiError(err).message) }
    finally { s.setLoading(false) }
  }, [])

  const fetchDistributors = useCallback(async () => {
    const s = useUserStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setDistributors(await getActiveDistributorsApi()) }
    catch (err) { s.setError(normalizeApiError(err).message) }
    finally { s.setLoading(false) }
  }, [])

  const fetchUserById = useCallback(async (id: string) => {
    const s = useUserStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setSelectedUser(await getUserByIdApi(id)) }
    catch (err) { s.setError(normalizeApiError(err).message) }
    finally { s.setLoading(false) }
  }, [])

  const createUser = useCallback(async (data: CreateUserRequest): Promise<boolean> => {
    const s = useUserStore.getState()
    s.setActionLoading(true); s.setError(null)
    try { await createUserApi(data); await fetchAllUsers(); return true }
    catch (err) { s.setError(normalizeApiError(err).message); return false }
    finally { s.setActionLoading(false) }
  }, [fetchAllUsers])

  const approveMarketer = useCallback(async (id: string, distributorId: string): Promise<boolean> => {
    const s = useUserStore.getState()
    s.setActionLoading(true); s.setError(null)
    try {
      await approveMarketerApi(id, { distributorId })
      s.removeUserFromList(id)
      await fetchAllUsers()
      return true
    }
    catch (err) { s.setError(normalizeApiError(err).message); return false }
    finally { s.setActionLoading(false) }
  }, [fetchAllUsers])

  const activateUser = useCallback(async (id: string): Promise<boolean> => {
    const s = useUserStore.getState()
    s.setActionLoading(true); s.setError(null)
    try { await activateUserApi(id); await fetchAllUsers(); return true }
    catch (err) { s.setError(normalizeApiError(err).message); return false }
    finally { s.setActionLoading(false) }
  }, [fetchAllUsers])

  const deactivateUser = useCallback(async (id: string): Promise<boolean> => {
    const s = useUserStore.getState()
    s.setActionLoading(true); s.setError(null)
    try { await deactivateUserApi(id); await fetchAllUsers(); return true }
    catch (err) { s.setError(normalizeApiError(err).message); return false }
    finally { s.setActionLoading(false) }
  }, [fetchAllUsers])

  const changeUserRole = useCallback(async (id: string, data: ChangeUserRoleRequest): Promise<boolean> => {
    const s = useUserStore.getState()
    s.setActionLoading(true); s.setError(null)
    try { await changeUserRoleApi(id, data); await fetchAllUsers(); return true }
    catch (err) { s.setError(normalizeApiError(err).message); return false }
    finally { s.setActionLoading(false) }
  }, [fetchAllUsers])

  const reassignDistributor = useCallback(async (marketerId: string, data: AssignDistributorRequest): Promise<boolean> => {
    const s = useUserStore.getState()
    s.setActionLoading(true); s.setError(null)
    try { await reassignDistributorApi(marketerId, data); await fetchAllUsers(); return true }
    catch (err) { s.setError(normalizeApiError(err).message); return false }
    finally { s.setActionLoading(false) }
  }, [fetchAllUsers])

  return {
    users:              store.users,
    pendingMarketers:   store.pendingMarketers,
    distributors:       store.distributors,
    selectedUser:       store.selectedUser,
    isLoading:          store.isLoading,
    isActionLoading:    store.isActionLoading,
    error:              store.error,
    fetchAllUsers,
    fetchPendingMarketers,
    fetchDistributors,
    fetchUserById,
    createUser,
    approveMarketer,
    activateUser,
    deactivateUser,
    changeUserRole,
    reassignDistributor,
    clearError: () => useUserStore.getState().setError(null),
  }
}

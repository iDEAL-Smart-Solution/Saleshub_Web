import { useCallback } from 'react'
import { useCustomerStore } from '@/stores/customerStore'
import {
  getAllCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  activateCustomerApi,
  deactivateCustomerApi,
} from '@/services/api/customer.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '@/types'

export function useCustomers() {
  const store = useCustomerStore()

  const fetchCustomers = useCallback(async (search?: string) => {
    const s = useCustomerStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setCustomers(await getAllCustomersApi(search))
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const createCustomer = useCallback(
    async (data: CreateCustomerRequest): Promise<boolean> => {
      const s = useCustomerStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        const c = await createCustomerApi(data)
        s.upsertCustomer(c)
        return true
      } catch (e) {
        s.setError(normalizeApiError(e).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [],
  )

  const updateCustomer = useCallback(
    async (id: string, data: UpdateCustomerRequest): Promise<boolean> => {
      const s = useCustomerStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        const c = await updateCustomerApi(id, data)
        s.upsertCustomer(c)
        return true
      } catch (e) {
        s.setError(normalizeApiError(e).message)
        return false
      } finally {
        s.setActionLoading(false)
      }
    },
    [],
  )

  const activateCustomer = useCallback(async (id: string): Promise<boolean> => {
    const s = useCustomerStore.getState()
    s.setActionLoading(true)
    s.setError(null)
    try {
      await activateCustomerApi(id)
      const existing = useCustomerStore.getState().customers.find((c) => c.id === id)
      if (existing) s.upsertCustomer({ ...existing, isActive: true })
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  const deactivateCustomer = useCallback(async (id: string): Promise<boolean> => {
    const s = useCustomerStore.getState()
    s.setActionLoading(true)
    s.setError(null)
    try {
      await deactivateCustomerApi(id)
      const existing = useCustomerStore.getState().customers.find((c) => c.id === id)
      if (existing) s.upsertCustomer({ ...existing, isActive: false })
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  return {
    customers:          store.customers,
    selectedCustomer:   store.selectedCustomer,
    isLoading:          store.isLoading,
    isActionLoading:    store.isActionLoading,
    error:              store.error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    activateCustomer,
    deactivateCustomer,
    setSelectedCustomer: store.setSelectedCustomer,
    clearError:          () => useCustomerStore.getState().setError(null),
  }
}

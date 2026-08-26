import { useCallback } from 'react'
import { useSaleStore } from '@/stores/saleStore'
import {
  getAllSalesApi,
  getMySalesApi,
  getSalesByMarketerApi,
  getSaleByIdApi,
  createSaleApi,
  confirmSaleApi,
  rejectSaleApi,
  refundSaleApi,
} from '@/services/api/sale.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import { SaleStatus } from '@/types'
import type { CreateSaleRequest, RejectSaleRequest } from '@/types'

export function useSales() {
  const store = useSaleStore()

  // Callbacks read actions/state via `useSaleStore.getState()` with `[]` deps so
  // their identity stays stable across renders. (Depending on the subscribed `store`
  // object gives every callback a new identity per store update → infinite loop when
  // used in a `useEffect` dep array.)

  const fetchAllSales = useCallback(async () => {
    const s = useSaleStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setSales(await getAllSalesApi())
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchMySales = useCallback(async () => {
    const s = useSaleStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setMySales(await getMySalesApi())
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchSalesByMarketer = useCallback(async (marketerId: string) => {
    const s = useSaleStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setSales(await getSalesByMarketerApi(marketerId))
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const fetchSaleById = useCallback(async (id: string) => {
    const s = useSaleStore.getState()
    s.setLoading(true)
    s.setError(null)
    try {
      s.setSelectedSale(await getSaleByIdApi(id))
    } catch (e) {
      s.setError(normalizeApiError(e).message)
    } finally {
      s.setLoading(false)
    }
  }, [])

  const createSale = useCallback(
    async (data: CreateSaleRequest): Promise<boolean> => {
      const s = useSaleStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await createSaleApi(data)
        // Refresh the full list after creation
        const updated = await getAllSalesApi().catch(() => useSaleStore.getState().sales)
        useSaleStore.getState().setSales(updated)
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

  const confirmSale = useCallback(async (id: string): Promise<boolean> => {
    const s = useSaleStore.getState()
    s.setActionLoading(true)
    s.setError(null)
    try {
      await confirmSaleApi(id)
      s.updateSaleStatus(id, SaleStatus.Confirmed)
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  const rejectSale = useCallback(
    async (id: string, data: RejectSaleRequest): Promise<boolean> => {
      const s = useSaleStore.getState()
      s.setActionLoading(true)
      s.setError(null)
      try {
        await rejectSaleApi(id, data)
        s.updateSaleStatus(id, SaleStatus.Rejected)
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

  const refundSale = useCallback(async (id: string): Promise<boolean> => {
    const s = useSaleStore.getState()
    s.setActionLoading(true)
    s.setError(null)
    try {
      await refundSaleApi(id)
      s.updateSaleStatus(id, SaleStatus.Refunded)
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  return {
    sales:              store.sales,
    mySales:            store.mySales,
    selectedSale:       store.selectedSale,
    isLoading:          store.isLoading,
    isActionLoading:    store.isActionLoading,
    error:              store.error,
    fetchAllSales,
    fetchMySales,
    fetchSalesByMarketer,
    fetchSaleById,
    createSale,
    confirmSale,
    rejectSale,
    refundSale,
    clearError:         () => useSaleStore.getState().setError(null),
    clearSelectedSale:  () => useSaleStore.getState().setSelectedSale(null),
  }
}

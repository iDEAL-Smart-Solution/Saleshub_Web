import { useCallback } from 'react'
import { useSaleStore } from '@/stores/saleStore'
import {
  getAllSalesApi,
  getMySalesApi,
  getDistributorSalesApi,
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

  const fetchAllSales = useCallback(async () => {
    const s = useSaleStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setSales(await getAllSalesApi()) }
    catch (e) { s.setError(normalizeApiError(e).message) }
    finally { s.setLoading(false) }
  }, [])

  const fetchMySales = useCallback(async () => {
    const s = useSaleStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setMySales(await getMySalesApi()) }
    catch (e) { s.setError(normalizeApiError(e).message) }
    finally { s.setLoading(false) }
  }, [])

  /** Fetches sales for all marketers assigned to the current Distributor. */
  const fetchDistributorSales = useCallback(async () => {
    const s = useSaleStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setDistributorSales(await getDistributorSalesApi()) }
    catch (e) { s.setError(normalizeApiError(e).message) }
    finally { s.setLoading(false) }
  }, [])

  const fetchSalesByMarketer = useCallback(async (marketerId: string) => {
    const s = useSaleStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setSales(await getSalesByMarketerApi(marketerId)) }
    catch (e) { s.setError(normalizeApiError(e).message) }
    finally { s.setLoading(false) }
  }, [])

  const fetchSaleById = useCallback(async (id: string) => {
    const s = useSaleStore.getState()
    s.setLoading(true); s.setError(null)
    try { s.setSelectedSale(await getSaleByIdApi(id)) }
    catch (e) { s.setError(normalizeApiError(e).message) }
    finally { s.setLoading(false) }
  }, [])

  const createSale = useCallback(async (data: CreateSaleRequest): Promise<boolean> => {
    const s = useSaleStore.getState()
    s.setActionLoading(true); s.setError(null)
    try {
      await createSaleApi(data)
      return true
    } catch (e) {
      s.setError(normalizeApiError(e).message)
      return false
    } finally {
      s.setActionLoading(false)
    }
  }, [])

  const confirmSale = useCallback(async (id: string): Promise<boolean> => {
    const s = useSaleStore.getState()
    s.setActionLoading(true); s.setError(null)
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

  const rejectSale = useCallback(async (id: string, data: RejectSaleRequest): Promise<boolean> => {
    const s = useSaleStore.getState()
    s.setActionLoading(true); s.setError(null)
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
  }, [])

  const refundSale = useCallback(async (id: string): Promise<boolean> => {
    const s = useSaleStore.getState()
    s.setActionLoading(true); s.setError(null)
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
    sales:               store.sales,
    mySales:             store.mySales,
    distributorSales:    store.distributorSales,
    selectedSale:        store.selectedSale,
    isLoading:           store.isLoading,
    isActionLoading:     store.isActionLoading,
    error:               store.error,
    fetchAllSales,
    fetchMySales,
    fetchDistributorSales,
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

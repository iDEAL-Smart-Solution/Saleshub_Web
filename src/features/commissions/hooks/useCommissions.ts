import { useState, useCallback } from 'react'
import {
  getAllCommissionsApi,
  getMyCommissionsApi,
  getCommissionsByMarketerApi,
  getCommissionsByBeneficiaryApi,
  getCommissionsByPerformanceApi,
  updateCommissionStatusApi,
} from '@/services/api/commission.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import { CommissionStatus, type CommissionResponse } from '@/types'

export function useCommissions() {
  const [commissions, setCommissions] = useState<CommissionResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setIsLoading(true); setError(null)
    try { setCommissions(await getAllCommissionsApi()) }
    catch (e) { setError(normalizeApiError(e).message) }
    finally { setIsLoading(false) }
  }, [])

  /**
   * GET /api/commissions/my
   * Works for all roles — returns commissions where BeneficiaryId == caller.
   * Marketer → KpiReward/Bonus, Distributor → 10%, MarketingLead → 2%.
   */
  const fetchMine = useCallback(async () => {
    setIsLoading(true); setError(null)
    try { setCommissions(await getMyCommissionsApi()) }
    catch (e) { setError(normalizeApiError(e).message) }
    finally { setIsLoading(false) }
  }, [])

  const fetchByMarketer = useCallback(async (marketerId: string) => {
    setIsLoading(true); setError(null)
    try { setCommissions(await getCommissionsByMarketerApi(marketerId)) }
    catch (e) { setError(normalizeApiError(e).message) }
    finally { setIsLoading(false) }
  }, [])

  const fetchByBeneficiary = useCallback(async (beneficiaryId: string) => {
    setIsLoading(true); setError(null)
    try { setCommissions(await getCommissionsByBeneficiaryApi(beneficiaryId)) }
    catch (e) { setError(normalizeApiError(e).message) }
    finally { setIsLoading(false) }
  }, [])

  const fetchByPerformance = useCallback(async (performanceId: string) => {
    setIsLoading(true); setError(null)
    try { setCommissions(await getCommissionsByPerformanceApi(performanceId)) }
    catch (e) { setError(normalizeApiError(e).message) }
    finally { setIsLoading(false) }
  }, [])

  const updateStatus = useCallback(
    async (id: string, status: CommissionStatus, note?: string): Promise<boolean> => {
      setIsActionLoading(true); setError(null)
      try {
        const updated = await updateCommissionStatusApi(id, status, note)
        setCommissions((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        return true
      } catch (e) {
        setError(normalizeApiError(e).message)
        return false
      } finally {
        setIsActionLoading(false)
      }
    },
    [],
  )

  return {
    commissions,
    isLoading,
    isActionLoading,
    error,
    fetchAll,
    fetchMine,
    fetchByMarketer,
    fetchByBeneficiary,
    fetchByPerformance,
    updateStatus,
    clearError: () => setError(null),
  }
}

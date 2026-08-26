import { useState, useCallback } from 'react'
import {
  getAllCommissionsApi,
  getMyCommissionsApi,
  getCommissionsByMarketerApi,
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
    setIsLoading(true)
    setError(null)
    try {
      setCommissions(await getAllCommissionsApi())
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchMine = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setCommissions(await getMyCommissionsApi())
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchByMarketer = useCallback(async (marketerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      setCommissions(await getCommissionsByMarketerApi(marketerId))
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchByPerformance = useCallback(async (performanceId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      setCommissions(await getCommissionsByPerformanceApi(performanceId))
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Admin manually moves a commission through its payout lifecycle.
   * Updates local state optimistically so the table reflects the change immediately.
   */
  const updateStatus = useCallback(
    async (id: string, status: CommissionStatus, note?: string): Promise<boolean> => {
      setIsActionLoading(true)
      setError(null)
      try {
        const updated = await updateCommissionStatusApi(id, status, note)
        setCommissions((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        )
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
    fetchByPerformance,
    updateStatus,
    clearError: () => setError(null),
  }
}

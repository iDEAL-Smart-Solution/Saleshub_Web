import { useState, useCallback } from 'react'
import {
  getAllMarketerPerformanceApi,
  getAllMarketerPerformanceHistoryApi,
} from '@/services/api/performance.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { MonthlyPerformanceResponse } from '@/types'

/**
 * Hook for the aggregate team performance views.
 *
 * fetchTeamPerformance(year, month)  — calls GET /api/marketers/performance (single month)
 * fetchTeamPerformance()             — calls GET /api/marketers/performance/history (all months)
 *
 * Both are MarketingLeadOrAbove endpoints.
 */
export function useTeamPerformance() {
  const [performances, setPerformances] = useState<MonthlyPerformanceResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamPerformance = useCallback(
    async (year?: number, month?: number) => {
      setIsLoading(true)
      setError(null)
      try {
        if (year !== undefined && month !== undefined) {
          // Single-month view
          setPerformances(await getAllMarketerPerformanceApi(year, month))
        } else {
          // Full history (all months, all marketers)
          setPerformances(await getAllMarketerPerformanceHistoryApi(year))
        }
      } catch (e) {
        setError(normalizeApiError(e).message)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    performances,
    isLoading,
    error,
    fetchTeamPerformance,
    clearError: () => setError(null),
  }
}

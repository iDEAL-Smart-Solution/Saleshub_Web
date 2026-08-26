import { useState, useCallback } from 'react'
import {
  getMyPerformanceApi,
  getMyPerformanceHistoryApi,
  compareMyPerformanceApi,
  getMarketerPerformanceApi,
  getMarketerPerformanceHistoryApi,
} from '@/services/api/performance.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { MonthlyPerformanceResponse, PerformanceComparisonResponse } from '@/types'

/** Hook for the authenticated marketer's own performance */
export function useMyPerformance() {
  const [performance, setPerformance] = useState<MonthlyPerformanceResponse | null>(null)
  const [history, setHistory] = useState<MonthlyPerformanceResponse[]>([])
  const [comparison, setComparison] = useState<PerformanceComparisonResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformance = useCallback(async (year?: number, month?: number) => {
    setIsLoading(true)
    setError(null)
    try {
      setPerformance(await getMyPerformanceApi(year, month))
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setHistory(await getMyPerformanceHistoryApi())
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchComparison = useCallback(
    async (yearA: number, monthA: number, yearB: number, monthB: number) => {
      setIsLoading(true)
      setError(null)
      try {
        setComparison(await compareMyPerformanceApi(yearA, monthA, yearB, monthB))
      } catch (e) {
        setError(normalizeApiError(e).message)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return {
    performance,
    history,
    comparison,
    isLoading,
    error,
    fetchPerformance,
    fetchHistory,
    fetchComparison,
    clearError: () => setError(null),
  }
}

/** Hook for admin/lead viewing a specific marketer's performance */
export function useMarketerPerformance() {
  const [performance, setPerformance] = useState<MonthlyPerformanceResponse | null>(null)
  const [history, setHistory] = useState<MonthlyPerformanceResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformance = useCallback(
    async (marketerId: string, year?: number, month?: number) => {
      setIsLoading(true)
      setError(null)
      try {
        setPerformance(await getMarketerPerformanceApi(marketerId, year, month))
      } catch (e) {
        setError(normalizeApiError(e).message)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const fetchHistory = useCallback(async (marketerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      setHistory(await getMarketerPerformanceHistoryApi(marketerId))
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    performance,
    history,
    isLoading,
    error,
    fetchPerformance,
    fetchHistory,
    clearError: () => setError(null),
  }
}

import { useState, useCallback } from 'react'
import { getActiveMarketersApi } from '@/services/api/user.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { MarketerSummaryResponse } from '@/types'

/**
 * Lightweight hook for fetching the active Marketer list.
 * Available to MarketingLead, Admin, and Dev via GET /api/users/marketers.
 * Uses local component state — no Zustand store needed since this is
 * purely a selector/dropdown data source.
 */
export function useMarketers() {
  const [marketers, setMarketers] = useState<MarketerSummaryResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setMarketers(await getActiveMarketersApi())
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    marketers,
    isLoading,
    error,
    fetchMarketers,
    clearError: () => setError(null),
  }
}

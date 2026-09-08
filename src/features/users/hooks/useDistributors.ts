import { useState, useCallback } from 'react'
import { getActiveDistributorsApi } from '@/services/api/user.service'
import { normalizeApiError } from '@/services/api/errorHandler'
import type { DistributorSummaryResponse } from '@/types'

/**
 * Lightweight hook for fetching the active Distributor list.
 * Available to MarketingLead/Admin/Dev via GET /api/users/distributors.
 * Used to populate the distributor selector when creating a marketer.
 */
export function useDistributors() {
  const [distributors, setDistributors] = useState<DistributorSummaryResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDistributors = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      setDistributors(await getActiveDistributorsApi())
    } catch (e) {
      setError(normalizeApiError(e).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    distributors,
    isLoading,
    error,
    fetchDistributors,
    clearError: () => setError(null),
  }
}
